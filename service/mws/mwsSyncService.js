const mwsService = require('../mws/mwsService'),
     constant = require("../../util/constant"),
     mysql = require("../mysql"),
     { getProduct, addProduct, updateProduct, updateProductDetailsbyId, updateFNSKU, addLastSynch, updateProductsLive,
          updateProductUI, getRestockData, addRestock, updateRestock } = require("../../util/sqlquery"),
     log = require('../log'),
     historyService = require('../../service/history/historyService'),
     spApiSyncService=require('../../service/sync/spApiSyncService'),
     sellingPartnerAPIService = require('../../service/sp-api/sellingPartnerAPIService'); 
     const inventoryPlannerService = require("../../service/inventoryPlannerService");    
class mwsSyncService {
     async updateInvetory(user) {
          try {
               log.info(`Sync start by ${user}`);
               var lastSync = { username: user, type: "Full Product Sync", start_time: new Date(), end_time: "", status: "Failed" };
               var config = await mwsService.getConfig(user);
               var latestReportId= await sellingPartnerAPIService.getreportId("GET_MERCHANT_LISTINGS_ALL_DATA", constant.MARKETPLACE_ID_US);
               var latestData = await sellingPartnerAPIService.getreport(latestReportId[0].reportDocumentId);

               log.info(`Report ID ${latestReportId[0].reportDocumentId}`);
               
               log.info(`Total products  ${latestData.length} for reportid ${latestReportId}`);
               var savedProductsList = await mysql.query(getProduct, null);
               await mysql.query(updateProductsLive, null);
               var updatedData = await this.synchProductWithDB(latestData, savedProductsList, user);
               await this.getMatchingProductForId(user);
               await this.fetchFNSKU(user);
               lastSync["end_time"] = new Date();
               lastSync["status"] = "Success";
               await mysql.query(addLastSynch, lastSync);
               return new Promise((resolve, reject) => {
                    resolve(updatedData)
               });
          }
          catch (error) {
               lastSync["end_time"] = new Date();
               await mysql.query(addLastSynch, lastSync);
          }
     }

