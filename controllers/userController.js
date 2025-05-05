const User = require("../models/userModel");
const ErrorController = require("./errorController");

class UserController{
    async getOne(req,res,next){
        try{
            //console.log("user=0=")
            let userId = req.fromJWT.userId;

            if (!userId || typeof userId === "undefined" || Number(userId) <= 0) {
                throw ErrorController.BadRequest(`Token not found`);
            }

            let user = await User.findById(userId)

            //console.log("user==")
            //console.log(user)

            res.status(200).json(user);
        }catch(error){
            console.log(error);
            next(error);
        }
    }
    async getAll(req,res,next){
        try{
            let user = await User.findAll()

            res.status(200).json(user);
        }catch(error){
            console.log(error);
            next(error);
        }
    }
    /*async create(req,res,next){
        try{
            let userId = req.fromJWT.userId;
            let {email} = req.body;
            let user = new User();
            await user.create(userId,email);
            
            res.status(200).json({message: "User created"});
        }catch(error){
            console.log(error);
            next(error);
        }
    }*/
    async update(req,res,next){
        try{
            let userId = req.fromJWT.userId;
            let {id,email} = req.body;
            let user = new User();

            await user.update(id,userId,email);
            
            res.status(200).json({message: "User updated"});
        }catch(error){
            console.log(error);
            next(error);
        }
    }
    async delete(req,res,next){
        try{
            let userId = req.fromJWT.userId;
            let {id} = req.body;
            let user = new User();
            await user.delete(id,userId);
            
            res.status(200).json({message: "User deleted"});
        }catch(error){
            console.log(error);
            next(error);
        }
    }
}
module.exports = new UserController();
