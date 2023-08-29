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
     async updateProduct(req, res, next) {
          const params = {
               suppliers: req.body['suppliers'],
               reshippingCost: req.body['reshippingCost'],
               prepMaterialCost: req.body['prepMaterialCost'],
               prepLaborCost: req.body['prepLaborCost'],
               tag: Array.isArray(req.body['tag']) ? req.body['tag'].join(',') : req.body['tag'],
               targetDaysInAmazon: req.body['targetDaysInAmazon'],
               targetDaysInWarehouse: req.body['targetDaysInWarehouse'],
               isPartSKUOnly: req.body['isPartSKUOnly'],
               EANLocal: req.body['EANLocal'],
               packageWeightLocal: req.body['packageWeightLocal'],
               itemNoteLocal: req.body['itemNoteLocal'],
               dimensionsLocal: req.body['dimensionsLocal'],
               UPCLocal: req.body['UPCLocal'],
               isActiveLocal: req.body['isActiveLocal'],
               additionalPrepInstructions: req.body['additionalPrepInstructions'],
               itemNameLocal: req.body['itemNameLocal'],
               countryofOriginLocal: req.body['countryofOriginLocal'],
               htcCodeLocal: req.body['htcCodeLocal'],
               casePackQuantity: req.body['casePackQuantity'],
               casePackUPC: req.body['casePackUPC'],
               ismasterSku: req.body['ismasterSku'],
               masterSku: req.body['masterSku'],
               dimensionalWeight: req.body['dimensionalWeight'],
             }
          try {
            const result = await mysql.query(updateProductUI, [
              params,
              req.body["sellerSKU"],
            ]);
            return res.status(200).send(result);
          } catch (error) {
            return res.status(500).send(error);
          }
     }
     async addProduct(req, res, next) {
          const params = {
            suppliers: req.body['suppliers'],
            reshippingCost: req.body['reshippingCost'],
            prepMaterialCost: req.body['prepMaterialCost'],
            prepLaborCost: req.body['prepLaborCost'],
            tag: Array.isArray(req.body['tag']) ? req.body['tag'].join(',') : req.body['tag'],
            targetDaysInAmazon: req.body['targetDaysInAmazon'],
            targetDaysInWarehouse: req.body['targetDaysInWarehouse'],
            isPartSKUOnly: req.body['isPartSKUOnly'],
            EANLocal: req.body['EANLocal'],
            packageWeightLocal: req.body['packageWeightLocal'],
            itemNoteLocal: req.body['itemNoteLocal'],
            dimensionsLocal: req.body['dimensionsLocal'],
            UPCLocal: req.body['UPCLocal'],
            isActiveLocal: req.body['isActiveLocal'],
            additionalPrepInstructions: req.body['additionalPrepInstructions'],
            itemNameLocal: req.body['itemNameLocal'],
            countryofOriginLocal: req.body['countryofOriginLocal'],
            htcCodeLocal: req.body['htcCodeLocal'],
            casePackQuantity: req.body['casePackQuantity'],
            casePackUPC: req.body['casePackUPC'],
            ismasterSku: req.body['ismasterSku'],
            masterSku: req.body['masterSku'],
            dimensionalWeight: req.body['dimensionalWeight'],
          }
          const newSKU = `SellerSKU${Math.floor(Math.random() * 999999)}`
          const config = await sellerSettings.getSellerId(req.loggedUser.username);
          params['sellerId'] = config.SellerId;
          params['sellerSKU'] = newSKU;
          try {
               const result= await mysql.query(addProductImporter, params)
               return res.status(200).send(result);
          } catch (error) {
               return res.status(500).send(error);
          }
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