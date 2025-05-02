const Router = require('express');
const router = new Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

const AUTH_ROUTE = '/auth';

router.post(`${AUTH_ROUTE}/registration`, authController.registration);
router.post(`${AUTH_ROUTE}/login`, authController.login);
router.post(`${AUTH_ROUTE}/restore-password-send-email`, authController.sendEmail);
router.post(`${AUTH_ROUTE}/restore-password-change-password`, authController.changePassword);
router.get(`${AUTH_ROUTE}/checkAuth`, authMiddleware, authController.checkAuth);



module.exports = router;
