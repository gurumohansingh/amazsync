var express = require("express");
var router = express.Router();
const mwssyncService = require("../service/mws/mwsSyncService");
const mwsService = require("../service/mws/mwsService");
const spApiSyncService = require("../service/sync/spApiSyncService");
const sellingPartnerOperationsService = require("../service/sp-api/sellingPartnerOperationsService");
const constant = require('../util/constant');
router.get("/sync", (req, res, next) => {
	mwssyncService.updateInvetory(req.loggedUser.username)
		.then(response => {
			res.send("Updated Successfully");
		})
		.catch(err => {
			res.status(500).send(err);
		})
});

router.get("/nanosync", (req, res, next) => {
	mwssyncService.updateNanoInvetory(req.loggedUser.username)
		.then(response => {
			res.send("Updated Successfully");
		})
		.catch(err => {
			res.status(500).send(err);
		})
});

router.get("/sync/:asin", (req, res, next) => {
	mwssyncService.getMatchingProductForIdSingle(req.loggedUser.username, req.params.asin)
		.then(response => {
			res.send("Updated Successfully");
		})
		.catch(err => {
			res.status(500).send(err);
		})
});

router.get("/fetchrestock", (req, res, next) => {
	mwssyncService.fetchRestock(req.loggedUser.username)
		.then(response => {
			res.send("Updated Successfully");
		})
		.catch(err => {
			res.status(500).send(err);
		})
});

router.get("/fetchShipmentByName", async (req, res, next) => {
	var user = req.loggedUser.username;
	
	var params = {
		ShipmentStatusList: ['WORKING', 'SHIPPED', 'IN_TRANSIT', 'DELIVERED', 'CHECKED_IN', 'RECEIVING', 'CLOSED'],
		QueryType: 'DATE_RANGE',
		MarketplaceId: constant.MARKETPLACE_ID_US,
		LastUpdatedAfter: new Date(new Date().setFullYear(new Date().getFullYear() - 2)),
		LastUpdatedBefore: new Date()
	}
	sellingPartnerOperationsService.fetchShipmentByName(params).then((ids) => {
		var shipmentId = [];
		ids.ShipmentData.forEach((item) => {
			if (item.ShipmentName.toLowerCase().indexOf(req.query.shipmentName.toLowerCase()) > -1) {
				shipmentId.push({ shipmentId: item.ShipmentId, status: item.ShipmentStatus })
			}
		})
		var loadNext = function (token) {
			params['QueryType'] = 'NEXT_TOKEN'
			params['NextToken'] = token
			sellingPartnerOperationsService.fetchShipmentByName(params).then((nextids) => {
				if (nextids.ShipmentData) {
					nextids.ShipmentData.forEach((item) => {
						if (item.ShipmentName.toLowerCase().indexOf(req.query.shipmentName.toLowerCase()) > -1) {
							shipmentId.push({ shipmentId: item.ShipmentId, status: item.ShipmentStatus })
						}
					})
				}
				if (nextids.NextToken) {
					loadNext(nextids.NextToken);
				}
				else {
					res.send(shipmentId);
				}
			})

		}
		if (ids.NextToken) {
			loadNext(ids.NextToken)
		}
		else {
			res.send(shipmentId);
		}

	})
		.catch((error) => {
			res.status(500).send(err);
		})
});

router.post('/inboundshipment', function (req, res, next) {
	var shipmentId = req.body.shipments, promises = [], allShipments = [], csv = [];
	if (shipmentId) {
		if (Array.isArray(shipmentId)) {
			for (i = 0; i < shipmentId.length; i++) {
				promises.push(mwsService.fetchinboundShipment(req.loggedUser.username, shipmentId[i]));
			}
		} else {
			promises.push(mwsService.fetchinboundShipment(req.loggedUser.username, shipmentId));
		}
		Promise.all(promises).then((result) => {
			result.forEach((responseitem) => {
				if (responseitem.length > 0) {
					var allShipments = responseitem;
					allShipments.forEach((item) => {
						var QuantityShipped = item.QuantityShipped, SellerSKU = item.SellerSKU, ShipmentId = item.ShipmentId,
							QuantityInCase = item.QuantityInCase;
						var search = csv.filter((csvItem) => {
							if (csvItem.SKU == SellerSKU && csvItem.ShipmentId == ShipmentId) {
								return true;
							}
						});
						if (search.length > 0) {
							search[0].LocalQuantity += QuantityShipped;
							search[0].QuantityInCase += QuantityInCase;
						}
						else {
							csv.push({ SKU: SellerSKU, QuantityShipped: 0 + QuantityShipped, ShipmentId: ShipmentId, QuantityInCase: 0 + QuantityInCase })
						}
					})
				} else if (responseitem.SellerSKU) {
					var item = responseitem;
					var QuantityShipped = item.QuantityShipped, SellerSKU = item.SellerSKU, ShipmentId = item.ShipmentId,
						QuantityInCase = item.QuantityInCase;

					var search = csv.filter((csvItem) => {
						if (csvItem.SKU == SellerSKU && csvItem.ShipmentId == ShipmentId) {
							return true;
						}
					});
					if (search.length > 0) {
						search[0].LocalQuantity += QuantityShipped;
						search[0].QuantityInCase += QuantityInCase;
					}
					else {
						csv.push({ SKU: SellerSKU, QuantityShipped: 0 + QuantityShipped, ShipmentId: ShipmentId, QuantityInCase: 0 + QuantityInCase })
					}
				}
			})
			res.send(csv);
		})
			.catch((error) => {
				res.status(500).send(error);
			})
	}
	else {
		res.end("Please enter ShipmentID");
	}
});

router.get('/fetchFeesEstimate', function (req, res, next) {
	var user = req.loggedUser.username;
	spApiSyncService.getFeesEstimateBySKU("")
	  .then(response => { res.send(response) })
  });
  
module.exports = router;
