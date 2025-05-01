const Question = require("../models/questionModel");
const Answer = require("../models/answerModel");

class QuestionController{
    async get(req,res,next){
        try{
            let userId = req.fromJWT.userId;
            let {idTest,id} = req.body;
            let question = new Question();

            if (id && typeof id !== "undefined" && id > 0) {
                question = await question.find(userId,idTest,id);
            }else{
                question = await question.find(userId,idTest);
            }

            res.status(200).json(question[0]);
        }catch(error){
            console.log(error);
            next(error);
        }
    }
    async create(req,res,next){
        try{
            let userId = req.fromJWT.userId;
            let {idTest,name} = req.body;
            let question = new Question();
            await question.create(userId,idTest,userId,name);
            
            res.status(200).json({message: "Question created"});
        }catch(error){
            console.log(error);
            next(error);
        }
    }
    async update(req,res,next){
        try{
            let userId = req.fromJWT.userId;
            let {idTest,id,name} = req.body;
            let question = new Question();
            await question.update(userId,idTest,id,userId,name);
            
            res.status(200).json({message: "Question updated"});
        }catch(error){
            console.log(error);
            next(error);
        }
    }
    async delete(req,res,next){
        try{
            let userId = req.fromJWT.userId;
            let {idTest,id} = req.body;
            let question = new Question();
            await question.delete(userId,idTest,id,userId);
            
            res.status(200).json({message: "Question deleted"});
        }catch(error){
            console.log(error);
            next(error);
        }
    }
}

module.exports = new QuestionController();

