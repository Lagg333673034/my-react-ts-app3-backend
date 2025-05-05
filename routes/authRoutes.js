const Router = require('express');
const {body} = require('express-validator');
const router = new Router();
const AuthController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

const AUTH_ROUTE = '/auth';

router.post(`${AUTH_ROUTE}/registration-using-email-password`, AuthController.registratioUsingEmailPassword);
router.post(`${AUTH_ROUTE}/login-using-email-password`, 
    body('email').isEmail(),
    body('password').isLength({min:3,max:32}),
    AuthController.loginUsingEmailPassword
);
router.get(`${AUTH_ROUTE}/refresh`, AuthController.refresh);
router.get(`${AUTH_ROUTE}/logout`, AuthController.logout);
router.post(`${AUTH_ROUTE}/restore-password-send-email`, AuthController.sendEmail);
router.post(`${AUTH_ROUTE}/restore-password-change-password`, AuthController.changePassword);




router.post(`${AUTH_ROUTE}/login-using-google`,AuthController.loginUsingGoogle);



module.exports = router;
