var express = require("express");
var router = express.Router();
var kitService = require("../service/kit/kitService");
var log = require("../service/log");

router.get("/getallkitproducts", (req, res, next) => {
     kitService.getAllKitProducts(req.query.sellerSKU)
          .then(products => {
               res.send(products);
          })
          .catch(err => {
               log.error(err);
               res.status(500).send(err);
          })
});
router.get("/getkitproducts", (req, res, next) => {
     kitService.getKitProducts(req.query.parentSku)
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
          parentSku: req.body.parentSku
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


module.exports = router;
