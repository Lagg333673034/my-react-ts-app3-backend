require('dotenv').config();
const jwt = require('jsonwebtoken');
const ErrorController = require('../controllers/errorController');

module.exports = (req, res, next) => {
    if(req.method === 'OPTIONS'){
        return next()
    }

    try{
        //console.log('req.headers.authorization=');
        //console.log(req.headers.authorization);

        const authorizationHeader = req.headers.authorization;
        if(!authorizationHeader){
            //return res.status(401).json({message:"Auth error.1"})
            throw ErrorController.UnAuthorizedError();
        }


        const accessToken = authorizationHeader.split(' ')[1];
        if(!accessToken){
            //return res.status(401).json({message:"Auth error.2"})
            throw ErrorController.UnAuthorizedError();
        }


        //const userData = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
        const userData = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET_KEY);
        if(!userData){
            //return res.status(401).json({message:"Auth error.3"})
            throw ErrorController.UnAuthorizedError();
        }

        //console.log('userData=');
        //console.log(userData);

        req.fromJWT = userData;
        //req.fromJWT = "";
        
        //console.log('req.fromJWT=');
        //console.log(req.fromJWT);

        next()
    }catch(error){
        return res.status(401).json({message:"Auth error.0"})
    }
}