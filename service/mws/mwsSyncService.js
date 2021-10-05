const mwsService = require('../mws/mwsService'),
     constant = require("../../util/constant"),
     mysql = require("../mysql"),
     { getProduct, addProduct, updateProduct, updateProductDetailsbyId, updateFNSKU, addLastSynch } = require("../../util/sqlquery"),
     log = require('../log');

class mwsSyncService {
     async updateInvetory(user) {
          log.info(`Sync start by ${user}`);
          var config = await mwsService.getConfig(user);
          var latestReportId = await mwsService.getReportslist(user, constant.GET_MERCHANT_LISTINGS_ALL_DATA_);
          log.info(`Report ID ${latestReportId}`);
          var latestData = await mwsService.getreport(user, latestReportId);
          log.info(`Total products  ${latestData.data.length} for reportid ${latestReportId}`);
          var savedProductsList = await mysql.query(getProduct, user);
          var updatedData = await this.synchProductWithDB(latestData.data, savedProductsList, user);
          await this.getMatchingProductForId(user);
          await mysql.query(addLastSynch, { username: user, sellerId: config.SellerId });
          await this.fetchFNSKU(user);
          return new Promise((resolve, reject) => {
               console.log(updatedData);
               resolve(updatedData)
          });

     }
     async synchProductWithDB(serverProducts, DBProducts = [], user) {
          let newList = [], totalupdateList = [];
          var config = await mwsService.getConfig(user);
          try {
               serverProducts.forEach((product) => {
                    var found = DBProducts.filter(item => {
                         return product['seller-sku'] == item['sellerSKU']
                    });
                    if (found && found.length > 0) {
                         var updateList = [];
                         //imageUrl,itemName,status,itemNote,productId,productIdType,sellerId,sellerSKU 
                         updateList.push(
                              product['item-name'],
                              product['status'],
                              product['item-note'],
                              product['product-id'],
                              product['product-id-type'],
                              config.SellerId,
                              product['seller-sku']
                         );
                         totalupdateList.push(updateList);
                         mysql.query(updateProduct, updateList)
                              .then(sqlResponse => {
                                   //log.info(`Total updated products ${sqlResponse.affectedRows}`);
                              })
                              .catch(error => {
                                   log.error(`Error while Updating  products ${error}`);
                              })
                    }
                    else {
                         //sellerId,user,imageUrl,itemName,sellerSKU,status,itemNote,dateAdded,amazonASIN,productId,productIdType
                         newList.push([
                              config.SellerId,
                              user,
                              product['item-name'],
                              product['seller-sku'],
                              product['status'],
                              product['item-note'],
                              product['open-date'],
                              product['asin1'],
                              product['product-id'],
                              product['product-id-type']

                         ])
                    }
               });
               log.info(`Adding new products ${newList.length}`);
               log.info(`Updating products ${totalupdateList.length}`);
               if (newList.length > 0) {
                    mysql.query(addProduct, [newList])
                         .then(sqlResponse => {
                              log.info(`Total added products ${sqlResponse.affectedRows}`);
                         })
                         .catch(error => {
                              log.error(`Error while adding  products ${error}`);
                         })
               }
               return { newProducts: newList, updatedProducts: totalupdateList }
          }
          catch (error) {
               log.info(`Exception on updating/adding products ${error}`);
          }
     }
     async getMatchingProductForId(user) {
          var savedProductsList = await mysql.query(getProduct, user);
          var skuId = {}, index = 1, total = 1;
          log.info(`getMatchingProductForId executed and total :${savedProductsList.length}`);
          try {
               for await (let product of savedProductsList) {
                    skuId[`IdList.Id.${index}`] = product.sellerSKU;
                    if (index == constant.MATCHING_PRODUCT_LIST_LIMIT || total == savedProductsList.length) {
                         var productDetails = await mwsService.getMatchingProductForId(user, skuId);

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
                                   if (PackageDimensions['Height'].Value >= constant.OVERSIZE_WEIGHT || PackageDimensions['Length'].Value >= constant.OVERSIZE_LENGTH || PackageDimensions['Weight'] && PackageDimensions['Weight'].Value >= constant.OVERSIZE_WIDTH) {
                                        oversize = 'YES';
                                        log.info(`oversize SKU :${newProductDetail.Id}`);
                                   }
                                   mysql.query(updateProductDetailsbyId, [oversize, imageUrl, imageHeight, imageWidth, JSON.stringify(PackageDimensions), JSON.stringify(dimensions), newProductDetail.Id]);
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
               log.error(error);
          }
          // var updatedData = await this.synchProductWithDB(latestData.data, savedProductsList, user);
          return new Promise((resolve, reject) => {
               resolve(true);
          });

     }
     async fetchFNSKU(user) {
          var latestReportId = await mwsService.getReportslist(user, constant.GET_FBA_MYI_ALL_INVENTORY_DATA);
          log.info(`fetchFNSKU Report ID ${latestReportId}`);
          var config = await mwsService.getConfig(user);
          var latestData = await mwsService.getreport(user, latestReportId);
          log.info(`fetchFNSKU updating total  ${latestData.data.length}`);
          latestData.data.forEach(product => {
               mysql.query(updateFNSKU, [product['fnsku'], config.SellerId, product['sku']]);
          })
          log.info(`fetchFNSKU updated  ${latestData.data.length}`);
     }
}
module.exports = new mwsSyncService;