var express = require("express");
var router = express.Router();
var log = require("../service/log");
var locationService = require("../service/location/locationService");
var { authorizationForm } = require("../service/requestValidate");
const csv = require('csvtojson');
const { Parser } = require('json2csv');
router.post('/downloadlocationsample', authorizationForm("Locations Download Sample"), (req, res, next) => {
     let filename = 'locations.csv';
     res.setHeader('Content-disposition', `attachment; filename=${filename}`);
     //res.setHeader('Content-Type', 'text/csv');
     res.end('name,description');
})
router.post("/uploadlocationcsv", authorizationForm("Locations Upload"), (req, res, next) => {

     if (req.files && req.files.locationfile.size > 0 && req.files.locationfile.data.toString('utf8').trim() != "") {
          var warehouseId = req.body.warehouseId;
          var file = req.files.locationfile.data.toString('utf8').trim();
          locationService.addBulkLocation(warehouseId, file)
               .then(warehouses => {
                    res.status(200).send("Warehouse added successfully");
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
router.post("/importer", authorizationForm("Locations Upload"), (req, res, next) => {

     if (req.files && req.files.locationfile.size > 0 && req.files.locationfile.data.toString('utf8').trim() != "") {
          var warehouseId = req.body.warehouseId;
          var file = req.files.locationfile.data.toString('utf8').trim();
          locationService.addBulkLocation(warehouseId, file)
               .then(warehouses => {
                    res.status(200).send("Warehouse added successfully");
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


router.post("/getfileHeader", authorizationForm("Locations Upload"), async (req, res, next) => {

     if (req.files && req.files.importer.size > 0 && req.files.importer.data.toString('utf8').trim() != "") {
          var file = req.files.importer.data.toString('utf8').trim();
          let jsonData = await csv().fromString(file);
          res.send({ csvColumns: Object.keys(jsonData[0]), fileData: jsonData });
     }
     else {
          res.send("Please check the file");
     }
});


router.post('/exportToCsv', async (req, res, next) => {
     try {
          let filename = req.body.fileName;
          let data = JSON.parse(req.body.fileData);
          res.setHeader('Content-disposition', `attachment; filename=${filename}`);
          const parser = new Parser();
          const csv = parser.parse(data);
          res.end(csv)
     } catch (err) {
          res.end(err)
     }
     ;
})

module.exports = router;
