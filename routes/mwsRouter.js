var express = require("express");
var router = express.Router();
const mwssyncService = require("../service/mws/mwsSyncService");

router.get("/sync", (req, res, next) => {
	mwssyncService.updateInvetory(req.loggedUser.username)
		.then(response => {
			res.send("Updated Successfully");
		})
		.catch(err => {
			res.status(500).send(err);
		})
});
module.exports = router;
