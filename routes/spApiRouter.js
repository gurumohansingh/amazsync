var express = require("express");
var router = express.Router();
var reStockService = require("../service/restock/restockService");
const sellingPartnerOperationsService = require("../service/sp-api/sellingPartnerOperationsService");

router.get("/updateSalesMatrix", async(req, res, next) => {
	var skus= await reStockService.getAllRestock();
	sellingPartnerOperationsService.getOrderMetricsThreeMonths();
	mwssyncService.updateInvetory(req.loggedUser.username)
		.then(response => {
			res.send("Updated Successfully");
		})
		.catch(err => {
			res.status(500).send(err);
		})
});

module.exports = router;
