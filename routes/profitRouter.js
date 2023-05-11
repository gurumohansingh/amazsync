var express = require('express');
var router = express.Router();
var profitService = require('../service/profit/profitService');

router.get('/getprofit', function (req, res, next) {
  profitService.getprofit(req.query.marketPlace)
    .then(response => { 
      res.send(response) 
    })

});

module.exports = router;
