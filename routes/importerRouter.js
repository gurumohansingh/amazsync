var express = require("express");
var router = express.Router();
var importerService = require("../service/importer/importerService");
var log = require("../service/log");

router.get("/getcolumslist", (req, res, next) => {
     const tableName = req.query.tableName;
     if (!tableName) {
          res.status(400).send("Select a importer type")
     }
     const productColumns = ["imageUrl", "sellerSKU", "itemNameLocal", "isActiveLocal", "isPartSKUOnly", "UPCLocal", "EANLocal", "casePackUPC", "casePackQuantity", "packageWeightLocal", "dimensionsLocal", "hazmat", "itemNoteLocal", "amazonASIN", "amazonFNSKU", "additionalPrepInstructions", "expirationDateRequired", "reshippingCost", "prepMaterialCost", "prepLaborCost", "tag", "kit", "targetDaysInWarehouse", "targetDaysInAmazon", "countryofOriginLocal", "htcCodeLocal"];
     const supplierSkuColumns = ['productSKU', 'supplierID', 'supplierSKU', 'MAP', 'MSRP', 'MRP', 'tax', 'costPerUnit', 'alwaysPurchaseInCase', 'minimumOrderQuantity', 'inboundShippingCost', 'additionalSupplierCosts'];
     const supplierColumns = ["supplierName", "address", "address2", "city", "state", "country", "zipCode", "phone", "contactName", "contactEmail", "DefaultLeadTimeInDays", "freeFreightMin", "minPurchaseBudget", "paymentTerms", "PONotes", "defaultCurrency", "internalNotes", "shipmentMethod", "defaultTax", "defaultTargetDaysInWarehouse", "defaultTargetDaysInAmazon", "exclusiveAgreement", "restockModel"];
     if (tableName == "products") {
          res.send({ tableColumns: productColumns });
          return true;
     }
     if (tableName == "suppliers") {
          res.send({ tableColumns: supplierSkuColumns });
          return true;
     }
     if (tableName == "inventorystock") {
          res.send({ tableColumns: ["sku", "locationid", "stock"] });
          return true;
     }
     if (tableName == "suppliersList") {
          res.send({ tableColumns: supplierColumns });
          return true;
     }
     importerService.getColumList(tableName)
          .then(columns => {
               let colList = [];
               columns.forEach(column => {
                    column.Field != "id" ? colList.push(column.Field) : '';
               })
               res.send({ tableColumns: colList });
          })
          .catch(err => {
               log.error(err);
               res.status(500).send(err);
          })
});

router.post("/import", (req, res, next) => {
     const request = req.body;
     if (!request['tableName']) {
          res.status(400).send("Select a importer type")
     }
     importerService.import(request, req.loggedUser.username)
          .then(response => {
               res.send(response);
          })
          .catch(err => {
               log.error(err);
               res.status(500).send(err);
          })
});
module.exports = router;
