const express = require("express");
const FilterBuilder = require("../service/filter-builder/filterBuilder");
const router = express.Router();
const { authorization, validateToken } = require("../service/requestValidate");

router.get(
  "/",
  authorization("Product View"),
  validateToken,
  FilterBuilder.getFilters
);

router.post(
  "/save",
  authorization("Product View"),
  validateToken,
  FilterBuilder.saveFilterPreset
);

module.exports = router;
