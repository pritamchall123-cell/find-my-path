const express = require('express');
const { listSectors, getSector } = require('../controllers/directoryController');

const router = express.Router();

router.get('/sectors', listSectors);
router.get('/sectors/:slug', getSector);

module.exports = router;