var express = require("express");
var router = express.Router();
var log = require('../service/log');
const suppliersService = require("../service/products/suppliersService");
var { authorization } = require("../service/requestValidate");

router.get("/", authorization("Suppliers View"), (req, res, next) => {
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
router.put("/", authorization("Suppliers Edit"), (req, res, next) => {
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

router.delete("/", authorization("Suppliers Delete"), (req, res, next) => {
     suppliersService
          .deleteSupplier(req.loggedUser.username, req.body)
          .then((response) => {
               res.send(response);
          })
          .catch((err) => {
               log.error(`suppliersRouter ${err.message}`);
               res.status(500).send(err);
          });
});

router.post("/", authorization("Suppliers Add New"), (req, res, next) => {
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

router.get("/productsuppliers", authorization("Product View"), (req, res, next) => {
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

router.post("/addsupplier", authorization("Product Edit"), (req, res, next) => {
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
router.put("/updatesupplier", authorization("Product Edit"), (req, res, next) => {
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

router.post("/deletesupplier", authorization("Product Edit"), (req, res, next) => {
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
