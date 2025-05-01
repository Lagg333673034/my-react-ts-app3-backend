const User = require("../models/userModel");

class UserController{
    async get(req,res,next){
        try{
            let {id} = req.body;
            let user = new User();

            if (id && typeof id !== "undefined" && id > 0) {
                user = await user.find(id);
            }else{
                user = await user.find();
            }
              
            res.status(200).json(user[0]);
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
