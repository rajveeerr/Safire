const express = require('express');

const moderationRoutes = require('./moderation/detect-harassment');
const userRoutes = require('./user/user-routes');
const authenticationRoutes = require('./auth');

const router = express.Router();

router.use('/moderation', moderationRoutes);
router.use('/user', userRoutes);
router.use('/auth', authenticationRoutes);

module.exports = router;