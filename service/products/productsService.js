const mysql = require("../mysql"),
     { getProduct, getSKU, updateProductUI } = require("../../util/sqlquery")

class productsService {
     getAllProducts(user) {
          return new Promise((resolve, reject) => {
               mysql.query(getProduct, user)
                    .then(products => resolve(products))
                    .catch(err => reject(err));
          })
     }
     getskuList(user) {
          return new Promise((resolve, reject) => {
               mysql.query(getSKU, user)
                    .then(skulist => resolve(skulist))
                    .catch(err => reject(err));
          })
     }
     updateProduct(user, params, sku) {
          return new Promise((resolve, reject) => {
               mysql.query(updateProductUI, [params, user, sku])
                    .then(skulist => resolve(skulist))
                    .catch(err => reject(err));
          })
     }
}
module.exports = new productsService;