     async updateNanoInvetory(user) {
          log.info(`Nano Sync start by ${user}`);
          var config = await mwsService.getConfig(user);
          var latestReportId = await mwsService.getReportslist(user, constant.GET_MERCHANT_LISTINGS_ALL_DATA_, 1);
          log.info(`Report ID ${latestReportId}`);
          var latestData = await mwsService.getreport(user, latestReportId);
          log.info(`Total products  ${latestData.data.length} for reportid ${latestReportId}`);
          var savedProductsList = await mysql.query(getProduct, null);

          var latestDataOnly = await this.filterNewSkuData(latestData.data, savedProductsList);
          //newSkuList: newSkuList, dbSkuList: dbSkuList

          var updatedData = await this.synchProductWithDB(latestDataOnly.newSkuList, savedProductsList, user);

          if (latestDataOnly.dbSkuList.length > 0) {
               await this.getMatchingProductForId(user, latestDataOnly.dbSkuList);
          }

          await this.fetchFNSKU(user);
          return new Promise((resolve, reject) => {
               resolve(updatedData)
          });

     }
     async synchProductWithDB(serverProducts, DBProducts = [], user) {
          let totalupdateList = [], totalAddList = 0;
          var config = await mwsService.getConfig(user);
          try {

               serverProducts.forEach((product) => {
                    var found = DBProducts.filter(item => {
                         return product['seller-sku'] == item['sellerSKU']
                    });
                    if (found && found.length > 0) {
                         //itemName=?,status=?,itemNote=?,productId=?,productIdType=?,sellerId,sellerSKU
                         var updateList = [
                              product['item-name'],
                              product['status'],
                              product['item-note'],
                              product['product-id'],
                              product['product-id-type'],
                              config.SellerId,
                              product['seller-sku']
                         ];
                         //updateLiveStatus.push([{ amzlive: 1 }, product['seller-sku']])
                         totalupdateList.push(updateList);
                         var oldValue = {
                              itemName: found[0]["itemName"],
                              status: found[0]["status"],
                              itemNote: found[0]["itemNote"],
                              productId: found[0]["productId"],
                              productIdType: found[0]["productIdType"],
                              sellerId: found[0]["sellerId"],
                              sellerSKU: found[0]["sellerSKU"],
                         };
                         var newValue = {
                              itemName: product['item-name'],
                              status: product['status'],
                              itemNote: product['item-note'],
                              productId: product['product-id'],
                              productIdType: product['product-id-type'],
                              sellerId: config.SellerId,
                              sellerSKU: product['seller-sku']
                         };

                         historyService.addHistory("Products", user, JSON.stringify(oldValue), JSON.stringify(newValue));
                         mysql.query(updateProduct, updateList)
                              .then(sqlResponse => {
                                   //log.info(`Updated products ${sqlResponse.affectedRows}`);
                              })
                              .catch(error => {
                                   log.error(`Error while Updating  products ${error}`);
                              })
                    }
                    else {
                         //sellerId,user,imageUrl,itemName,sellerSKU,status,itemNote,dateAdded,amazonASIN,productId,productIdType
                         totalAddList++;
                         var newList = [
                              config.SellerId,
                              user,
                              product['item-name'] || '',
                              product['seller-sku'],
                              product['status'] || '',
                              product['item-note'] || '',
                              product['open-date'] || '',
                              product['asin1'] || '',
                              product['product-id'] || '',
                              product['product-id-type'] || '',
                              1
                         ]
                         var newValue = {
                              sellerId: config.SellerId,
                              user: user,
                              itemName: product['item-name'] || '',
                              sellerSKU: product['seller-sku'],
                              status: product['status'] || '',
                              itemNote: product['item-note'] || '',
                              dateAdded: product['open-date'] || '',
                              amazonASIN: product['asin1'] || '',
                              productId: product['product-id'] || '',
                              productIdType: product['product-id-type'] || '',
                              amzlive: 1
                         }

                         historyService.addHistory("Products", user, null, JSON.stringify(newValue));
                         mysql.query(addProduct, [newList])
                              .then(sqlResponse => {
                                   // log.info(`Total added products ${sqlResponse.affectedRows}`);
                              })
                              .catch(error => {
                                   log.error(`Error while adding  products ${error}`);
                              })
                    }
               });
               log.info(`Adding new products ${totalAddList}`);
               log.info(`Adding new products ${totalAddList}`);
               log.info(`Updating products ${totalupdateList.length}`);
               // if (newList.length > 0) {
               //      mysql.query(addProduct, newList)
               //           .then(sqlResponse => {
               //                log.info(`Total added products ${sqlResponse.affectedRows}`);
               //           })
               //           .catch(error => {
               //                log.error(`Error while adding  products ${error}`);
               //           })
               // }
               return { newProducts: totalAddList, updatedProducts: totalupdateList }
          }
          catch (error) {
               log.info(`Exception on updating/adding products ${error}`);
          }
     }
     async getMatchingProductForId(user, savedProductsList = []) {
          if (savedProductsList.length == 0) {
               savedProductsList = await mysql.query(getProduct, null);
          }
          var skuId = {}, index = 1, total = 1;
          log.info(`getMatchingProductForId executed and total :${savedProductsList.length}`);
          try {
               for (let product of savedProductsList) {
                    skuId[`IdList.Id.${index}`] = product.sellerSKU;
                    if (index == constant.MATCHING_PRODUCT_LIST_LIMIT || total == savedProductsList.length) {
                         await this.waitTime();
                         var productDetails = await mwsService.getMatchingProductForId(user, skuId);
                         Array.isArray(productDetails) ? "" : productDetails = [productDetails]
                         productDetails.forEach((newProductDetail) => {
                              if (newProductDetail['Products'] && newProductDetail['Products'].Product && newProductDetail['Products'].Product.AttributeSets) {
                                   var detail = newProductDetail['Products'].Product.AttributeSets.ItemAttributes,
                                        packageWeight = '', PackageDimensions = '', dimensions = '', imageUrl = '', imageHeight = '', imageWidth = '', oversize = null;
                                   if (detail['PackageDimensions'] && detail['PackageDimensions'].Weight) {
                                        PackageDimensions = detail['PackageDimensions'];
                                   }
                                   if (detail['ItemDimensions']) {
                                        dimensions = detail['ItemDimensions'];
                                   }
                                   if (detail['SmallImage'] && detail['SmallImage'].URL) {
                                        imageUrl = detail['SmallImage'].URL;
                                        imageHeight = detail['SmallImage'].Height.Value;
                                        imageWidth = detail['SmallImage'].Width.Value;
                                   }
                                   if (PackageDimensions['Height'] && PackageDimensions['Height'].Value >= constant.OVERSIZE_WEIGHT || PackageDimensions['Length'] && PackageDimensions['Length'].Value >= constant.OVERSIZE_LENGTH || PackageDimensions['Weight'] && PackageDimensions['Weight'].Value >= constant.OVERSIZE_WIDTH) {
                                        oversize = 'YES';
                                        log.info(`oversize SKU :${newProductDetail.Id}`);
                                   }
                                   //log.info(`product found SKU :${newProductDetail.Id}`);
                                   mysql.query(updateProductDetailsbyId, [oversize, imageUrl, imageHeight, imageWidth, JSON.stringify(PackageDimensions), JSON.stringify(dimensions), newProductDetail.Id]);
                              } else {
                                   //log.info(`product not found SKU :${newProductDetail.Id}`);
                              }
                         })
                         index = 0;
                         skuId = {};
                    }
                    index++;
                    total++;
               }
          }
          catch (error) {
               log.error("Exception in getMatchingProductForId");
               log.error(error);
          }
          // var updatedData = await this.synchProductWithDB(latestData.data, savedProductsList, user);
          return new Promise((resolve, reject) => {
               resolve(true);
          });

     }
     async fetchFNSKU(user) {
          var latestReportId = await mwsService.getReportslist(user, constant.GET_FBA_MYI_ALL_INVENTORY_DATA, 1);
          log.info(`fetchFNSKU Report ID ${latestReportId}`);
          var config = await mwsService.getConfig(user);
          var latestData = await mwsService.getreport(user, latestReportId);
          log.info(`fetchFNSKU updating total  ${latestData.data.length}`);
          latestData.data.forEach(product => {
               mysql.query(updateFNSKU, [product['fnsku'], config.SellerId, product['sku']]);
          })
          log.info(`fetchFNSKU updated  ${latestData.data.length}`);
     }


