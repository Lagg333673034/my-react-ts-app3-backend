const ResultTest = require("../models/resultTestModel");

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
            let resultAlreadyPassed = await resultTest.findResultTestByIdUser(idTest,userId);
            resultAlreadyPassed = resultAlreadyPassed[0][0];
            if(resultAlreadyPassed && resultAlreadyPassed !== "undefined" && resultAlreadyPassed.id && resultAlreadyPassed.id > 0){
                let diff = Date.now() - new Date(resultAlreadyPassed.timeFinish);
                if(diff <= 1000 * 60){
                    return res.status(400).json({message: 
                        "You already passed this test. If you want to pass this test again, wait few minutes."+
                        "==diff=="+diff + 
                        "==fin=="+resultAlreadyPassed.timeFinish + 
                        "==new=="+new Date(resultAlreadyPassed.timeFinish)
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

            resultTest = await resultTest.saveResultTest(idTest,timeStart,timeFinish,userId,answers);

            res.status(200).json({message: "Result created"});
        }catch(error){
            console.log(error);
            next(error);
        }
    }
}

module.exports = new ResultTestController();