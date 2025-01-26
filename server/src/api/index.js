const express = require('express');

const analyze = require('./detect-harassment');

const router = express.Router();

// router.get('/', (req, res) => {
//   res.json({
//     message: 'API',
//   });
// });

router.use('/moderation', analyze);

module.exports = router;