var express = require("express");
var router = express.Router();
const settings = require("../service/settings/sellerSettings");
var _ = require("lodash");

router.get("/getsetting",settings.getSetting);

router.post("/updatesettings",settings.addOrUpdateSetting);

router.post("/update", settings.addOrUpdateSetting);


module.exports = router;
