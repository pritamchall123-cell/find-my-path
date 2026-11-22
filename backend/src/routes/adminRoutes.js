const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');
const {
  addCareer,
  editCareer,
  removeCareer,
  listSkills,
  addSkill,
  addInstitution,
  editInstitution,
  removeInstitution,
  getStats,
  getUsers,
} = require('../controllers/adminController');

const router = express.Router();

router.use(protect, adminOnly);

router.get('/stats', getStats);
router.get('/users', getUsers);

router.post('/careers', addCareer);
router.put('/careers/:id', editCareer);
router.delete('/careers/:id', removeCareer);
router.get('/skills', listSkills);
router.post('/skills', addSkill);

router.post('/institutions', addInstitution);
router.put('/institutions/:id', editInstitution);
router.delete('/institutions/:id', removeInstitution);

module.exports = router;