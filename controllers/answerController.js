const Answer = require("../models/answerModel");

class AnswerController{
    async get(req,res,next){
        try{
            let userId = req.fromJWT.userId;
            let {idQuestion,id} = req.body;
            let answer = new Answer();

            if (id && typeof id !== "undefined" && id > 0) {
                answer = await answer.find(userId,idQuestion,id);
            }else{
                answer = await answer.find(userId,idQuestion);
            }

            res.status(200).json(answer[0]);
        }catch(error){
            console.log(error);
            next(error);
        }
    }
    async create(req,res,next){
        try{
            let userId = req.fromJWT.userId;
            let {idQuestion,name} = req.body;
            let answer = new Answer();
            await answer.create(userId,idQuestion,userId,name);
            
            res.status(200).json({message: "Answer created"});
        }catch(error){
            console.log(error);
            next(error);
        }
    };
    async update(req,res,next){
        try{
            let userId = req.fromJWT.userId;
            let {idQuestion,id,name} = req.body;
            let answer = new Answer();
            await answer.update(userId,idQuestion,id,userId,name);
            
            res.status(200).json({message: "Answer updated"});
        }catch(error){
            console.log(error);
            next(error);
        }
    }
    async setCorrect(req,res,next){
        try{
            let userId = req.fromJWT.userId;
            let {idQuestion,id,correct} = req.body;
            let answer = new Answer();
            await answer.setCorrect(userId,idQuestion,id,userId,correct);
            
            res.status(200).json({message: "Answer updated"});
        }catch(error){
            console.log(error);
            next(error);
        }
    }
    async delete(req,res,next){
        try{
            let userId = req.fromJWT.userId;
            let {idQuestion,id} = req.body;
            let answer = new Answer();
            await answer.delete(userId,idQuestion,id,userId);
            
            res.status(200).json({message: "Answer deleted"});
        }catch(error){
            console.log(error);
            next(error);
        }
    }
}

module.exports = new AnswerController();
