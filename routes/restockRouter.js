var express = require("express");
var router = express.Router();
var reStockService = require("../service/restock/restockService");
var log = require("../service/log");
var { authorization } = require("../service/requestValidate");

router.get("/", /*authorization("Locations View"),*/(req, res, next) => {
     reStockService.getRestock(req.query.wareHouse, req.query.marketPlace)
          .then(restock => {
               res.send(restock);
          })
          .catch(err => {
               log.error(err);
               res.status(500).send(err);
          })
});

module.exports = router;
