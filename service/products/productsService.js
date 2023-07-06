const CommonUtil = require("../../util/common");
const mysql = require("../mysql"),
     { getProduct, getSKU, updateProductUI, getProductBySku, getProductwhere, addProductImporter, getMasterSku, getProductCount, getProductByPurchaseOrder } = require("../../util/sqlquery")
const sellerSettings = require('../settings/sellerSettings');
class productsService {
     getAllProducts(queryParams) {
        return new Promise((resolve, reject) => {
          const { searchParam, amazonLiveStatus = 1, status = "" } = queryParams;

          let productQuery = getProduct;

          let whereParams = []
      
          if (amazonLiveStatus != 2) {
            productQuery = productQuery + ` where amzlive = ?`
            whereParams.push(amazonLiveStatus);
          }

          if (searchParam) {
            const searchQuery = (productQuery.includes('where') ? " AND " : " where ")  + "itemNameLocal LIKE ? OR sellerSKU LIKE ? OR amazonASIN LIKE ?"
            productQuery = productQuery + `${searchQuery}`
            whereParams.push(`%${searchParam}%`);
            whereParams.push(`%${searchParam}%`);
            whereParams.push(`%${searchParam}%`);
          }

          if (status) {
            const searchQuery = productQuery.includes('where') ? " AND status=?" : " where status=?"
            productQuery = productQuery + `${searchQuery}`
            whereParams.push(`%${status}%`);
          }

         productQuery = CommonUtil.createPaginationAndSortingQuery(productQuery, queryParams, whereParams)

          mysql.query(productQuery, whereParams)
            .then(products => resolve(products))
            .catch(err => reject(err));
        })
     }
     getTotalRecordsForProductList(queryParams) {
      const { searchParam, amazonLiveStatus = 1, status } = queryParams || {}

      return new Promise((resolve, reject) => {
          let productQuery = getProductCount;

          let whereParams = []
      
          if (amazonLiveStatus != 2) {
            productQuery = productQuery + ` where amzlive = ?`
            whereParams.push(amazonLiveStatus);
          }

          if (searchParam) {
          const searchQuery =
            (productQuery.includes("where") ? " AND " : " where ") +
            "itemNameLocal LIKE ? OR sellerSKU LIKE ? OR amazonASIN LIKE ?";
            productQuery = productQuery + `${searchQuery}`
            whereParams.push(`%${searchParam}%`);
            whereParams.push(`%${searchParam}%`);
            whereParams.push(`%${searchParam}%`);
          }

          if (status) {
            const searchQuery = productQuery.includes('where') ? " AND status=?" : " where status=?"
            productQuery = productQuery + `${searchQuery}`
            whereParams.push(`%${status}%`);
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
     getMastersku() {
          return new Promise((resolve, reject) => {
               mysql.query(getMasterSku, null)
                    .then(products => resolve(products))
                    .catch(err => reject(err));
          })
     }
}
module.exports = new productsService;