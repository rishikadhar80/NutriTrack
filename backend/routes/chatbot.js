const router = require('express').Router();
const { chat } = require('../controllers/chatbotController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.post('/', chat);

module.exports = router;
