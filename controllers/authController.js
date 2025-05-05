require('dotenv').config();
const {validationResult} = require('express-validator');
const User = require('../models/userModel');
const Token = require('../models/tokenModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {v4: uuidv4} = require('uuid');
const nodemailer = require('nodemailer');
const ErrorController = require('../controllers/errorController');
const https = require('https');

const transporter = nodemailer.createTransport({host: process.env.MAIL_HOST,secure: true,auth:{user: process.env.MAIL_USER,pass: process.env.MAIL_USER_PASSWORDFOR_SEND_EMAIL, }});
const cookieMaxAge = 30*24*60*60*1000; //30d

class AuthController{
    temp1;
    
    static async loginUsingEmailPassword(req,res,next){
        try{
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                throw ErrorController.BadRequest("Auth error", errors)
            }

            const {email,password} = req.body;
            let user = await User.findByEmail(email);

            if(!user || typeof user === "undefined" || !user.email && user.email != email){
                throw ErrorController.BadRequest(`User not found`);
            }
            if(!user.password || typeof user.password === "undefined"){
                throw ErrorController.BadRequest(`Password not exist`);
            }
            if(user.entryMethod == 2){
                throw ErrorController.BadRequest(`User with email ${user.email} already exist. Registered with ${user.entryMethodName}`);
            }
            const isPasswordValid = await bcrypt.compareSync(password, user.password)
            if(!isPasswordValid){
                throw ErrorController.BadRequest(`Invalid password`);
            }
            
            const tokens = Token.generate({userId: user.id});
            await Token.save(user.id, tokens.refreshToken);
            res.cookie('refreshToken', tokens.refreshToken, {maxAge: cookieMaxAge, httpOnly: true});

            return res.json({
                token: tokens.accessToken,
                user: {
                    email: user.email
                }
            })
        }catch (e){
            next(e)
        }
    }
    static async logout(req,res,next){
        try{
            const {refreshToken} = req.cookies;

            //console.log("refreshToken===DELETE===")
            //console.log(refreshToken)
            

            const result = await Token.delete(refreshToken);
            res.clearCookie('refreshToken');

            return res.json({done:"done"});
        }catch (e){
            next(e)
        }
    }
    static async refresh(req,res,next){
        try{
            try{
                //console.log("=========== VALID ===========")
                //if accessToken is valid, then do nothing

                const authorizationHeader = req.headers.authorization;
                const accessToken = authorizationHeader.split(' ')[1];
                const userData = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET_KEY);
                const user = await User.findById(userData.userId)

                return res.json({
                    token: accessToken,
                    user: {
                        email: user.email
                    }
                })
            }catch(error){
                //console.log("=========== INVALID ===========")
                //if accessToken is invalid, then generate a new using refreshToken

                const {refreshToken} = req.cookies;
                if(!refreshToken){
                    throw ErrorController.UnAuthorizedError();
                }

                let userDataFromToken = await jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET_KEY);
                let tokenFromDB = await Token.findDataByRefreshToken(refreshToken);

                if(!userDataFromToken || !tokenFromDB){
                    throw ErrorController.UnAuthorizedError();
                }else{
                    const user = await User.findById(tokenFromDB.idUser)
                    const tokens = await Token.generate({userId: user.id});
                    await Token.save(user.id, tokens.refreshToken);
                    res.cookie('refreshToken', tokens.refreshToken, {maxAge: cookieMaxAge, httpOnly: true});
            
                    return res.json({
                        token: tokens.accessToken,
                        user: {
                            email: user.email
                        }
                    })
                }
            }
        }catch (e){
            next(e)
        }
    }
    static async registratioUsingEmailPassword(req,res,next){
        try{
            const {email,password} = req.body;

            let user = await User.findByEmail(email);
            if(user && user.email == email){
                throw ErrorController.BadRequest(`User with email ${user.email} already exist. Registered with ${user.entryMethodName}`)
            }
            
            const hashPassword = await bcrypt.hash(password,3);
            await newUser.registratioUsingEmailAndPassword(0,email,hashPassword);
            
            return res.status(200).json({message: "User was created"});
        }catch (e){
            next(e)
        }
    }
    static async sendEmail(req,res,next){
        try{
            const {email} = req.body;
            const newUser = new User();

            if(!email || typeof email === "undefined" || email.length == 0){
                throw ErrorController.BadRequest("The entered Email not found")
            }

            let user = await newUser.findByEmail(email);
            if(!user || typeof user === "undefined" || !user.id || !user.id > 0 ){
                throw ErrorController.BadRequest(`User with email ${email} not found`)
            }

            const uuid = uuidv4();
            newUser.updateUuidByEmail(email,0,uuid)

            const link = `${process.env.MAIL_CLIENT_HOST}/change-password/${uuid}`;
            const html = 
            '<div>For recover password click to link below and input your new password.</div>'+
            '<a href="'+link+'" target="_blank">'+link+'</a>'+
            '';

            await transporter.sendMail({
                from: process.env.MAIL_USER,
                to: email,
                subject: 'Recower password on ' + process.env.MAIL_CLIENT_HOST,
                text: html,
                html: html
            })

            return res.status(200).json({message: "Letter has been sent to the email address you specified"});
        }catch (e){
            next(e)
        }
    }
    static async changePassword(req,res,next){
        try{
            const {uuid,newPassword} = req.body;

            if(!uuid || typeof uuid === "undefined" || uuid.length < 30){
                return res.status(400).json({message: "Uuid is incorrect"});
            }

            const newUser = new User();

            let user = await newUser.findByUuid(uuid);
            if(!user || typeof user === "undefined" || !user.email || user.email.length == 0){
                return res.status(400).json({message: `User not found`});
            }

            const hashPassword = await bcrypt.hash(newPassword, 3);

            await newUser.updatePasswordByEmail(user.email,uuid,0,hashPassword,);

            return res.status(200).json({message: `Password for ${user.email} has been changed.`});
        }catch (e){
            next(e)
        }
    }

 
    static async loginUsingGoogle(req,res,next){
        try{
            //https://www.googleapis.com/oauth2/v3/userinfo?access_token=<TOKEN>
            //https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=<TOKEN>
            const {google_access_token} = req.body
            
            
            const getDataFromGoogle = async (str) => 
                await new Promise((resolve, reject) => {
                    let data = "";
                    const req = https.request(
                        {
                            host: 'www.googleapis.com',
                            port: '443',
                            path: `/oauth2/v3/userinfo?access_token=${google_access_token}`,
                            method: 'GET',
                            headers: {
                                "Content-Type": "application/json",
                            },
                        },
                        (res) => {
                            res.on("data", (d) => {
                                data += d.toString();
                            });
                            res.on("end", () => {
                                resolve(data);
                            });
                        }
                    );
                    req.write(str);
                    req.end();
            })
            let userEmail = await getDataFromGoogle("data")
            userEmail = JSON.parse(userEmail).email
            

            /*
            let getDataFromGoogle = await fetch(
                `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${google_access_token}`
            ).then(
                data => {return data.text()}
            )
            let userEmail = JSON.parse(getDataFromGoogle).email;
            */

            if(!userEmail || typeof userEmail === "undefined" || !userEmail.length || userEmail.length == 0){
                throw ErrorController.BadRequest("Error: cannot finde user email in Google API")
                //return ("Error: cannot finde user email in Google API. Please try again.")
            }


            let user = await User.findByEmail(userEmail);
            if(user && user.id && typeof user.id !== "undefined" && Number(user.id) > 0){
                //exist in database. Check entryMethod
                if(user.entryMethod == 2){
                    //OK. by Google.
                    //login...  below....
                }
                if(user.entryMethod == 1){
                    //error
                    throw ErrorController.BadRequest(`User with email ${user.email} already exist. Registered with ${user.entryMethodName}`)
                }
            }else{
                //NOT exist in database. then create.
                await User.registratioUsingGoogle(0,userEmail);
            }


            //login.....
            
            user = await User.findByEmail(userEmail);

            const tokens = Token.generate({userId: user.id});
            await Token.save(user.id, tokens.refreshToken);
            res.cookie('refreshToken', tokens.refreshToken, {maxAge: cookieMaxAge, httpOnly: true});

            return res.json({
                token: tokens.accessToken,
                user: {
                    email: user.email
                }
            })
        }catch (e){
            next(e)
        }
    }
}

module.exports = AuthController;