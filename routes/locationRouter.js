var express = require("express");
var router = express.Router();
var locationService = require("../service/location/locationService");
var log = require("../service/log");

router.get("/getbinlocations", (req, res, next) => {
     locationService.getbinlocations(req.query.warehouseId)
          .then(locations => {
               res.send(locations);
          })
          .catch(err => {
               log.error(err);
               res.status(500).send(err);
          })
});

router.put("/updatebinlocations", (req, res, next) => {
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

router.post("/addbinlocations", (req, res, next) => {
     locationService.addbinlocations(req.body)
          .then(binlocation => {
               res.send("Added successfully");
          })
          .catch(err => {
               log.error(err);
               res.status(500).send(err);
          })
});

router.delete("/deletebinlocations", (req, res, next) => {
     locationService.deletebinlocations(req.body.id)
          .then(location => {
               res.send("Bin Location deleted");
          })
          .catch(err => {
               log.error(err);
               res.status(500).send(err);
          })
});

router.get("/getwarehouses", (req, res, next) => {
     locationService.getwarehouses()
          .then(warehouses => {
               res.send(warehouses);
          })
          .catch(err => {
               log.error(err);
               res.status(500).send(err);
          })
});

router.put("/updatewarehouse", (req, res, next) => {
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

router.post("/addwarehouse", (req, res, next) => {
     locationService.addwarehouse(req.body)
          .then(warehouses => {
               res.send("Warehouse added successfully");
          })
          .catch(err => {
               log.error(err);
               res.status(500).send(err);
          })
});

router.delete("/deletewarehouse", (req, res, next) => {
     locationService.deletewarehouse(req.body.id)
          .then(warehouses => {
               res.send(warehouses);
          })
          .catch(err => {
               log.error(err);
               res.status(500).send(err);
          })
});

router.get("/validatebilocation", (req, res, next) => {

     var params = [
          req.query.warehouseId,
          req.query.id,
          req.query.sellerSKU
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

router.delete("/removeproductlocation", (req, res, next) => {

     var params = [
          req.body.warehouseId,
          req.body.id,
          req.body.sellerSKU
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


module.exports = router;