     async getMatchingProductForIdSingle(user, sku) {
          this.fetchFNSKU(user);
          var skuId = {};
          log.info(`getMatchingProductForIdSingle executed for sku :${sku}`);
          try {
               skuId[`IdList.Id1`] = sku;
               var newProductDetail = await mwsService.getMatchingProductForId(user, skuId);

               if (newProductDetail['Products'] && newProductDetail['Products'].Product && newProductDetail['Products'].Product.AttributeSets) {
                    var detail = newProductDetail['Products'].Product.AttributeSets.ItemAttributes,
                         packageWeight = '', PackageDimensions = '', dimensions = '', imageUrl = '', imageHeight = '', imageWidth = '', oversize = null;
                    if (detail['PackageDimensions'] && detail['PackageDimensions'].Weight) {
                         PackageDimensions = detail['PackageDimensions'];
                    }
                    if (detail['ItemDimensions']) {
                         dimensions = detail['ItemDimensions'];
                    }
                    if (detail['SmallImage'] && detail['SmallImage'].URL) {
                         imageUrl = detail['SmallImage'].URL;
                         imageHeight = detail['SmallImage'].Height.Value;
                         imageWidth = detail['SmallImage'].Width.Value;
                    }
                    if (PackageDimensions['Height'] && PackageDimensions['Height'].Value >= constant.OVERSIZE_WEIGHT || PackageDimensions['Length'] && PackageDimensions['Length'].Value >= constant.OVERSIZE_LENGTH || PackageDimensions['Weight'] && PackageDimensions['Weight'].Value >= constant.OVERSIZE_WIDTH) {
                         oversize = 'YES';
                         log.info(`oversize SKU :${newProductDetail.Id}`);
                    }
                    mysql.query(updateProductDetailsbyId, [oversize, imageUrl, imageHeight, imageWidth, JSON.stringify(PackageDimensions), JSON.stringify(dimensions), newProductDetail.Id]);
               }

          }
          catch (error) {
               log.error("Exception in getMatchingProductForId");
               log.error(error);
          }
          // var updatedData = await this.synchProductWithDB(latestData.data, savedProductsList, user);
          return new Promise((resolve, reject) => {
               resolve(true);
          });

     }

     async filterNewSkuData(serverProducts, DBProducts = [], user) {
          var newSkuList = [], dbSkuList = [];
          serverProducts.forEach((product) => {
               var found = DBProducts.filter(item => {
                    return product['seller-sku'] == item['sellerSKU']
               });
               if (found.length == 0) {
                    newSkuList.push(product);
                    dbSkuList.push({ sellerSKU: product['seller-sku'] });
               }
          })
          return ({ newSkuList: newSkuList, dbSkuList: dbSkuList });
     }

     waitTime() {
          return new Promise((resolve, reject) => {
               setTimeout(function () {
                    resolve(true)
               }, 1000)
          })
     }

