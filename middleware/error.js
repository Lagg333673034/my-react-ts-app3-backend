const ErrorController = require('../controllers/errorController');

module.exports = (err,req,res,next) => {
    console.log(err)

    //esli eto oshibka, kotoryy mi predysmotreli v nashem klasse "ErrorController", to delaem tak
    if(err instanceof ErrorController){

        return res.status(err.status).json({message: err.message, error: err.errors})

    }else{
        //a esli ety oshibky mi NE predysmotreli v nashem klasse "ErrorController", to delaem tak

        return res.status(500).json({message: "Unexpected server error"})

    }

};