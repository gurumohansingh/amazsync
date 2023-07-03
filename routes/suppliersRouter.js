var express = require("express");
var router = express.Router();
var log = require('../service/log');
const suppliersService = require("../service/products/suppliersService");
var { authorization } = require("../service/requestValidate");
const { isValidCode } = require("../util/requestValidate");

router.get("/", authorization("Suppliers View"), async (req, res, next) => {
  try {
    let totalCount = 0;
    const { start = 0, limit = 25 } = req.query;
    const suppliers = await suppliersService.getAllSuppliers(req.query)
    const supplierCount = await suppliersService.getProfitCountQuery(req.query)

    if (Array.isArray(supplierCount) && supplierCount.length) {
      totalCount = supplierCount.find(count => count)?.totalSupplier || 0;
    }

    const currentPage = start ? Math.ceil((start - 1) / limit) + 1 : 1;

    res.send({
      currentPage,
      total: totalCount,
      suppliers,
    })
  } catch (error) {
    console.log("error", error)
    log.error(`suppliersRouter ${error.message}`);
    res.status(isValidCode(error.code) ? error.code : 500).send(error)  
  }
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
