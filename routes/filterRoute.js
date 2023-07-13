const express = require('express');
const FilterBuilder = require('../service/filter-builder/FilterBuilder');
const router = express.Router();
const { authorization } = require("../service/requestValidate");

router.post('/save', authorization('Product View'), FilterBuilder.saveFilterPreset);
router.post('/get/:page', authorization('Product View'), FilterBuilder.saveFilterPreset);

module.exports = router;
