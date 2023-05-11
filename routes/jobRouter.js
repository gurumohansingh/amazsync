var express = require('express');
var router = express.Router();
var mwsSynchService = require('../service/mws/mwsSyncService');
/* GET home page. */
router.get('/fullamazonsynch', function (req, res, next) {
  mwsSynchService.updateInvetory("AutoJob")
    .then(response => { res.send(response) })
});

router.get('/fetchRestock', function (req, res, next) {
  mwsSynchService.fetchRestock("AutoJob")
    .then(response => { res.send(response) })
});

router.get('/fetchShipment', function (req, res, next) {
  mwsSynchService.fetchShipments("AutoJob")
    .then(response => { res.send(response) })
});


module.exports = router;
