var express = require("express");
var router = express.Router();
var log = require("../service/log");
var locationService = require("../service/location/locationService");

router.get('/downloadlocationsample', (req, res, next) => {
     let filename = 'locations.csv';
     res.setHeader('Content-disposition', `attachment; filename=${filename}`);
     //res.setHeader('Content-Type', 'text/csv');
     res.end('name,description');
})
router.post("/uploadlocationcsv", (req, res, next) => {

     if (req.files && req.files.locationfile.size > 0 && req.files.locationfile.data.toString('utf8').trim() != "") {
          var warehouseId = req.body.warehouseId;
          var file = req.files.locationfile.data.toString('utf8').trim();
          locationService.addBulkLocation(warehouseId, file)
               .then(warehouses => {
                    res.send("Warehouse added successfully");
               })
               .catch(err => {
                    log.error(err);
                    res.status(500).send(err);
               })
     }
     else {
          res.send("Please check the file");
     }
});

module.exports = router;
