const System = require('../models/systemModel');

class SystemController{
    static async getCurrentSystemTime(req,res,next){
        try{
            let serverTime = await System.getCurrentSystemTime()

            return res.json(serverTime)
        }catch (e){
            next(e)
        }
    }
}

module.exports = SystemController;