var express = require("express");
var router = express.Router();
var locationService = require("../service/location/locationService");
var inventoryPlannerService = require("../service/inventoryPlannerService");
var log = require("../service/log");
var { authorization } = require("../service/requestValidate");
router.get("/getbinlocations", authorization("Locations View"), (req, res, next) => {
     locationService.getbinlocations(req.query.warehouseId)
          .then(locations => {
               res.send(locations);
          })
          .catch(err => {
               log.error(err);
               res.status(500).send(err);
          })
});

router.put("/updatebinlocations", authorization("Locations Edit"), (req, res, next) => {
     var params = [
          name = req.body.name,
          description = req.body.description,
          id = req.body.id]
     locationService.updatebinlocations(params)
          .then(warehouses => {
               res.send(warehouses);
          })
          .catch(err => {
               log.error(err);
               res.status(500).send(err);
          })
});

router.post("/addbinlocations", authorization("Locations Add"), (req, res, next) => {
     locationService.addbinlocations(req.body)
          .then(binlocation => {
               res.send("Added successfully");
          })
          .catch(err => {
               log.error(err);
               res.status(500).send(err);
          })
});

router.delete("/deletebinlocations", authorization("Locations Delete"), (req, res, next) => {
     locationService.deletebinlocations(req.body.id)
          .then(location => {
               res.send("Bin Location deleted");
          })
          .catch(err => {
               log.error(err);
               res.status(500).send(err);
          })
});

router.get("/getwarehouses", authorization("Locations View"), (req, res, next) => {
     locationService.getwarehouses()
          .then(warehouses => {
               res.send(warehouses);
          })
          .catch(err => {
               log.error(err);
               res.status(500).send(err);
          })
});

router.put("/updatewarehouse", authorization("Locations Warehouse Edit"), (req, res, next) => {
     var params = [
          name = req.body.name,
          address = req.body.address,
          description = req.body.description,
          id = req.body.id]
     locationService.updatewarehouse(params)
          .then(warehouses => {
               res.send(warehouses);
          })
          .catch(err => {
               log.error(err);
               res.status(500).send(err);
          })
});

router.post("/addwarehouse", authorization("Locations Warehouse Add"), (req, res, next) => {
     locationService.addwarehouse(req.body)
          .then(warehouses => {
               res.send("Warehouse added successfully");
          })
          .catch(err => {
               log.error(err);
               res.status(500).send(err);
          })
});

router.delete("/deletewarehouse", authorization("Locations Warehouse Delete"), (req, res, next) => {
     locationService.deletewarehouse(req.body.id)
          .then(warehouses => {
               res.send(warehouses);
          })
          .catch(err => {
               log.error(err);
               res.status(500).send(err);
          })
});

router.get("/validatebilocation", authorization("Inventory Edit Location"), (req, res, next) => {

     var params = [
          req.query.warehouseId,
          req.query.locationid,
          req.query.sku
     ]

     locationService.validateBilocation(params)
          .then(skulist => {
               res.send(skulist);
          })
          .catch(err => {
               log.error(err);
               res.status(500).send(err);
          })
});

router.delete("/removeproductlocation", authorization("Inventory Edit Location"), (req, res, next) => {

     var params = [
          req.body.warehouseId,
          req.body.locationid,
          req.body.sku
     ]

     locationService.removeproductlocation(params)
          .then(skulist => {
               res.send("Successfully");
          })
          .catch(err => {
               log.error(err);
               res.status(500).send(err);
          })
});

router.post("/updateProductlocation", authorization("Inventory Edit Location"), (req, res, next) => {
     var updateparams = [
          req.body.locationid,
          req.body.sku,
          req.body.warehouseId
     ]
     var insertparams = {
          sku: req.body.sku,
          warehouseId: req.body.warehouseId,
          locationid: req.body.locationid,

     }
     var checkparams = [
          req.body.sku,
          req.body.warehouseId
     ]
     locationService.getInventoryStock(checkparams)
          .then(skulist => {
               if (skulist.length == 0) {
                    locationService.addInventoryLocation(insertparams)
                         .then(skulist => {
                              res.send("Successfully");
                         })
                         .catch(err => {
                              log.error(err);
                              res.status(500).send(err);
                         })
               } else {
                    locationService.updateInventoryLocation(updateparams)
                         .then(skulist => {
                              res.send("Successfully");
                         })
                         .catch(err => {
                              log.error(err);
                              res.status(500).send(err);
                         })
               }
          })
          .catch(err => {
               log.error(err);
               res.status(500).send(err);
          })
});

router.post("/updateInventory", authorization("Inventory Edit Stock"), (req, res, next) => {

     var updateparams = [
          req.body.stock,
          req.body.masterSKU,
          req.body.sku,
          req.body.warehouseId

     ]
     var insertparams = {
          sku: req.body.sku,
          warehouseId: req.body.warehouseId,
          locationid: req.body.locationid,
          stock: req.body.stock,
          masterSKU: req.body.masterSKU
     }
     var checkparams = [
          req.body.sku,
          req.body.warehouseId,
          req.body.locationid
     ]
     locationService.getInventoryStock(checkparams)
          .then(skulist => {
               if (skulist.length == 0) {
                    locationService.addInventoryStock(insertparams)
                         .then(skulist => {
                              res.send("Successfully");
                         })
                         .catch(err => {
                              log.error(err);
                              res.status(500).send(err);
                         })
               } else {
                    locationService.updateInventoryStock(updateparams)
                         .then(skulist => {
                              res.send("Successfully");
                         })
                         .catch(err => {
                              log.error(err);
                              res.status(500).send(err);
                         })
               }
          })
          .catch(err => {
               log.error(err);
               res.status(500).send(err);
          })
});
router.get("/getlocalinventory", authorization("Inventory View"), (req, res, next) => {
     locationService.getlocalinventory(req.query.warehouseId)
          .then(list => {
               res.send(list);
          })
          .catch(err => {
               log.error(err);
               res.status(500).send(err);
          })
});
router.post("/updateBulkInventory", authorization("Inventory Edit Stock"), async (req, res, next) => {

     try {
          var data = JSON.parse(req.body.inventory);
          var action = req.body.action;
          var warehouse = req.body.warehouse;
          var inventory = await inventoryPlannerService.getVirtualShipmentById(req.body.shipmentId);
          var itemsData = JSON.parse(inventory[0].items);
          var updatedItem = [];

          for (var i = 0; i < data.length; i++) {
               var stock = await locationService.getInventoryStock([data[i].sku, warehouse]);
               var itemSku = itemsData.filter(item => item.sku == data[i].sku);

               if (stock.length > 0) {
                    var newStock = stock[0].stock + data[i].diff;
                    itemSku[0]['sent'] = data[i]['newSentQty'];
                    if (newStock < 0) {
                         newStock = 0;
                    }
                    var sku=data[i].sku;
                    if(data[i].masterSku){
                         var sku=data[i].masterSku;
                    }
                    await locationService.updateInventoryStockNoMaster([newStock,sku, warehouse]);

               }
          }
          await inventoryPlannerService.updateVirtualShipmentById(JSON.stringify(itemsData), req.body.shipmentId);
          if (action == "confirmFinalizeShipments") {
               await inventoryPlannerService.removeVirtualShipmentById("Finalized",req.body.shipmentId);
          }
          
          res.send("Successfully");
     }
     catch (err) {
          log.error(err);
          res.status(500).send(err);
     }

});

module.exports = router;
