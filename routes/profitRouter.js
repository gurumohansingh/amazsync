var express = require('express');
var router = express.Router();
var profitService = require('../service/profit/profitService');
const { isValidCode } = require('../util/requestValidate');

router.get('/getprofit', async (req, res, next) => {
  try {
    let totalCount = 0;
    const { start = 0, limit = 25 } = req.query;
    const profits = await profitService.getProfit(req.query)
    const profitResponseCount = await profitService.getProfitCountQuery(req.query)

    if (Array.isArray(profitResponseCount) && profitResponseCount.length) {
      totalCount = profitResponseCount.find(count => count)?.totalProfits || 0;
    }

    const currentPage = start ? Math.ceil((start - 1) / limit) + 1 : 1;

    res.send({
      currentPage,
      total: totalCount,
      profits,
    })
  } catch (error) {
    console.log("error", error)
    res.status(isValidCode(error.code) ? error.code : 500).send(error)  
  }

  

});

module.exports = router;
