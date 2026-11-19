const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
  create,
  list,
  update,
  makePrimary,
  remove,
} = require('../controllers/careerGoalController');

const router = express.Router();

router.post('/', protect, create);
router.get('/', protect, list);
router.put('/:id', protect, update);
router.post('/:id/primary', protect, makePrimary);
router.delete('/:id', protect, remove);

module.exports = router;