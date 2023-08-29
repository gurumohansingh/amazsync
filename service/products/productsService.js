const CommonUtil = require("../../util/common");
const mysql = require("../mysql");
const {
  getProduct,
  getSKU,
  updateProductUI,
  getProductBySku,
  addProductImporter,
  getMasterSku,
  getProductCount,
  getProductByPurchaseOrder,
} = require("../../util/sqlquery");
const sellerSettings = require("../settings/sellerSettings");
class productsService {
  getAllProducts(queryParams) {
    return new Promise((resolve, reject) => {
      const {
        searchParam,
        amazonLiveStatus = 1,
        status = "",
        sort,
        filter,
      } = queryParams;

      const parsedSort = JSON.parse(sort || "[]");
      const parsedFilter = JSON.parse(filter || "[]");

      let productQuery = getProduct;

      const whereParams = [];

      if (amazonLiveStatus != 2) {
        productQuery += ` where amzlive = ?`;
        whereParams.push(amazonLiveStatus);
      }

      if (searchParam) {
        const searchQuery = `${
          productQuery.includes("where") ? " AND " : " where "
        }(itemNameLocal LIKE ? OR sellerSKU LIKE ? OR amazonASIN LIKE ?)`;
        productQuery += searchQuery;
        whereParams.push(`%${searchParam}%`);
        whereParams.push(`%${searchParam}%`);
        whereParams.push(`%${searchParam}%`);
      }

      if (status && status != "All") {
        const searchQuery = productQuery.includes("where")
          ? " AND status=?"
          : " where status=?";
        productQuery += `${searchQuery}`;
        whereParams.push(status);
      }

      parsedFilter.forEach((item, idx) => {
        const { operator, value, property } = item;
        if (!value || value?.length === 0) {
          return;
        }

        const query = ` ${
          idx > 0 || productQuery.includes("where") ? "AND" : "where"
        } ${property} ${operator} (?) `;
        if (operator === "like") {
          whereParams.push(`%${value}%`);
        } else {
          whereParams.push(value);
        }
        productQuery += query;
      });

      if (parsedSort.length) {
        const sortQuery = ` ORDER BY ${parsedSort[0].property} ${parsedSort[0].direction}`;
        productQuery += sortQuery;
      }

      productQuery = CommonUtil.createPaginationAndSortingQuery(
        productQuery,
        queryParams,
        whereParams
      );

      mysql
        .query(productQuery, whereParams)
        .then((products) => resolve(products))
        .catch((err) => reject(err));
    });
  }
  getTotalRecordsForProductList(queryParams) {
    const {
      searchParam,
      amazonLiveStatus = 1,
      status,
      sort,
      filter,
    } = queryParams || {};

    const parsedSort = JSON.parse(sort || "[]");
    const parsedFilter = JSON.parse(filter || "[]");

    return new Promise((resolve, reject) => {
      let productQuery = getProductCount;

      let whereParams = [];

      if (amazonLiveStatus != 2) {
        productQuery = productQuery + ` where amzlive = ? `;
        whereParams.push(amazonLiveStatus);
      }

      if (searchParam) {
        const searchQuery =
          (productQuery.includes("where") ? " AND " : " where ") +
          "(itemNameLocal LIKE ? OR sellerSKU LIKE ? OR amazonASIN LIKE ?)";
        productQuery = productQuery + `${searchQuery}`;
        whereParams.push(`% ${searchParam} % `);
        whereParams.push(`% ${searchParam} % `);
        whereParams.push(`% ${searchParam} % `);
      }

      if (status && status != "All") {
        const searchQuery = productQuery.includes("where")
          ? " AND status=?"
          : " where status=?";
        productQuery = productQuery + `${searchQuery}`;
        whereParams.push(status);
      }

      parsedFilter.forEach((item, idx) => {
        const { operator, value, property } = item;
        if (!value || value?.length === 0) {
          return;
        }

        const query = ` ${
          idx > 0 || productQuery.includes("where") ? "AND" : "where"
        } ${property} ${operator} (?) `;
        if (operator === "like") {
          whereParams.push(`%${value}%`);
        } else {
          whereParams.push(value);
        }
        productQuery += query;
      });

      if (parsedSort.length) {
        const sortQuery = ` ORDER BY ${parsedSort[0].property} ${parsedSort[0].direction}`;
        productQuery += sortQuery;
      }

      mysql
        .query(productQuery, whereParams)
        .then((products) => resolve(products))
        .catch((err) => reject(err));
    });
  }
  getskuList(user) {
    return new Promise((resolve, reject) => {
      mysql
        .query(getSKU, null)
        .then((skulist) => resolve(skulist))
        .catch((err) => reject(err));
    });
  }
  async updateProduct(req, res, next) {
    const params = {
      suppliers: req.body["suppliers"],
      reshippingCost: (+req.body["reshippingCost"]).toFixed(2),
      prepMaterialCost: (+req.body["prepMaterialCost"]).toFixed(2),
      prepLaborCost: (+req.body["prepLaborCost"]).toFixed(2),
      tag: Array.isArray(req.body["tag"])
        ? req.body["tag"].join(",")
        : req.body["tag"],
      targetDaysInAmazon: req.body["targetDaysInAmazon"],
      targetDaysInWarehouse: req.body["targetDaysInWarehouse"],
      isPartSKUOnly: req.body["isPartSKUOnly"],
      EANLocal: req.body["EANLocal"],
      packageWeightLocal: req.body["packageWeightLocal"],
      itemNoteLocal: req.body["itemNoteLocal"],
      dimensionsLocal: req.body["dimensionsLocal"],
      UPCLocal: req.body["UPCLocal"],
      isActiveLocal: req.body["isActiveLocal"],
      additionalPrepInstructions: req.body["additionalPrepInstructions"],
      itemNameLocal: req.body["itemNameLocal"],
      countryofOriginLocal: req.body["countryofOriginLocal"],
      htcCodeLocal: req.body["htcCodeLocal"],
      casePackQuantity: req.body["casePackQuantity"],
      casePackUPC: req.body["casePackUPC"],
      ismasterSku: req.body["ismasterSku"],
      masterSku: req.body["masterSku"],
      dimensionalWeight: req.body["dimensionalWeight"],
    };
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
      suppliers: req.body["suppliers"],
      reshippingCost: (+req.body["reshippingCost"]).toFixed(2),
      prepMaterialCost: (+req.body["prepMaterialCost"]).toFixed(2),
      prepLaborCost: (+req.body["prepLaborCost"]).toFixed(2),
      tag: Array.isArray(req.body["tag"])
        ? req.body["tag"].join(",")
        : req.body["tag"],
      targetDaysInAmazon: req.body["targetDaysInAmazon"],
      targetDaysInWarehouse: req.body["targetDaysInWarehouse"],
      isPartSKUOnly: req.body["isPartSKUOnly"],
      EANLocal: req.body["EANLocal"],
      packageWeightLocal: req.body["packageWeightLocal"],
      itemNoteLocal: req.body["itemNoteLocal"],
      dimensionsLocal: req.body["dimensionsLocal"],
      UPCLocal: req.body["UPCLocal"],
      isActiveLocal: req.body["isActiveLocal"],
      additionalPrepInstructions: req.body["additionalPrepInstructions"],
      itemNameLocal: req.body["itemNameLocal"],
      countryofOriginLocal: req.body["countryofOriginLocal"],
      htcCodeLocal: req.body["htcCodeLocal"],
      casePackQuantity: req.body["casePackQuantity"],
      casePackUPC: req.body["casePackUPC"],
      ismasterSku: req.body["ismasterSku"],
      masterSku: req.body["masterSku"],
      dimensionalWeight: req.body["dimensionalWeight"],
      user: req.loggedUser.username,
      imageUrl: req.body["imageUrl"] || "",
      imageHeight: req.body["imageHeight"] || "",
      imageWidth: req.body["imageWidth"] || "",
      itemName: req.body["itemName"] || "",
      status: req.body["status"] || "",
      isActive: req.body["isActive"] || 1,
      UPC: req.body["UPC"] || "",
      EAN: req.body["EAN"] || "",
      packageWeight: req.body["packageWeight"] || "",
      packageDimensions: req.body["packageDimensions"] || "",
      dimensions: req.body["dimensions"] || "",
      amazonOversized: req.body["amazonOversized"] || "",
      hazmat: req.body["hazmat"] || "",
      itemNote: req.body["itemNote"] || "",
      amazonASIN: req.body["amazonASIN"] || "",
      amazonSnL: req.body["amazonSnL"] || "",
      amazonFNSKU: req.body["amazonFNSKU"] || "",
      kit: req.body["kit"] || "",
      changeLog: req.body["changeLog"] || "",
      productId: req.body["productId"] || "",
      history: req.body["history"] || "",
      productIdType: req.body["productIdType"] || "1",
      amazonPrepInstructions: req.body["amazonPrepInstructions"] || "",
      lastUpdateFromAmazon: req.body["lastUpdateFromAmazon"] || new Date(),
      expirationDateRequired: req.body["expirationDateRequired"] || "0",
    };
    const newSKU = `SellerSKU${Math.floor(Math.random() * 999999)}`;
    const config = await sellerSettings.getSellerId(req.loggedUser.username);
    params["sellerId"] = config.SellerId;
    params["sellerSKU"] = newSKU;
    try {
      const result = await mysql.query(addProductImporter, params);
      return res.status(200).send(result);
    } catch (error) {
      return res.status(500).send(error);
    }
  }
  getProduct(sku) {
    return new Promise((resolve, reject) => {
      mysql
        .query(getProductBySku, sku)
        .then((products) => resolve(products))
        .catch((err) => reject(err));
    });
  }
  getFullProducts(sku) {
    return new Promise((resolve, reject) => {
      mysql
        .query(getProduct, [])
        .then((products) => resolve(products))
        .catch((err) => reject(err));
    });
  }
  getFullProductsByPurchaseOrder(params) {
    return new Promise((resolve, reject) => {
      mysql
        .query(getProductByPurchaseOrder, [params])
        .then((products) => resolve(products))
        .catch((err) => reject(err));
    });
  }
  async getMastersku(req, res, next) {
    const { query = "" } = req.query;
    const value = `%${query}%`;
    try {
      const sku = await mysql.query(getMasterSku, [value]);
      return res.status(200).send(sku);
    } catch (error) {
      return res.status(500).send(error);
    }
  }
}
module.exports = new productsService();
