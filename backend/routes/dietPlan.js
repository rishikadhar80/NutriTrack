const router = require('express').Router();
const { generatePlan, savePlan, getActivePlan, getPlans } = require('../controllers/dietPlanController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.post('/generate', generatePlan);
router.post('/', savePlan);
router.get('/active', getActivePlan);
router.get('/', getPlans);

module.exports = router;
