require('dotenv').config();
const jwt = require('jsonwebtoken');
const ErrorController = require('../controllers/errorController');

module.exports = (req, res, next) => {
    if(req.method === 'OPTIONS'){
        return next()
    }

    try{
        const authorizationHeader = req.headers.authorization;
        if(!authorizationHeader){
            throw ErrorController.UnAuthorizedError();
        }
        const accessToken = authorizationHeader.split(' ')[1];
        if(!accessToken){
            throw ErrorController.UnAuthorizedError();
        }
        const userData = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET_KEY);
        if(!userData){
            throw ErrorController.UnAuthorizedError();
        }

        req.fromJWT = userData;

        next()
    }catch(error){
        return res.status(401).json({message:"Auth error.0"})
    }
}