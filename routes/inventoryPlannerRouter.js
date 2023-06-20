var express = require("express");
var router = express.Router();
var log = require('../service/log');
const inventoryPlannerService = require("../service/inventoryPlannerService");
const productrService = require("../service/products/productsService");
const locationService = require("../service/location/locationService");
var { authorization } = require("../service/requestValidate");
const mwsService = require("../service/mws/mwsService");
router.get("/sync", async (req, res, next) => {
  try {
    var response = await inventoryPlannerService.fetchData(req.loggedUser.username);
    for (var i = 0; i < response.length; i++) {
      var shipmentItems = await inventoryPlannerService.fetchShipmentDetails(response[i]);
      if (shipmentItems.length > 0) {
        await inventoryPlannerService.savePurchaseOrder(response[i],shipmentItems);
      }
    };

    res.send("done");
  }
  catch (err) {
    log.error(`suppliersRouter ${err.message}`);
    res.status(500).send(err);
  };
});

router.get("/getpurchaseorder", async (req, res, next) => {
  try {
    let result = [];
    if (!req.query.type || req.query.type == 0) {
      result = await inventoryPlannerService.getPurchaseOrder() 
    } else {
      result = await inventoryPlannerService.getVirtualShipments(req.query.type)
    }

    res.send(result);
  } catch(error) {
    log.error(`getpurchaseorder ${error.message}`);
    res.status(500).send(error);
  }

});
router.post("/addvirtualshipment", async (req, res, next) => {
  var { items, sent, name, marketPlace, wareHouse } = req.body;
  var checkExists = await inventoryPlannerService.getShipmentByName(name);
  if (checkExists.length > 0)  {
    res.status(500).send("Shipment name already exist");
    return false
  }
  inventoryPlannerService.addVirtualShipment(req.loggedUser.username, items, sent, name, marketPlace, wareHouse)
    .then((response) => {
      res.send(response);
    })
    .catch((err) => {
      log.error(`getpurchaseorder ${err.message}`);
      res.status(500).send(err);
    });


});


router.delete("/deleteVirtualshipment", authorization("Inventory Edit Stock"), async (req, res, next) => {

  try {
    var inventory = await inventoryPlannerService.getVirtualShipmentById(req.body.shipmentId);
    var itemsData = JSON.parse(inventory[0].items);
    var warehouse = inventory[0].warehouse;
    for (var i = 0; i < itemsData.length; i++) {
      var stock = await locationService.getInventoryStock([itemsData[i].sku, warehouse]);

      if (stock.length > 0) {
        var newStock = stock[0].stock + itemsData[i].total_ordered;
        var sku = itemsData[i].sku;
        if (itemsData[i].masterSKU) {
          sku = itemsData[i].masterSKU
        }
        await locationService.updateInventoryStockNoMaster([newStock, sku, warehouse]);

      }
    }
    await inventoryPlannerService.removeVirtualShipmentById("Removed",req.body.shipmentId);
    res.send("Successfully");
  }
  catch (err) {
    log.error(err);
    res.status(500).send(err);
  }

});
module.exports = router;
