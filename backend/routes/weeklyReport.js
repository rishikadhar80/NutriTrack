const router = require('express').Router();
const { generateReport, getLatestReport, getReports } = require('../controllers/weeklyReportController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.post('/generate', generateReport);
router.get('/latest', getLatestReport);
router.get('/', getReports);

module.exports = router;
