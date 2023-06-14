const mysql = require("../mysql"),
     { getProduct, getSKU, updateProductUI, getProductBySku, getProductwhere, addProductImporter, getMasterSku, getProductCount } = require("../../util/sqlquery")
const sellerSettings = require('../settings/sellerSettings');
class productsService {
     getAllProducts(searchParam, amazonLiveStatus = 1, limit = 25, offset = 0) {
        return new Promise((resolve, reject) => {
          let productQuery = getProduct;

          let whereParams = []
      
          if (amazonLiveStatus != 2) {
            productQuery = productQuery + ` where amzlive = ?`
            whereParams.push(amazonLiveStatus);
          }

          if (searchParam) {
            const searchQuery = productQuery.includes('where') ? " AND itemName LIKE ?" : " where itemName LIKE ?"
            productQuery = productQuery + `${searchQuery}`
            whereParams.push(`%${searchParam}%`);
          }

          if (limit) {
            productQuery = productQuery + ` LIMIT ${limit}`
            whereParams.push(limit);
          }

          if (offset) {
            productQuery = productQuery + ` OFFSET ${offset}`
            whereParams.push(offset);
          }
          
          mysql.query(productQuery, whereParams)
            .then(products => resolve(products))
            .catch(err => reject(err));
        })
     }
     getTotalRecordsForProductList(searchParam, amazonLiveStatus = 1) {
      return new Promise((resolve, reject) => {
          let productQuery = getProductCount;

          let whereParams = []
      
          if (amazonLiveStatus != 2) {
            productQuery = productQuery + ` where amzlive = ?`
            whereParams.push(amazonLiveStatus);
          }

          if (searchParam) {
            const searchQuery = productQuery.includes('where') ? " AND itemNameLocal LIKE ?" : " where itemNameLocal LIKE ?"
            productQuery = productQuery + `${searchQuery}`
            whereParams.push(`%${searchParam}%`);
          }

          mysql.query(productQuery, whereParams)
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