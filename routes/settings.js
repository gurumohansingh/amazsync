var express = require("express");
var router = express.Router();
const { validate } = require("../util/requestValidate");
const settings = require("../service/settings/sellerSettings");
const constant = require("../util/constant");
var _ = require("lodash");

router.post("/update", (req, res, next) => {
	let setting = req.body;
	validate(setting, ["SellerId", "MWSAuthToken", "AWSAccessKeyId", "ClientSecret", "MarketPalaceID",], res);
	settings.getSetting(req.loggedUser.username, constant.SELLERSETTINGGROUP)
		.then((result) => {
			if (result && result.length > 0) {
				settings.updateSetting(
					req.loggedUser.username,
					setting,
					constant.SELLERSETTINGGROUP
				).then(responce => {
					res.end("Updated Successfully")
				})
					.catch(error => {
						res.status(500).send(error);
					})
			} else {
				settings.addSetting(
					req.loggedUser.username,
					setting,
					constant.SELLERSETTINGGROUP
				).then(responce => {
					res.end("Updated Successfully")
				})
					.catch(error => {
						res.status(500).send(error);
					})
			}
		});
});
router.get("/getsetting", (req, res, next) => {

	settings.getSetting(req.loggedUser.username, req.query.settinggroup)
		.then(result => {
			if (result && result.length > 0) {
				res.send(result[0]);
			}
			else {
				res.status(404);
			}
		})
		.catch(error => {
			res.status(500).send(error);
		})

});
router.post("/updatesettings", (req, res, next) => {
	let setting = req.body;

	settings.getSetting(req.loggedUser.username, setting.settinggroup)
		.then((result) => {
			if (result && result.length > 0) {
				settings.updateSetting(
					req.loggedUser.username,
					setting,
					setting.settinggroup
				).then(responce => {
					res.end("Updated Successfully")
				})
					.catch(error => {
						res.status(500).send(error);
					})
			} else {
				settings.addSetting(
					req.loggedUser.username,
					setting,
					setting.settinggroup
				).then(responce => {
					res.end("Updated Successfully")
				})
					.catch(error => {
						res.status(500).send(error);
					})
			}
		});
});
module.exports = router;
