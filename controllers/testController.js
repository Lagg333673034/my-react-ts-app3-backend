const Test = require("../models/testModel");
const {v4: uuidv4} = require('uuid');

class TestController{
    async get(req,res,next){
        try{
            let userId = req.fromJWT.userId;
            let {id} = req.body;
            let test = new Test();

            if (
                userId && typeof userId !== "undefined" && Number(userId) > 0 &&
                id && typeof id !== "undefined" && id > 0
            ) {
                test = await test.find(userId,id);
            }else{
                test = await test.find(userId);
            }
              
            res.status(200).json(test[0]);
        }catch(error){
            console.log(error);
            next(error);
        }
    }
    async readyForPass(req,res,next){
        try{
            //console.log("1");
            let userId = req.fromJWT.userId;
            let {id,uuid} = req.body;

            let test = new Test();

            if (!userId || typeof userId === "undefined" || userId == 0) {
                //proverka, chtobi polzovatel bil zaregistrirovan
                return res.status(400).json({message: "userId error"});
            }
            if (!uuid || typeof uuid === "undefined" || uuid.length == 0) {
                return res.status(400).json({message: "uuid error"});
            }
            if (!id || typeof id === "undefined" || id == 0) {
                return res.status(400).json({message: "idTest error"});
            }

            test = await test.readyForPass(id,uuid);
            res.status(200).json(test[0]);

        }catch(error){
            console.log(error);
            next(error);
        }
    }
    async create(req,res,next){
        try{
            let userId = req.fromJWT.userId;
            let {name} = req.body;
            let test = new Test();
            let uuid = uuidv4();

            await test.create(userId,userId,name,uuid);
            
            res.status(200).json({message: "Test created"});
        }catch(error){
            console.log(error);
            next(error);
        }
    }
    async update(req,res,next){
        try{
            let userId = req.fromJWT.userId;
            let {id,name} = req.body;
            let test = new Test();
            await test.update(userId,id,userId,name);
            
            res.status(200).json({message: "Test updated"});
        }catch(error){
            console.log(error);
            next(error);
        }
    }
    async setReady(req,res,next){
        try{
            let userId = req.fromJWT.userId;
            let {id,ready} = req.body;
            let test = new Test();
            await test.setReady(userId,id,userId,ready);
            
            res.status(200).json({message: "Test updated -> ready"});
        }catch(error){
            console.log(error);
            next(error);
        }
    }
    async setPublished(req,res,next){
        try{
            let userId = req.fromJWT.userId;
            let {id,published} = req.body;
            let test = new Test();
            await test.setPublished(userId,id,userId,published);
            
            res.status(200).json({message: "Test updated -> published"});
        }catch(error){
            console.log(error);
            next(error);
        }
    }
    async delete(req,res,next){
        try{
            let userId = req.fromJWT.userId;
            let {id} = req.body;
            let test = new Test();
            await test.delete(userId,id,userId);
            
            res.status(200).json({message: "Test deleted"});
        }catch(error){
            console.log(error);
            next(error);
        }
    }
}

module.exports = new TestController();