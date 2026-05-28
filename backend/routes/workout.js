const router = require('express').Router();
const { generateWorkout, saveWorkout, getWorkouts, completeWorkout } = require('../controllers/workoutController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.post('/generate', generateWorkout);
router.post('/', saveWorkout);
router.get('/', getWorkouts);
router.put('/:id/complete', completeWorkout);

module.exports = router;
