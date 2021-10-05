var express = require('express');
var router = express.Router();
var infoService = require('../service/inforService');
/* GET home page. */
router.get('/getLastSync', function (req, res, next) {
  infoService.getLastSync(req.loggedUser.username)
    .then(response => { res.send(response) })

});

module.exports = router;
