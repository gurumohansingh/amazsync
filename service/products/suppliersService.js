const { remove } = require("winston");
const mysql = require("../mysql"),
     { getSuppliers, addSuppliers, deleteSuppliers, updateSuppliers, productSuppliers, updateProductSuppliers, addProductSuppliers, deleteProductSuppliers } = require("../../util/sqlquery")

class suppliersService {
     getAllSuppliers(user) {
          return new Promise((resolve, reject) => {
               mysql.query(getSuppliers, user)
                    .then(suppliers => resolve(suppliers))
                    .catch(err => reject(err));
          })
     }
     addSupplier(user, supplier) {
          return new Promise((resolve, reject) => {
               supplier["user"] = user;
               supplier['leadTime'] != "" ? new Date(supplier['leadTime']) : supplier['leadTime'];
               mysql.query(addSuppliers, supplier)
                    .then(supplier => resolve(supplier))
                    .catch(err => reject(err));
          })
     }
     deleteSupplier(user, supplierId) {
          return new Promise((resolve, reject) => {
               mysql.query(deleteSuppliers, [supplierId['supplierId'], user])
                    .then(supplier => resolve(supplier))
                    .catch(err => reject(err));
          })
     }
     updateSupplier(user, supplier) {
          return new Promise((resolve, reject) => {
               var id = supplier['id'];
               delete supplier['id'];
               supplier['leadTime'] != "" ? new Date(supplier['leadTime']) : supplier['leadTime'];
               mysql.query(updateSuppliers, [supplier, id, user])
                    .then(products => resolve(products))
                    .catch(err => reject(err));
          })
     }

     getProductsuppliers(user, sku) {
          return new Promise((resolve, reject) => {
               mysql.query(productSuppliers, [user, sku])
                    .then(suppliers => resolve(suppliers))
                    .catch(err => reject(err));
          })
     }

     addProductsupplier(user, params) {
          return new Promise((resolve, reject) => {
               params['user'] = user;
               mysql.query(addProductSuppliers, params)
                    .then(suppliers => resolve(suppliers))
                    .catch(err => reject(err));
          })
     }


     updateProductsupplier(user, params) {
          return new Promise((resolve, reject) => {
               var sku = params['productSKU'];
               var supplierID = params['supplierID'];
               delete params['productSKU'];
               delete params['supplierID'];
               mysql.query(updateProductSuppliers, [params, user, sku, supplierID])
                    .then(suppliers => resolve(suppliers))
                    .catch(err => reject(err));
          })
     }

     deleteProductsupplier(user, params) {
          return new Promise((resolve, reject) => {
               mysql.query(deleteProductSuppliers, [user, params.productSKU, params.supplierID])
                    .then(suppliers => resolve(suppliers))
                    .catch(err => reject(err));
          })
     }


}
module.exports = new suppliersService;