const Router = require('express');
const router = new Router();
const answerController = require('../controllers/answerController');
const authMiddleware = require('../middleware/auth');

const ANSWER_ROUTE = '/answer';

router.post(`${ANSWER_ROUTE}/get`, authMiddleware, answerController.get);
router.post(`${ANSWER_ROUTE}/create`, authMiddleware, answerController.create);
router.patch(`${ANSWER_ROUTE}/update`, authMiddleware, answerController.update);
router.patch(`${ANSWER_ROUTE}/set-correct`, authMiddleware, answerController.setCorrect);
router.delete(`${ANSWER_ROUTE}/delete`, authMiddleware, answerController.delete);


module.exports = router;
