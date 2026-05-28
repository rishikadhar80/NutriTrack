const router = require('express').Router();
const { getAchievements } = require('../controllers/achievementController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/', getAchievements);

module.exports = router;
