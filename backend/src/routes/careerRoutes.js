const express = require('express');
const { listCareers, getCareer, byDegree, getPlanBForCareer } = require('../controllers/careerController');

const router = express.Router();

router.get('/by-degree', byDegree);
router.get('/', listCareers);
router.get('/:id', getCareer);
router.get('/:id/plan-b', getPlanBForCareer);

module.exports = router;