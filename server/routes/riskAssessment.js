const router = require('express').Router();
const { generateAssessment, getLatestAssessment } = require('../controllers/riskAssessmentController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.post('/generate', generateAssessment);
router.get('/latest', getLatestAssessment);

module.exports = router;
