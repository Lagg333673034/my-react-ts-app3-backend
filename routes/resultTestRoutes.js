const Router = require('express');
const router = new Router();
const resultTestController = require('../controllers/resultTestController');
const authMiddleware = require('../middleware/auth');

const RESULTTEST_ROUTE = '/resultTest';

router.post(`${RESULTTEST_ROUTE}/get`, authMiddleware, resultTestController.get);
router.post(`${RESULTTEST_ROUTE}/getAnswers`, authMiddleware, resultTestController.getAnswers);
router.post(`${RESULTTEST_ROUTE}/getScore`, authMiddleware, resultTestController.getScore);
router.post(`${RESULTTEST_ROUTE}/save`, authMiddleware, resultTestController.save);



module.exports = router;
