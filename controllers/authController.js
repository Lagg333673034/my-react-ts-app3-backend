require('dotenv').config();
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {v4: uuidv4} = require('uuid');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    secure: true,
    auth:{
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_USER_PASSWORDFOR_SEND_EMAIL, 
    }
});
module.exports = transporter;

class AuthController{
    async checkAuth(req,res,next){
        try{
            const newUser = new User();
            let user = await newUser.find(req.fromJWT.userId)
            user = user[0];
            user = user[0];

            const token = jwt.sign({userId: user.id}, process.env.JWT_SECRET_KEY, {expiresIn:"4h"})

            return res.json({
                token: token,
                user: {
                    id: user.id,
                    email: user.email
                }
            })
        }catch (e){
            console.log(e);
            res.send({message:"Server refresh error"})
        }
    }
    async login(req,res,next){
        try{
            const {email,password} = req.body;
            const newUser = new User();

            let user = await newUser.findByEmail(email);
            user = user[0][0];

            if(!user || typeof user === "undefined" || !user.email && user.email != email){
                return res.status(400).json({message: "User not found"});
            }

            if(!user.password || typeof user.password === "undefined"){
                return res.status(400).json({message: "Password not exist"});
            }

            const isPasswordValid = await bcrypt.compareSync(password, user.password)
            if(!isPasswordValid){
                return res.status(400).json({message: "Invalid password"});
            }

            const token = jwt.sign({userId: user.id}, process.env.JWT_SECRET_KEY, {expiresIn:"4h"})

            return res.json({
                token: token,
                user: {
                    id: user.id,
                    email: user.email
                }
            })
        }catch (e){
            console.log(e);
            res.send({message:"Server login error"})
        }
    }
    async registration(req,res,next){
        try{
            const {email,password} = req.body;
            const newUser = new User();

            let user = await newUser.findByEmail(email);
            user = user[0];
            user = user[0];
            if(user && user.email == email){
                return res.status(400).json({message: `User with email ${email} already exist`});
            }
            
            const hashPassword = await bcrypt.hash(password,3);
            await newUser.registration(0,email,hashPassword);
            
            return res.status(200).json({message: "User was created"});
        }catch (e){
            console.log(e);
            res.send({message:"Server registration error"})
        }
    }
    async sendEmail(req,res,next){
        try{
            const {email} = req.body;
            //console.log(email);
            const newUser = new User();

            if(!email || typeof email === "undefined" || email.length == 0){
                return res.status(400).json({message: "The entered Email not found"});
            }

            let user = await newUser.findByEmail(email);
            user = user[0][0];
            if(!user || typeof user === "undefined" || !user.id || !user.id > 0 ){
                return res.status(400).json({message: `User with email ${email} not found`});
            }

            const uuid = uuidv4();
            newUser.updateUuidByEmail(email,0,uuid)

            const link = `http://${process.env.MAIL_CLIENT_HOST}/change-password/${uuid}`;
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
            console.log(e);
            return res.status(500).json({message:"Server login error"})
        }
    }
    async changePassword(req,res,next){
        try{
            const {uuid,newPassword} = req.body;
            //console.log(uuid);
            //console.log(newPassword);

            if(!uuid || typeof uuid === "undefined" || uuid.length < 30){
                return res.status(400).json({message: "Uuid is incorrect"});
            }

            const newUser = new User();

            let user = await newUser.findByUuid(uuid);
            user = user[0][0];
            if(!user || typeof user === "undefined" || !user.email || user.email.length == 0){
                return res.status(400).json({message: `User not found`});
            }

            const hashPassword = await bcrypt.hash(newPassword, 3);

            await newUser.updatePasswordByEmail(user.email,uuid,0,hashPassword,);

            return res.status(200).json({message: `Password for user with email ${user.email} has been changed.`});
        }catch (e){
            console.log(e);
            res.send({message:"Server login error"})
        }
    }
}

module.exports = new AuthController();