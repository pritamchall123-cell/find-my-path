const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');
const {
  addCareer,
  editCareer,
  removeCareer,
  listSkills,
  addSkill,
} = require('../controllers/adminController');

const router = express.Router();

router.use(protect, adminOnly);

router.post('/careers', addCareer);
router.put('/careers/:id', editCareer);
router.delete('/careers/:id', removeCareer);
router.get('/skills', listSkills);
router.post('/skills', addSkill);

module.exports = router;