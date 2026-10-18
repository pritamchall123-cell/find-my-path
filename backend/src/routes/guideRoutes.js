const express = require('express');
const { listAll, getOne } = require('../controllers/guideController');

const router = express.Router();

router.get('/', listAll);
router.get('/:level', getOne);

module.exports = router;