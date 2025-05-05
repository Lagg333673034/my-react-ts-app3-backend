const Router = require('express');
const router = new Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');

const USER_ROUTE = '/user';

router.post(`${USER_ROUTE}/getOne`, authMiddleware, userController.getOne); 
router.post(`${USER_ROUTE}/getAll`, authMiddleware, userController.getAll); 
router.patch(`${USER_ROUTE}/update`, authMiddleware, userController.update);
router.delete(`${USER_ROUTE}/delete`, authMiddleware, userController.delete);


module.exports = router;