     async fetchRestock(user) {
        
          log.info(`fetchRestock start by ${user}`);
          var config = await mwsService.getConfig(user);
          var lastSync = { username: user, type: "Restock Sync", start_time: new Date(), end_time: "", status: "Failed" };
          var reportsUS= await sellingPartnerAPIService.getreportId("GET_RESTOCK_INVENTORY_RECOMMENDATIONS_REPORT",constant.MARKETPLACE_ID_US);
          var reportsCA= await sellingPartnerAPIService.getreportId("GET_RESTOCK_INVENTORY_RECOMMENDATIONS_REPORT",constant.MARKETPLACE_ID_CA);   


          var latestDataUS = await sellingPartnerAPIService.getreport(reportsUS[0].reportDocumentId);
          var latestDataCA = await sellingPartnerAPIService.getreport(reportsCA[0].reportDocumentId);

          const savedRestockData = await mysql.query(getRestockData, null);
          var allkey = {}
          try {
               latestDataUS.forEach(async (element) => {
                    // Object.keys(element).forEach((key) => {
                    //      allkey[key] = element[key];
                    // })
                    var find = savedRestockData.find((el) => {
                         return (el["market_place"] == "US" && element["Merchant SKU"] == el["amz_sku"])
                    });
                    if (find) {
                         var restockUSUpdate = [{
                              
                              amz_total_days_of_amz_supply: element["Days of Supply at Amazon Fulfillment Network"],
                              amz_recommended_order_qty: element["Recommended replenishment qty"],
                              amz_recommended_order_date: !isNaN(Date.parse(element["Recommended ship date"])) ? new Date(element["Recommended ship date"]) : null,
                              amz_current_price: element["Price"],
                              amazon_category: element["Condition"]
                         }, element["Merchant SKU"],
                              "US"]

                         await this.updateRestock(restockUSUpdate, find, user);
                    } else {
                         var restockUSNew = {
                              market_place: "US",
                              amz_sku: element["Merchant SKU"],                              
                              amz_total_days_of_amz_supply: element["Days of Supply at Amazon Fulfillment Network"],
                              amz_recommended_order_qty: element["Recommended replenishment qty"],
                              amz_recommended_order_date: !isNaN(Date.parse(element["Recommended ship date"])) ? new Date(element["Recommended ship date"]) : null,
                              amz_current_price: element["Price"],
                              amazon_category: element["Condition"]
                         }
                         await this.addRestock(restockUSNew, user);
                    }

               })

               latestDataCA.forEach(async (element) => {
                    var find = savedRestockData.find((el) => {
                         return (el["market_place"] == "CA" && element["Merchant SKU"] == el["amz_sku"])
                    });
                    if (find) {
                         var restockCAUpdate = [{
                              
                              amz_total_days_of_amz_supply: element["Days of Supply at Amazon Fulfillment Network"],
                              amz_recommended_order_qty: element["Recommended replenishment qty"],
                              amz_recommended_order_date: !isNaN(Date.parse(element["Recommended ship date"])) ? new Date(element["Recommended ship date"]) : null,
                              amz_current_price: element["Price"],
                              amazon_category: element["Condition"]
                         },
                         element["Merchant SKU"],
                              "CA"
                         ]
                         await this.updateRestock(restockCAUpdate, find, user);
                    } else {
                         var restockCANew = [{
                              market_place: "CA",
                              amz_sku: element["Merchant SKU"],                             
                              amz_total_days_of_amz_supply: element["Days of Supply at Amazon Fulfillment Network"],
                              amz_recommended_order_qty: element["Recommended replenishment qty"],
                              amz_recommended_order_date: !isNaN(Date.parse(element["Recommended ship date"])) ? new Date(element["Recommended ship date"]) : null,
                              amz_current_price: element["Price"],
                              amazon_category: element["Condition"]
                         }]
                         //log.error(restockUSNew);
                         await this.addRestock(restockCANew, user);
                    }
               })
               spApiSyncService.updateSalesMatrix();

               lastSync["end_time"] = new Date();
               lastSync["status"] = "Success";
               await mysql.query(addLastSynch, lastSync);
          }
          catch (error) {
               lastSync["end_time"] = new Date();
               await mysql.query(addLastSynch, lastSync);
               log.error(error);
          }
          return new Promise((resolve, reject) => {
               resolve("Done")
          });
     }

     async addRestock(data, user) {
          try {
               await mysql.query(addRestock, data);
               historyService.addHistory("Restock", user, null, JSON.stringify(data));
          }
          catch (error) {
               log.error(error);
          }
     }

     async updateRestock(data, olddata, user) {
          try {
               await mysql.query(updateRestock, data);
               var jsonData = data[0];
               jsonData['amz_sku'] = data[1];
               jsonData['market_place'] = data[2];
               historyService.addHistory("Restock", user, JSON.stringify(olddata), JSON.stringify(jsonData));
          }
          catch (error) {
               log.error(error);
          }
     } 
     
     async fetchShipments() {
          try {
               var response = await inventoryPlannerService.fetchData();
               for (var i = 0; i < response.length; i++) {
                 var shipmentItems = await inventoryPlannerService.fetchShipmentDetails(response[i]);
                 if (shipmentItems.length > 0) {
                   await inventoryPlannerService.savePurchaseOrder(response[i],shipmentItems);
                 }
               };
           
               return "done";
             }
             catch (err) {
               return "Failed";
             };
     }

}
module.exports = new mwsSyncService;