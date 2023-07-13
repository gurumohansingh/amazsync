var express = require('express');
var router = express.Router();
const filterRoute = require('./filterRoute')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index')
});

router.use('/filter-builder', filterRoute)

module.exports = router;
