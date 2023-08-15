const express = require("express");
const router = express.Router();
const { authorization, validateToken } = require("../service/requestValidate");
const {
  getAllLayouts,
  getSingleLayout,
  saveLayout,
} = require("../service/tableLayouts/tableLayoutService");

//get all layout list for a tab
router.get(
  "/",
  //   authorization("Product View"),
  //   validateToken,
  getAllLayouts
);

//get single layout with id
router.get(
  "/:id",
  // authorization("Product View"),
  // validateToken,
  getSingleLayout
);

//save layout to database
router.post(
  "/save",
  //   authorization("Product View"),
  //   validateToken,
  saveLayout
);

module.exports = router;
