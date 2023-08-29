var express = require("express");
var router = express.Router();
const { validate } = require("../util/requestValidate");
const settings = require("../service/settings/sellerSettings");
const constant = require("../util/constant");
var _ = require("lodash");

router.get("/getsetting", settings.getSetting);

router.post("/updatesettings", settings.addOrUpdateSetting);

router.post("/update", settings.addOrUpdateSetting);

module.exports = router;
