const router = require('express').Router();
const { createOrUpdateLog, getTodayLog, getLogs, getSummary } = require('../controllers/dailyLogController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.post('/', createOrUpdateLog);
router.get('/today', getTodayLog);
router.get('/summary', getSummary);
router.get('/', getLogs);

module.exports = router;
