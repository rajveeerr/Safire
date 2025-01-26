const express = require('express');

const moderationRoutes = require('./moderation/detect-harassment');
const userRoutes = require('./users/user');

const router = express.Router();

// router.get('/', (req, res) => {
//   res.json({
//     message: 'API',
//   });
// });

router.use('/moderation', moderationRoutes);
router.use('/users', userRoutes);

module.exports = router;