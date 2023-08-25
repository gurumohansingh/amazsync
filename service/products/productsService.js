const CommonUtil = require("../../util/common");
const mysql = require("../mysql");
const { getProduct, getSKU, updateProductUI, getProductBySku, addProductImporter, getMasterSku, getProductCount, getProductByPurchaseOrder } = require("../../util/sqlquery");
const sellerSettings = require('../settings/sellerSettings');
class productsService {
     getAllProducts(queryParams) {
          return new Promise((resolve, reject) => {
               const { searchParam, amazonLiveStatus = 1, status = "", sort, filter } = queryParams;

               const parsedSort = JSON.parse(sort || "[]")
               const parsedFilter = JSON.parse(filter || "[]")

               let productQuery = getProduct;

               const whereParams = []

               if (amazonLiveStatus != 2) {
                    productQuery += ` where amzlive = ?`
                    whereParams.push(amazonLiveStatus);
               }

               if (searchParam) {
                    const searchQuery = `${productQuery.includes('where') ? " AND " : " where "}(itemNameLocal LIKE ? OR sellerSKU LIKE ? OR amazonASIN LIKE ?)`
                    productQuery += searchQuery
                    whereParams.push(`%${searchParam}%`);
                    whereParams.push(`%${searchParam}%`);
                    whereParams.push(`%${searchParam}%`);
               }

               if (status && status != 'All') {
                    const searchQuery = productQuery.includes('where') ? " AND status=?" : " where status=?"
                    productQuery += `${searchQuery}`
                    whereParams.push(status);
               }

               parsedFilter.forEach((item, idx) => {
                    const { operator, value, property } = item
                    if (!value || value?.length === 0) {
                         return;
                    }

                    const query = ` ${idx > 0 || productQuery.includes('where') ? 'AND' : 'where'} ${property} ${operator} (?) `
                    if (operator === "like") {
                         whereParams.push(`%${value}%`)
                    } else {
                         whereParams.push(value)
                    }
                    productQuery += query

               })

               if (parsedSort.length) {
                    const sortQuery = ` ORDER BY ${parsedSort[0].property} ${parsedSort[0].direction}`
                    productQuery += sortQuery;
               }

               productQuery = CommonUtil.createPaginationAndSortingQuery(productQuery, queryParams, whereParams)

               mysql.query(productQuery, whereParams)
                    .then(products => resolve(products))
                    .catch(err => reject(err));
          })
     }
     getTotalRecordsForProductList(queryParams) {
          const { searchParam, amazonLiveStatus = 1, status, sort, filter } = queryParams || {}


          const parsedSort = JSON.parse(sort || "[]")
          const parsedFilter = JSON.parse(filter || "[]")

          return new Promise((resolve, reject) => {
               let productQuery = getProductCount;

               let whereParams = []

               if (amazonLiveStatus != 2) {
                    productQuery = productQuery + ` where amzlive = ? `
                    whereParams.push(amazonLiveStatus);
               }

               if (searchParam) {
                    const searchQuery =
                         (productQuery.includes("where") ? " AND " : " where ") +
                         "(itemNameLocal LIKE ? OR sellerSKU LIKE ? OR amazonASIN LIKE ?)";
                    productQuery = productQuery + `${searchQuery}`
                    whereParams.push(`% ${searchParam} % `);
                    whereParams.push(`% ${searchParam} % `);
                    whereParams.push(`% ${searchParam} % `);
               }

               if (status && status != 'All') {
                    const searchQuery = productQuery.includes('where') ? " AND status=?" : " where status=?"
                    productQuery = productQuery + `${searchQuery}`
                    whereParams.push(status);
               }



               parsedFilter.forEach((item, idx) => {
                    const { operator, value, property } = item
                    if (!value || value?.length === 0) {
                         return;
                    }

                    const query = ` ${idx > 0 || productQuery.includes('where') ? 'AND' : 'where'} ${property} ${operator} (?) `
                    if (operator === "like") {
                         whereParams.push(`%${value}%`)
                    } else {
                         whereParams.push(value)
                    }
                    productQuery += query

               })

               if (parsedSort.length) {
                    const sortQuery = ` ORDER BY ${parsedSort[0].property} ${parsedSort[0].direction}`
                    productQuery += sortQuery;
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
     getFullProductsByPurchaseOrder(params) {
          return new Promise((resolve, reject) => {
               mysql.query(getProductByPurchaseOrder, [params])
                    .then(products => resolve(products))
                    .catch(err => reject(err));
          })
     }
     async getMastersku(query) {
       //concatenating  base sql query
       const value= `%${query}%`
       const sqlquery = `${getMasterSku} AND sellerSKU LIKE ?`;
       try {
         const skus = await mysql.query(sqlquery, [value]);
         return skus;
       } catch (error) {
         throw error;
       }
     }
}
module.exports = new productsService;