const express = require('express');
const { listCareers, getCareer, byDegree } = require('../controllers/careerController');

const router = express.Router();

router.get('/by-degree', byDegree);
router.get('/', listCareers);
router.get('/:id', getCareer);

module.exports = router;