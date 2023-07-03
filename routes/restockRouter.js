var express = require("express");
var router = express.Router();
var reStockService = require("../service/restock/restockService");
var log = require("../service/log");
var { authorization } = require("../service/requestValidate");

router.get(
  "/",
  /*authorization("Locations View"),*/ async (req, res, next) => {
    try {
      let totalCount = 0;
      const { start = 0, limit = 25 } = req.query;

      const inventories = await reStockService.getRestock(req.query)
      const inventoriesCount = await reStockService.getRestockCount(req.query)
  
      if (Array.isArray(inventoriesCount) && inventoriesCount.length) {
        totalCount = inventoriesCount.find(count => count)?.totalInventories || 0;
      }
  
      const currentPage = start ? Math.ceil((start - 1) / limit) + 1 : 1;
  
      res.send({
        currentPage,
        total: totalCount,
        inventories,
      })
    } catch(error) {
      console.log(error);
      log.error(error);
      res.status(500).send(error);
    }

  }
);

module.exports = router;
