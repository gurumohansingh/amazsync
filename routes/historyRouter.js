var express = require('express');
var router = express.Router();
var historyService = require("../service/history/historyService");
var log = require("../service/log");


/**
 * get all history data
 */
router.get('/', function (req, res, next) {
  historyService.getAllHistory(req.query.fromDate, req.query.toDate, req.query.type, req.query.searchFilter).then((historydata) => {
    res.json(historydata);
  })
    .catch((error) => {
      res.status(500).send(error);
    })
});

module.exports = router;