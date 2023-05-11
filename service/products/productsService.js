const mysql = require("../mysql"),
     { getProduct, getSKU, updateProductUI, getProductBySku, getProductwhere, addProductImporter, getMasterSku } = require("../../util/sqlquery")
const sellerSettings = require('../settings/sellerSettings');
class productsService {
     getAllProducts(user, amazonLiveStatus = 1) {
          return new Promise((resolve, reject) => {
               var where = null;
               if (amazonLiveStatus != 2) {
                    where = amazonLiveStatus
               }
               mysql.query(where ? getProductwhere : getProduct, where)
                    .then(products => resolve(products))
                    .catch(err => reject(err));
          })
     }
     getskuList(user) {
          return new Promise((resolve, reject) => {
               mysql.query(getSKU, null)
                    .then(skulist => resolve(skulist))
                    .catch(err => reject(err));
          })
     }
     updateProduct(user, params, sku) {
          return new Promise((resolve, reject) => {
               mysql.query(updateProductUI, [params, sku])
                    .then(skulist => resolve(skulist))
                    .catch(err => reject(err));
          })
     }
     async addProduct(user, params, sku) {
          var config = await sellerSettings.getSellerId(user);
          params['sellerId'] = config.SellerId;
          params['sellerSKU'] = sku;
          return new Promise((resolve, reject) => {
               mysql.query(addProductImporter, params)
                    .then(skulist => resolve(skulist))
                    .catch(err => reject(err));
          })
     }
     getProduct(sku) {
          return new Promise((resolve, reject) => {
               mysql.query(getProductBySku, sku)
                    .then(products => resolve(products))
                    .catch(err => reject(err));
          })
     }
     getFullProducts(sku) {
          return new Promise((resolve, reject) => {
               mysql.query(getProduct, [])
                    .then(products => resolve(products))
                    .catch(err => reject(err));
          })
     }
     getMastersku() {
          return new Promise((resolve, reject) => {
               mysql.query(getMasterSku, null)
                    .then(products => resolve(products))
                    .catch(err => reject(err));
          })
     }
}
module.exports = new productsService;