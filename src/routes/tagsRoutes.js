const express = require('express');
const router = express.Router();
const { createTag } = require('../controllers/tagsController');

router.post('/', createTag);

module.exports = router;
