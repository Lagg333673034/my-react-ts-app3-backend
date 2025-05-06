const ResultTest = require("../models/resultTestModel");
const System = require("../models/systemModel");

class ResultTestController{
    async get(req,res,next){
        try{
            let userId = req.fromJWT.userId;
            let {idTest} = req.body;
            let resultTest = new ResultTest();

            if (
                userId && typeof userId !== "undefined" && Number(userId) > 0 && 
                idTest && typeof idTest !== "undefined" && Number(idTest) > 0 
            ){
                resultTest = await resultTest.findResultTest(userId,idTest);
            }
            res.status(200).json(resultTest[0]);
        }catch(error){
            console.log(error);
            next(error);
        }
    }
    async getAnswers(req,res,next){
        try{
            let userId = req.fromJWT.userId;
            let {idResultTest} = req.body;
            let resultTest = new ResultTest();

            if (
                userId && typeof userId !== "undefined" && Number(userId) > 0 && 
                idResultTest && typeof idResultTest !== "undefined" && Number(idResultTest) > 0 
            ) {
                resultTest = await resultTest.findResultTestAnswers(userId,idResultTest);
            }
              
            res.status(200).json(resultTest[0]);
        }catch(error){
            console.log(error);
            next(error);
        }
    }
    async getScore(req,res,next){
        try{
            let userId = req.fromJWT.userId;
            let {idResultTest} = req.body;
            let resultScore = new ResultTest();

            if (
                userId && typeof userId !== "undefined" && Number(userId) > 0 && 
                idResultTest && typeof idResultTest !== "undefined" && Number(idResultTest) > 0 
            ) {
                resultScore = await resultScore.calculateScore(userId,idResultTest);
            }
              
            res.status(200).json(resultScore[0]);
        }catch(error){
            console.log(error);
            next(error);
        }
    }
    async save(req,res,next){
        try{
            let userId = req.fromJWT.userId;
            let {idTest,timeStart,timeFinish,answers} = req.body;
            let resultTest = new ResultTest();
            /*---------------------------------------------------------*/
            let resultLastTest = await resultTest.findResultTestByIdUser(idTest,userId);
            resultLastTest = resultLastTest[0][0];
            if(resultLastTest && resultLastTest !== "undefined" && resultLastTest.id && resultLastTest.id > 0){
                
                let timeNow = await System.getCurrentSystemTime()
                timeNow = new Date(timeNow.time).toISOString();
                let timeLastTest = new Date(resultLastTest.timeFinish).toISOString();
                let diff = new Date(timeNow) - new Date(timeLastTest);
                if(diff <= 1000*60*5){
                    /*"==timeNow=="+new Date(timeNow).toISOString()+
                    "==timeLastTest=="+new Date(timeLastTest).toISOString()+
                    "==timeStart=A="+new Date(timeStart).toLocaleString()+
                    "==timeFinish=A="+new Date(timeFinish).toLocaleString()*/
                    return res.status(400).json({message: 
                        "You already passed this test. You can pass this test again after five minutes."
                    });
                }
            }
            /*---------------------------------------------------------*/


            if (!idTest || typeof idTest === "undefined" || idTest == 0) {
                return res.status(400).json({message: "idTest error"});
            }
            if (!timeStart || typeof timeStart === "undefined" || timeStart.length == 0) {
                return res.status(400).json({message: "timeStart error"});
            }
            if (!timeFinish || typeof timeFinish === "undefined" || timeFinish.length == 0) {
                return res.status(400).json({message: "timeFinish error"});
            }
            if (!userId || typeof userId === "undefined" || userId == 0) {
                return res.status(400).json({message: "userId error"});
            }

            /*---------------------------------------------------------*/
            if (answers && typeof userId !== "undefined" && answers.length > 0) {
                resultTest = await resultTest.saveResultTest(idTest,timeStart,timeFinish,userId,answers);
            }
            /*---------------------------------------------------------*/

            res.status(200).json({message: "Result created"});
        }catch(error){
            console.log(error);
            next(error);
        }
    }
    async delete(req,res,next){
        try{
            let userId = req.fromJWT.userId;
            let {idTest,id} = req.body;
           
            let del = await ResultTest.delete(userId,idTest,id);

            res.status(200).json({message: "Result created"});
        }catch(error){
            console.log(error);
            next(error);
        }
    }
}

module.exports = new ResultTestController();