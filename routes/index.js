const Router = require('express');
const router = new Router();

const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const testRoutes = require('./testRoutes');
const resultTestRoutes = require('./resultTestRoutes');
const questionRoutes = require('./questionRoutes');
const answerRoutes = require('./answerRoutes');

router.use('/api',authRoutes);
router.use('/api',userRoutes);
router.use('/api',testRoutes);
router.use('/api',resultTestRoutes);
router.use('/api',questionRoutes);
router.use('/api',answerRoutes);

module.exports = router;
