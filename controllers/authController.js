require('dotenv').config();
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class AuthController{
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
    async login(req,res,next){
        try{
            const {email,password} = req.body;
            const newUser = new User();

            let user = await newUser.findByEmail(email);
            user = user[0];
            user = user[0];

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
}

module.exports = new AuthController();