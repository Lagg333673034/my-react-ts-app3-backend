const Router = require('express');
const router = new Router();
const questionController = require('../controllers/questionController');
const authMiddleware = require('../middleware/auth');

const QUESTION_ROUTE = '/question';

router.post(`${QUESTION_ROUTE}/get`, authMiddleware, questionController.get);
router.post(`${QUESTION_ROUTE}/create`, authMiddleware, questionController.create);
router.patch(`${QUESTION_ROUTE}/update`, authMiddleware, questionController.update);
router.delete(`${QUESTION_ROUTE}/delete`, authMiddleware, questionController.delete);


module.exports = router;
