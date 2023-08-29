var express = require("express");
var router = express.Router();
const productsService = require("../service/products/productsService");
var { authorization } = require("../service/requestValidate");
const { isValidCode } = require("../util/requestValidate");

router.get(
  "/getallproduct",
  authorization("Product View"),
  async (req, res, next) => {
    let totalCount = 0;
    const { start, limit } = req.query;

    try {
      const products = await productsService.getAllProducts(req.query);
      const productCountResult =
        await productsService.getTotalRecordsForProductList(req.query);

      if (Array.isArray(productCountResult) && productCountResult.length) {
        totalCount =
          productCountResult.find((count) => count)?.totalProducts || 0;
      }

      const currentPage = start ? Math.ceil((start - 1) / limit) + 1 : 1;

      res.send({
        currentPage,
        total: totalCount,
        products,
      });
    } catch (error) {
      res.status(isValidCode(error.code) ? error.code : 500).send(error);
    }
  }
);

router.get("/skulist", authorization("Product View"), (req, res, next) => {
  productsService
    .getskuList(req.loggedUser.username)
    .then((response) => {
      res.send(response);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

router.put(
  "/update",
  authorization("Product Edit"),
  productsService.updateProduct
);

router.post(
  "/update",
  authorization("Product Edit"),
  productsService.addProduct
);

router.get("/getproduct", authorization("Product View"), (req, res, next) => {
  productsService
    .getProduct(req.query.sku)
    .then((response) => {
      res.send(response);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});
router.get("/getmastersku", authorization("Product View"), (req, res, next) => {
  productsService
    .getMastersku()
    .then((response) => {
      res.send(response);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});
module.exports = router;
