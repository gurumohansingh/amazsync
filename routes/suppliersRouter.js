var express = require("express");
var router = express.Router();
var log = require('../service/log');
const suppliersService = require("../service/products/suppliersService");

router.get("/", (req, res, next) => {
     suppliersService
          .getAllSuppliers(req.loggedUser.username)
          .then((response) => {
               res.send(response);
          })
          .catch((err) => {
               log.error(`suppliersRouter ${err.message}`);
               res.status(500).send(err);
          });
});
router.put("/", (req, res, next) => {
     suppliersService
          .updateSupplier(req.loggedUser.username, req.body)
          .then((response) => {
               res.send(response);
          })
          .catch((err) => {
               log.error(`suppliersRouter ${err.message}`);
               res.status(500).send(err);

          });
});

router.delete("/", (req, res, next) => {
     suppliersService
          .deleteSupplier(req.loggedUser.username, req.query)
          .then((response) => {
               res.send(response);
          })
          .catch((err) => {
               log.error(`suppliersRouter ${err.message}`);
               res.status(500).send(err);
          });
});

router.post("/", (req, res, next) => {
     suppliersService
          .addSupplier(req.loggedUser.username, req.body)
          .then((response) => {
               res.send(response);
          })
          .catch((err) => {
               log.error(`suppliersRouter ${err.message}`);
               res.status(500).send(err);
          });
});

router.get("/productsuppliers", (req, res, next) => {
     if (req.query.productSKU == "") {
          res.status(500).send();
     } else {
          suppliersService
               .getProductsuppliers(req.loggedUser.username, req.query.productSKU)
               .then((response) => {
                    res.send(response);
               })
               .catch((err) => {
                    log.error(`suppliersRouter ${err.message}`);
                    res.status(500).send(err);
               });
     }
});

router.post("/addsupplier", (req, res, next) => {
     var params = req.body;
     if (params.productSKU == "" || params.supplierID == "") {
          res.status(500).send();
     } else {
          suppliersService
               .addProductsupplier(req.loggedUser.username, params)
               .then((response) => {
                    res.send(response);
               })
               .catch((err) => {
                    log.error(`suppliersRouter ${err.message}`);
                    res.status(500).send(err);
               });
     }
});
router.put("/updatesupplier", (req, res, next) => {
     var params = req.body;
     if (params.productSKU == "" || params.supplierID == "") {
          res.status(500).send();
     }
     else {
          suppliersService
               .updateProductsupplier(req.loggedUser.username, params)
               .then((response) => {
                    res.send(response);
               })
               .catch((err) => {
                    log.error(`suppliersRouter ${err.message}`);
                    res.status(500).send(err);
               });
     }
});

router.post("/deletesupplier", (req, res, next) => {
     var params = req.body;
     if (params.productSKU == "" || params.supplierID == "") {
          res.status(500).send();
     }
     else {
          suppliersService
               .deleteProductsupplier(req.loggedUser.username, params)
               .then((response) => {
                    res.send(response);
               })
               .catch((err) => {
                    log.error(`suppliersRouter ${err.message}`);
                    res.status(500).send(err);
               });
     }
});
module.exports = router;
