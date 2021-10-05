var express = require("express");
var router = express.Router();
const productsService = require("../service/products/productsService");

router.get("/getallproduct", (req, res, next) => {
  productsService.getAllProducts(req.loggedUser.username)
    .then(response => {
      res.send(response);
    })
    .catch(err => {
      res.status(500).send(err);
    })
});

router.get("/skulist", (req, res, next) => {
  productsService.getskuList(req.loggedUser.username)
    .then(response => {
      res.send(response);
    })
    .catch(err => {
      res.status(500).send(err);
    })
});

router.put("/update", (req, res, next) => {
  var updatedata = req.body;
  var params = {
    location: updatedata['location'],
    suppliers: updatedata['suppliers'],
    reshippingCost: updatedata['reshippingCost'],
    prepMaterialCost: updatedata['prepMaterialCost'],
    prepLaborCost: updatedata['prepLaborCost'],
    tag: Array.isArray(updatedata['tag']) ? updatedata['tag'].join(',') : updatedata['tag'],
    kit: updatedata['kit'],
    targetDaysOnHand: updatedata['targetDaysOnHand'],
    isPartSKUOnly: updatedata['isPartSKUOnly'],
    casePackUPC: updatedata['casePackUPC'],
    EANLocal: updatedata['EANLocal'],
    packageWeightLocal: updatedata['packageWeightLocal'],
    itemNoteLocal: updatedata['itemNoteLocal'],
    dimensionsLocal: updatedata['dimensionsLocal'],
    UPCLocal: updatedata['UPCLocal'],
    isActiveLocal: updatedata['isActiveLocal'],
    additionalPrepInstructions: updatedata['additionalPrepInstructions'],
  }
  productsService.updateProduct(req.loggedUser.username, params, updatedata['sellerSKU'])
    .then(response => {
      res.send(response);
    })
    .catch(err => {
      res.status(500).send(err);
    })
});
module.exports = router;