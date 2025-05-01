const Router = require('express');
const router = new Router();
const testController = require('../controllers/testController');
const authMiddleware = require('../middleware/auth');

const TEST_ROUTE = '/test';

router.post(`${TEST_ROUTE}/get`, authMiddleware, testController.get);

router.post(`${TEST_ROUTE}/ready-for-pass`, authMiddleware, testController.readyForPass);

router.post(`${TEST_ROUTE}/create`, authMiddleware, testController.create);
router.patch(`${TEST_ROUTE}/update`, authMiddleware, testController.update);
router.patch(`${TEST_ROUTE}/set-ready`, authMiddleware, testController.setReady);
router.patch(`${TEST_ROUTE}/set-published`, authMiddleware, testController.setPublished);
router.delete(`${TEST_ROUTE}/delete`, authMiddleware, testController.delete);


module.exports = router;
