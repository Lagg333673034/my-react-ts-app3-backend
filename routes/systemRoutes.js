const Router = require('express');
const router = new Router();
const SystemController = require('../controllers/systemController');
const SYSTEM_ROUTE = '/system';

router.post(`${SYSTEM_ROUTE}/getCurrentSystemTime`,SystemController.getCurrentSystemTime);

module.exports = router;
