class ErrorController extends Error{
    status;
    errors;

    constructor(status, message, errors=[]){
        super(message);
        this.status = status;
        this.errors = errors;
    }

    static UnAuthorizedError(){
        return new ErrorController(401,'User is unauthorized')
    }

    static BadRequest(message, errors=[]){
        return new ErrorController(400,message,errors)
    }

}
module.exports = ErrorController;