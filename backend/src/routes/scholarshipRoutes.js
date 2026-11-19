const express = require('express');
const { list, listStatePortals, findMatches } = require('../controllers/scholarshipController');

const router = express.Router();

router.get('/', list);
router.get('/state-portals', listStatePortals);
router.post('/match', findMatches);

module.exports = router;