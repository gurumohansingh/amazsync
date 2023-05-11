var express = require("express");
var router = express.Router();
const productsService = require("../service/products/productsService");
var { authorization } = require("../service/requestValidate");

router.get("/getallproduct", authorization("Product View"), (req, res, next) => {
  productsService.getAllProducts(req.loggedUser.username, req.query['amazonLiveStatus'])
    .then(response => {
      res.send(response);
    })
    .catch(err => {
      res.status(500).send(err);
    })
});

router.get("/skulist", authorization("Product View"), (req, res, next) => {
  productsService.getskuList(req.loggedUser.username)
    .then(response => {
      res.send(response);
    })
    .catch(err => {
      res.status(500).send(err);
    })
});

router.put("/update", authorization("Product Edit"), (req, res, next) => {
  var updatedata = req.body;
  var params = {
    suppliers: updatedata['suppliers'],
    reshippingCost: updatedata['reshippingCost'],
    prepMaterialCost: updatedata['prepMaterialCost'],
    prepLaborCost: updatedata['prepLaborCost'],
    tag: Array.isArray(updatedata['tag']) ? updatedata['tag'].join(',') : updatedata['tag'],
    targetDaysInAmazon: updatedata['targetDaysInAmazon'],
    targetDaysInWarehouse: updatedata['targetDaysInWarehouse'],
    isPartSKUOnly: updatedata['isPartSKUOnly'],
    EANLocal: updatedata['EANLocal'],
    packageWeightLocal: updatedata['packageWeightLocal'],
    itemNoteLocal: updatedata['itemNoteLocal'],
    dimensionsLocal: updatedata['dimensionsLocal'],
    UPCLocal: updatedata['UPCLocal'],
    isActiveLocal: updatedata['isActiveLocal'],
    additionalPrepInstructions: updatedata['additionalPrepInstructions'],
    itemNameLocal: updatedata['itemNameLocal'],
    countryofOriginLocal: updatedata['countryofOriginLocal'],
    htcCodeLocal: updatedata['htcCodeLocal'],
    casePackQuantity: updatedata['casePackQuantity'],
    casePackUPC: updatedata['casePackUPC'],
    ismasterSku: updatedata['ismasterSku'],
    masterSku: updatedata['masterSku']
  }
  productsService.updateProduct(req.loggedUser.username, params, updatedata['sellerSKU'])
    .then(response => {
      res.send(response);
    })
    .catch(err => {
      res.status(500).send(err);
    })
});
router.post("/update", authorization("Product Edit"), (req, res, next) => {
  var updatedata = req.body;
  var params = {
    suppliers: updatedata['suppliers'],
    reshippingCost: updatedata['reshippingCost'],
    prepMaterialCost: updatedata['prepMaterialCost'],
    prepLaborCost: updatedata['prepLaborCost'],
    tag: Array.isArray(updatedata['tag']) ? updatedata['tag'].join(',') : updatedata['tag'],
    targetDaysInAmazon: updatedata['targetDaysInAmazon'],
    targetDaysInWarehouse: updatedata['targetDaysInWarehouse'],
    isPartSKUOnly: updatedata['isPartSKUOnly'],
    EANLocal: updatedata['EANLocal'],
    packageWeightLocal: updatedata['packageWeightLocal'],
    itemNoteLocal: updatedata['itemNoteLocal'],
    dimensionsLocal: updatedata['dimensionsLocal'],
    UPCLocal: updatedata['UPCLocal'],
    isActiveLocal: updatedata['isActiveLocal'],
    additionalPrepInstructions: updatedata['additionalPrepInstructions'],
    itemNameLocal: updatedata['itemNameLocal'],
    countryofOriginLocal: updatedata['countryofOriginLocal'],
    htcCodeLocal: updatedata['htcCodeLocal'],
    casePackQuantity: updatedata['casePackQuantity'],
    casePackUPC: updatedata['casePackUPC'],
    ismasterSku: updatedata['ismasterSku'],
    masterSku: updatedata['masterSku']
  }
  const newSKU = `SellerSKU${Math.floor(Math.random() * 999999)}`
  productsService.addProduct(req.loggedUser.username, params, newSKU)
    .then(response => {
      res.send(response);
    })
    .catch(err => {
      res.status(500).send(err);
    })
});


router.get("/getproduct", authorization("Product View"), (req, res, next) => {
  productsService.getProduct(req.query.sku)
    .then(response => {
      res.send(response);
    })
    .catch(err => {
      res.status(500).send(err);
    })
});
router.get("/getmastersku", authorization("Product View"), (req, res, next) => {
  productsService.getMastersku()
    .then(response => {
      res.send(response);
    })
    .catch(err => {
      res.status(500).send(err);
    })
});
module.exports = router;