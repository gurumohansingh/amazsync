const { remove } = require("winston");
const mysql = require("../mysql"),
     { getSuppliers, addSuppliers, deleteSuppliers, updateSuppliers, productSuppliers, updateProductSuppliers, addProductSuppliers, deleteProductSuppliers,getProductSuppliersAll } = require("../../util/sqlquery")

class suppliersService {
     getAllSuppliers(user) {
          return new Promise((resolve, reject) => {
               mysql.query(getSuppliers, null)
                    .then(suppliers => resolve(suppliers))
                    .catch(err => reject(err));
          })
     }
     addSupplier(user, supplier) {
          return new Promise((resolve, reject) => {
               supplier["user"] = user;
               supplier['DefaultLeadTimeInDays'] != "" ? new Date(supplier['DefaultLeadTimeInDays']) : supplier['DefaultLeadTimeInDays'];
               mysql.query(addSuppliers, supplier)
                    .then(supplier => resolve(supplier))
                    .catch(err => reject(err));
          })
     }
     deleteSupplier(user, supplierId) {
          return new Promise((resolve, reject) => {
               mysql.query(deleteSuppliers, [supplierId['supplierId']])
                    .then(supplier => resolve(supplier))
                    .catch(err => reject(err));
          })
     }
     updateSupplier(user, supplier) {
          return new Promise((resolve, reject) => {
               var id = supplier['id'];
               delete supplier['id'];
               supplier['DefaultLeadTimeInDays'] != "" ? new Date(supplier['DefaultLeadTimeInDays']) : supplier['DefaultLeadTimeInDays'];
               mysql.query(updateSuppliers, [supplier, id])
                    .then(products => resolve(products))
                    .catch(err => reject(err));
          })
     }

     getProductsuppliers(user, sku) {
          return new Promise((resolve, reject) => {
               mysql.query(productSuppliers, [sku])
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
               mysql.query(updateProductSuppliers, [params, sku, supplierID])
                    .then(suppliers => resolve(suppliers))
                    .catch(err => reject(err));
          })
     }

     deleteProductsupplier(user, params) {
          return new Promise((resolve, reject) => {
               mysql.query(deleteProductSuppliers, [params.productSKU, params.supplierID])
                    .then(suppliers => resolve(suppliers))
                    .catch(err => reject(err));
          })
     }

     getAllProdcutSupplier() {
          return new Promise((resolve, reject) => {
               mysql.query(getProductSuppliersAll, null)
                    .then(suppliers => resolve(suppliers))
                    .catch(err => reject(err));
          })
     }

}
module.exports = new suppliersService;