var express = require("express");
var router = express.Router();
const { validate } = require("../util/requestValidate");
const sellerSettings = require("../service/settings/sellerSettings");
const constant = require("../util/constant");
var _ = require("lodash");
router.post("/update", (req, res, next) => {
	let setting = req.body;

	validate(setting, ["SellerId", "MWSAuthToken", "AWSAccessKeyId", "ClientSecret", "MarketPalaceID",], res);
	sellerSettings.getSetting(req.loggedUser.username, constant.SELLERSETTINGGROUP)
		.then((result) => {
			if (result && result.length > 0) {
				sellerSettings.updateSetting(
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
				sellerSettings.addSetting(
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
router.get("/getsellerSetting", (req, res, next) => {
	sellerSettings.getSetting(req.loggedUser.username, constant.SELLERSETTINGGROUP)
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

module.exports = router;
