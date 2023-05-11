var express = require("express");
var router = express.Router();
var kitService = require("../service/kit/kitService");
var log = require("../service/log");

router.get("/getallkitproducts", (req, res, next) => {
     var likTextSearc = `%${req.query.searchTxt}%`;
     var params = [
          req.query.sellerSKU,
          likTextSearc,
          likTextSearc,
          likTextSearc
     ];
     kitService.getAllKitProducts(params)
          .then(products => {
               res.send(products);
          })
          .catch(err => {
               log.error(err);
               res.status(500).send(err);
          })
});
router.get("/getkitproducts", (req, res, next) => {
     kitService.getKitProducts(req.query.parentSku, req.query.warehouseId)
          .then(kit => {
               res.send(kit);
          })
          .catch(err => {
               log.error(err);
               res.status(500).send(err);
          })
});

router.post("/addkitproduct", (req, res, next) => {
     var params = {
          sku: req.body.sku,
          parentSku: req.body.parentSku,
          count: 1
     }
     kitService.addkitproduct(params)
          .then(warehouses => {
               res.send(warehouses);
          })
          .catch(err => {
               log.error(err);
               res.status(500).send(err);
          })
});

router.delete("/deletekitproduct", (req, res, next) => {
     var params = [
          req.body.sku,
          req.body.parentSku
     ];
     kitService.deletekitproduct(params)
          .then(kit => {
               res.send("Added successfully");
          })
          .catch(err => {
               log.error(err);
               res.status(500).send(err);
          })
});
router.post("/updatekitcount", (req, res, next) => {
     var params = [
          req.body.count,
          req.body.sku,
          req.body.parentSku
     ];
     kitService.updatekitcount(params)
          .then(kit => {
               res.send("Updated successfully");
          })
          .catch(err => {
               log.error(err);
               res.status(500).send(err);
          })
});
router.post("/updatekitname", (req, res, next) => {
     var params = [
          req.body.itemNameLocal,
          req.body.parentSku
     ];
     kitService.updatekitname(params)
          .then(kit => {
               res.send("Updated successfully");
          })
          .catch(err => {
               log.error(err);
               res.status(500).send(err);
          })
});
module.exports = router;
