const mwsService = require("../mws/mwsService"),
  constant = require("../../util/constant"),
  mysql = require("../mysql"),
  {
    getProduct,
    addProduct,
    updateProduct,
    updateProductDetailsbyId,
    updateFNSKU,
    addLastSynch,
    updateProductsLive,
    updateProductUI,
    getRestockData,
    addRestock,
    updateRestock,
    addProductFromSync,
  } = require("../../util/sqlquery"),
  log = require("../log"),
  historyService = require("../../service/history/historyService"),
  spApiSyncService = require("../../service/sync/spApiSyncService"),
  sellingPartnerAPIService = require("../../service/sp-api/sellingPartnerAPIService");
const inventoryPlannerService = require("../../service/inventoryPlannerService");
const { configure } = require("winston");
const { capitalizeFirstLetter } = require("../../helper");
const moment = require("moment");
const { promiseResolver } = require("../../util/common");
class mwsSyncService {
  async updateInvetory(user) {
    try {
      log.info(`Sync start by ${user}`);
      var lastSync = {
        username: user,
        type: "Full Product Sync",
        start_time: new Date(),
        end_time: "",
        status: "Failed",
      };
      var config = await mwsService.getConfig(user);
      var latestReportId = await sellingPartnerAPIService.getreportId(
        constant.GET_MERCHANT_LISTINGS_ALL_DATA_SP_API,
        constant.MARKETPLACE_ID_US
      );
      var latestData = await sellingPartnerAPIService.getreport(
        latestReportId[0].reportDocumentId
      );

      log.info(`Report ID ${latestReportId[0].reportDocumentId}`);

      log.info(
        `Total products  ${latestData.length} for reportid ${latestReportId}`
      );
      var savedProductsList = await mysql.query(getProduct, null);
      await mysql.query(updateProductsLive, null);
      var updatedData = await this.synchProductWithDB(
        latestData,
        savedProductsList,
        user
      );
      await this.getMatchingProductForId(user);
      await this.fetchFNSKU(user);
      lastSync["end_time"] = new Date();
      lastSync["status"] = "Success";
      await mysql.query(addLastSynch, lastSync);
      return new Promise((resolve, reject) => {
        resolve(updatedData);
      });
    } catch (error) {
      lastSync["end_time"] = new Date();
      await mysql.query(addLastSynch, lastSync);
    }
  }

  updateNanoInvetory(user) {
    return new Promise(async (resolve, reject) => {
      try {
        log.info(`Nano Sync start by ${user}`);
        const config = await mwsService.getConfig(user);
        const latestReportId = await sellingPartnerAPIService.getReportslist(
          constant.GET_MERCHANT_LISTINGS_ALL_DATA_SP_API,
          config
        );

        log.info(`Report ID ${JSON.stringify(latestReportId)}`);

        const latestDataAvail =
          await sellingPartnerAPIService.getReportDocumentsUsingSPAPI(
            latestReportId
          );

        log.info(`Total products  ${latestDataAvail.length} for reportid`);

        const skuList = latestDataAvail.map((product) => product["seller-sku"]);

        const prepFetched = await sellingPartnerAPIService.getPrepInstruction(
          skuList
        );

        const lastestData = this.setPrepInsideProducts(
          latestDataAvail,
          prepFetched
        );

        const savedProductsList = await mysql.query(getProduct, null);

        const latestDataOnly = await this.filterNewSkuData(
          lastestData,
          savedProductsList
        );
        //newSkuList: newSkuList, dbSkuList: dbSkuList

        const updatedData = await this.synchProductWithDB(
          latestDataOnly.newSkuList,
          savedProductsList,
          user
        );

        if (latestDataOnly.dbSkuList.length > 0) {
          await this.getMatchingProductForId(user, latestDataOnly.dbSkuList);
        }

        await this.fetchFNSKU(user);
        resolve(updatedData);
      } catch (error) {
        log.error(error);
        reject(error);
      }
    });
  }

  setPrepInsideProducts(products, prepsInstructions) {
    if (!prepsInstructions.length || !products.length) {
      return products;
    }

    products.forEach((product) => {
      const prepInst = prepsInstructions.find(
        (inst) => inst.SellerSKU === product["seller-sku"]
      );

      if (!prepInst) {
        return;
      }

      product["prepInstruction"] =
        prepInst?.PrepInstructionList?.join(",") || "";
    });
    return products;
  }

  async synchProductWithDB(serverProducts, DBProducts = [], user) {
    let totalupdateList = [],
      totalAddList = 0;
    var config = await mwsService.getConfig(user);
    let bulkInsertData = [];
    try {
      serverProducts.forEach((product) => {
        var found = DBProducts.filter((item) => {
          return product["seller-sku"] == item["sellerSKU"];
        });
        if (found && found.length > 0) {
          //itemName=?,status=?,itemNote=?,productId=?,productIdType=?,sellerId,sellerSKU
          var updateList = [
            product["prepInstruction"] || "",
            product["item-name"],
            product["status"],
            product["item-note"],
            product["product-id"],
            product["product-id-type"],
            config.SellerId,
            product["seller-sku"],
          ];
          //updateLiveStatus.push([{ amzlive: 1 }, product['seller-sku']])
          totalupdateList.push(updateList);
          var oldValue = {
            itemName: found[0]["itemName"],
            status: found[0]["status"],
            itemNote: found[0]["itemNote"],
            productId: found[0]["productId"],
            productIdType: found[0]["productIdType"],
            sellerId: found[0]["sellerId"],
            sellerSKU: found[0]["sellerSKU"],
            amazonPrepInstructions: found[0]["amazonPrepInstructions"],
          };
          var newValue = {
            itemName: product["item-name"],
            status: product["status"],
            itemNote: product["item-note"],
            productId: product["product-id"],
            productIdType: product["product-id-type"],
            sellerId: config.SellerId,
            sellerSKU: product["seller-sku"],
            amazonPrepInstructions: product["prepInstruction"],
          };

          historyService.addHistory(
            "Products",
            user,
            JSON.stringify(oldValue),
            JSON.stringify(newValue)
          );

          mysql
            .query(updateProduct, updateList)
            .then((sqlResponse) => {
              //log.info(`Updated products ${sqlResponse.affectedRows}`);
            })
            .catch((error) => {
              log.error(`Error while Updating  products ${error}`);
            });
        } else {
          //sellerId,user,imageUrl,itemName,sellerSKU,status,itemNote,dateAdded,amazonASIN,productId,productIdType
          totalAddList++;
          var newList = [
            product["prepInstruction"] || "",
            config.SellerId,
            user,
            product["item-name"] || "",
            product["seller-sku"],
            product["status"] || "",
            product["item-note"] || "",
            product["open-date"]
              ? moment(product["open-date"]).format("YYYY-MM-DD HH:mm:ss")
              : moment().format("YYYY-MM-DD HH:mm:ss"),
            product["asin1"] || "",
            product["product-id"] || "",
            product["product-id-type"] || 0,
            1,
          ];

          var newValue = {
            sellerId: config.SellerId,
            user: user,
            itemName: product["item-name"] || "",
            sellerSKU: product["seller-sku"],
            status: product["status"] || "",
            itemNote: product["item-note"] || "",
            dateAdded: product["open-date"] || "",
            amazonASIN: product["asin1"] || "",
            productId: product["product-id"] || "",
            amazonPrepInstructions: product["prepInstruction"],
            productIdType: product["product-id-type"] || 0,
            amzlive: 1,
          };

          historyService.addHistory(
            "Products",
            user,
            null,
            JSON.stringify(newValue)
          );

          bulkInsertData.push([...newList, ...constant.productDefault()]);
        }
      });

      log.info(`Adding new products ${totalAddList}`);
      log.info(`Adding new products ${totalAddList}`);
      log.info(`Updating products ${totalupdateList.length}`);

      if (bulkInsertData.length) {
        await this.batchInsertDatainDB(bulkInsertData);
      }
      // if (newList.length > 0) {
      //      mysql.query(addProduct, newList)
      //           .then(sqlResponse => {
      //                log.info(`Total added products ${sqlResponse.affectedRows}`);
      //           })
      //           .catch(error => {
      //                log.error(`Error while adding  products ${error}`);
      //           })
      // }
      return { newProducts: totalAddList, updatedProducts: totalupdateList };
    } catch (error) {
      log.info(`Exception on updating/adding products ${error}`);
      throw error;
    }
  }

  async batchInsertDatainDB(bulkData) {
    try {
      log.info("Bulk insert started!");

      const chunks = [];

      const chunkSize = 100;

      for (let i = 0; i < bulkData.length; i += chunkSize) {
        chunks.push(bulkData.slice(i, i + chunkSize));
      }

      for (const chunk of chunks) {
        log.info(`bulk inserting ${chunk.length} records`);
        await this.insertData(addProductFromSync, chunk);
        log.info(`bulk inserting ${chunk.length} records completed`);
      }

      log.info("Bulk insert completed successfully!");
    } catch (error) {
      log.error(`Error while adding products: ${error}`);
      throw error;
    }
  }

  async insertData(query, data) {
    return mysql.query(query, [data]);
  }

  async getMatchingProductForId(user, savedProductsList = []) {
    if (savedProductsList.length == 0) {
      savedProductsList = await mysql.query(getProduct, null);
    }
    var skuId = {},
      index = 1,
      total = 1;
    log.info(
      `getMatchingProductForId executed and total :${savedProductsList.length}`
    );
    try {
      for (let product of savedProductsList) {
        skuId[`IdList.Id.${index}`] = product.sellerSKU;
        if (
          index == constant.MATCHING_PRODUCT_LIST_LIMIT ||
          total == savedProductsList.length
        ) {
          await this.waitTime();
          var productDetails = await mwsService.getMatchingProductForId(
            user,
            skuId
          );
          Array.isArray(productDetails)
            ? ""
            : (productDetails = [productDetails]);
          productDetails.forEach((newProductDetail) => {
            if (
              newProductDetail["Products"] &&
              newProductDetail["Products"].Product &&
              newProductDetail["Products"].Product.AttributeSets
            ) {
              var detail =
                  newProductDetail["Products"].Product.AttributeSets
                    .ItemAttributes,
                packageWeight = "",
                PackageDimensions = "",
                dimensions = "",
                imageUrl = "",
                imageHeight = "",
                imageWidth = "",
                oversize = "";
              if (
                detail["PackageDimensions"] &&
                detail["PackageDimensions"].Weight
              ) {
                PackageDimensions = detail["PackageDimensions"];
              }
              if (detail["ItemDimensions"]) {
                dimensions = detail["ItemDimensions"];
              }
              if (detail["SmallImage"] && detail["SmallImage"].URL) {
                imageUrl = detail["SmallImage"].URL;
                imageHeight = detail["SmallImage"].Height.Value;
                imageWidth = detail["SmallImage"].Width.Value;
              }
              if (
                (PackageDimensions["Height"] &&
                  PackageDimensions["Height"].Value >=
                    constant.OVERSIZE_WEIGHT) ||
                (PackageDimensions["Length"] &&
                  PackageDimensions["Length"].Value >=
                    constant.OVERSIZE_LENGTH) ||
                (PackageDimensions["Weight"] &&
                  PackageDimensions["Weight"].Value >= constant.OVERSIZE_WIDTH)
              ) {
                oversize = "YES";
                log.info(`oversize SKU :${newProductDetail.Id}`);
              }
              //log.info(`product found SKU :${newProductDetail.Id}`);
              mysql.query(updateProductDetailsbyId, [
                oversize,
                imageUrl,
                imageHeight,
                imageWidth,
                JSON.stringify(PackageDimensions),
                JSON.stringify(dimensions),
                newProductDetail.Id,
              ]);
            } else {
              //log.info(`product not found SKU :${newProductDetail.Id}`);
            }
          });
          index = 0;
          skuId = {};
        }
        index++;
        total++;
      }
    } catch (error) {
      log.error("Exception in getMatchingProductForId");
      log.error(error);
    }
    // var updatedData = await this.synchProductWithDB(latestData.data, savedProductsList, user);
    return new Promise((resolve, reject) => {
      resolve(true);
    });
  }
  async fetchFNSKU(user) {
    const latestReportId = await sellingPartnerAPIService.getReportslist(
      constant.GET_FBA_MYI_ALL_INVENTORY_DATA_SP_API
    );

    log.info(`fetchFNSKU Report ID ${latestReportId}`);

    const config = await mwsService.getConfig(user);
    const latestDataAvail =
      await sellingPartnerAPIService.getReportDocumentsUsingSPAPI(
        latestReportId
      );

    log.info(`fetchFNSKU updating total  ${latestDataAvail}`);

    latestDataAvail.forEach((product) => {
      mysql.query(updateFNSKU, [
        product["fnsku"],
        config.SellerId,
        product["sku"],
      ]);
    });

    log.info(`fetchFNSKU updated  ${latestDataAvail.length}`);
  }

  async getMatchingProductForIdSingle(user, asin) {
    this.fetchFNSKU(user);
    log.info(`getMatchingProductForIdSingle executed for sku :${asin}`);
    try {
      const config = await mwsService.getConfig();

      const productDetail =
        await sellingPartnerAPIService.searchCatalogItemsBySellerSKU(
          asin,
          config
        );

      const updatedProduct = this.convertSPProductForDatabase(
        productDetail || {}
      );

      log.info(JSON.stringify(updatedProduct, null, 3), "coming here");

      let oversize = null;

      const {
        link: imageUrl,
        width: imageWidth,
        height: imageHeight,
      } = updatedProduct.smallImage || {};

      const { Height, Length, Weight } = updatedProduct.packageDimensions || {};

      if (
        Height?.Value >= constant.OVERSIZE_WEIGHT ||
        Length?.Value >= constant.OVERSIZE_LENGTH ||
        Weight?.Value >= constant.OVERSIZE_WIDTH
      ) {
        oversize = "YES";
        log.info(`oversize SKU :${asin}`);
      }

      mysql.query(updateProductDetailsbyId, [
        oversize,
        imageUrl,
        imageHeight,
        imageWidth,
        JSON.stringify(updatedProduct.packageDimensions),
        JSON.stringify(updatedProduct.dimensions),
        asin,
      ]);
    } catch (error) {
      log.error("Exception in getMatchingProductForId");
      log.error(error);
    }
    // var updatedData = await this.synchProductWithDB(latestData.data, savedProductsList, user);
    return new Promise((resolve, reject) => {
      resolve(true);
    });
  }

  convertSPProductForDatabase({ attributes, images }) {
    let packageDimensions = "";
    let dimensions = "";
    let smallImage = {};

    if (attributes) {
      const {
        item_display_dimensions: itemPackageDimensions,
        item_dimensions: itemDimensions,
        item_weight: itemWeights,
      } = attributes;

      if (
        Array.isArray(itemPackageDimensions) &&
        itemPackageDimensions.length
      ) {
        const pkgDimension = itemPackageDimensions[0];

        Object.keys(pkgDimension).forEach((key) => {
          if (typeof pkgDimension[key] !== "object") {
            delete pkgDimension[key];
            return;
          }

          const dimensionKey = capitalizeFirstLetter(key);
          const dimension = pkgDimension[key];

          pkgDimension[dimensionKey] = {};
          pkgDimension[dimensionKey].Value = dimension.value;
          pkgDimension[dimensionKey].Units = dimension.unit;

          delete pkgDimension[key];
        });

        if (Array.isArray(itemWeights) && itemWeights.length) {
          const itemWeight = itemWeights[0];
          pkgDimension.Weight = {
            Value: itemWeight.value?.toFixed(3),
            Units: itemWeight.unit,
          };
        }

        packageDimensions = pkgDimension;
      }

      if (Array.isArray(itemDimensions) && itemDimensions.length) {
        const itemDimension = itemDimensions[0];

        Object.keys(itemDimension).forEach((key) => {
          if (typeof itemDimension[key] !== "object") {
            delete itemDimension[key];
            return;
          }

          const dimensionKey = capitalizeFirstLetter(key);
          const dimension = itemDimension[key];

          itemDimension[dimensionKey] = {};
          itemDimension[dimensionKey].Value = dimension.value;
          itemDimension[dimensionKey].Units = dimension.unit;

          delete itemDimension[key];
        });

        if (Array.isArray(itemWeights) && itemWeights.length) {
          const itemWeight = itemWeights[0];
          itemDimension.Weight = {
            Value: itemWeight.value,
            Units: itemWeight.unit,
          };
        }

        dimensions = itemDimension;
      }
    }

    if (Array.isArray(images) && images.length) {
      const availImages = images[0]?.images;

      smallImage = availImages.reduce(
        (minVal, image) => (minVal.width < image.width ? minVal : image),
        {}
      );
    }

    return { packageDimensions, dimensions, smallImage };
  }

  async filterNewSkuData(serverProducts, DBProducts = [], user) {
    var newSkuList = [],
      dbSkuList = [];
    serverProducts.forEach((product) => {
      var found = DBProducts.filter((item) => {
        return product["seller-sku"] == item["sellerSKU"];
      });
      if (found.length == 0) {
        newSkuList.push(product);
        dbSkuList.push({ sellerSKU: product["seller-sku"] });
      }
    });
    return { newSkuList: newSkuList, dbSkuList: dbSkuList };
  }

  waitTime() {
    return new Promise((resolve, reject) => {
      setTimeout(function () {
        resolve(true);
      }, 1000);
    });
  }

  async fetchRestock(user) {
    log.info(`fetchRestock start by ${user}`);
    let lastSync = {
      username: user,
      type: "Restock Sync",
      start_time: new Date(),
      end_time: "",
      status: "Failed",
    };
    try {
      // Get US and CA report from SP-API
      const [reportsUS, reportsCA] = await promiseResolver([
        sellingPartnerAPIService.getreportId(
          "GET_RESTOCK_INVENTORY_RECOMMENDATIONS_REPORT",
          constant.MARKETPLACE_ID_US
        ),
        sellingPartnerAPIService.getreportId(
          "GET_RESTOCK_INVENTORY_RECOMMENDATIONS_REPORT",
          constant.MARKETPLACE_ID_CA
        ),
      ]);
      // Get latest US and CA data from SP-API and restock data from DB.
      const [latestDataUS, latestDataCA, savedRestockData] =
        await promiseResolver([
          sellingPartnerAPIService.getreport(reportsUS[0].reportDocumentId),
          sellingPartnerAPIService.getreport(reportsCA[0].reportDocumentId),
          mysql.query(getRestockData, null),
        ]);
      const batchSize = 5000;
      // Process US and CA data in batches
      for (let i = 0; i < latestDataUS.length; i += batchSize) {
        const batchUS = latestDataUS.slice(i, i + batchSize);
        const batchCA = latestDataCA.slice(i, i + batchSize);
        await promiseResolver([
          this.fetchRestockBatch(user, batchUS, "US", savedRestockData),
          this.fetchRestockBatch(user, batchCA, "CA", savedRestockData),
        ]);
      }
      // Update Sales metrics in Restock.
      promiseResolver([
        spApiSyncService.updateSalesMatrix(),
        spApiSyncService.updateAmazonFees(),
      ]);
      //Add end-time and status.
      lastSync["end_time"] = new Date();
      lastSync["status"] = "Success";
      // Insert Sync status in Last Sync
      await mysql.query(addLastSynch, lastSync);
    } catch (error) {
      lastSync["end_time"] = new Date();
      // Insert Sync status in Last Sync
      await mysql.query(addLastSynch, lastSync);
      log.error(error);
    }
    return new Promise((resolve, reject) => {
      resolve("Done");
    });
  }

  async fetchRestockBatch(user, data, market_place, savedRestockData) {
    // Loop through all latest data.
    for (const element of data) {
      try {
        // Match existing data with Latest Data.
        const find = savedRestockData.find((el) => {
          return (
            el["market_place"] == market_place &&
            element["Merchant SKU"] == el["amz_sku"]
          );
        });
        if (find) {
          //Update Values.
          const restockUpdate = [
            {
              amz_total_days_of_amz_supply: isNaN(
                +element["Days of Supply at Amazon Fulfillment Network"]
              )
                ? null
                : +element["Days of Supply at Amazon Fulfillment Network"],
              amz_recommended_order_qty: isNaN(
                +element["Recommended replenishment qty"]
              )
                ? null
                : +element["Recommended replenishment qty"],
              amz_recommended_order_date: !isNaN(
                Date.parse(element["Recommended ship date"])
              )
                ? new Date(element["Recommended ship date"])
                : null,
              amz_current_price: element["Price"],
              amazon_category: element["Condition"],
              update_reason: "Restock Sync",
            },
            element["Merchant SKU"],
            market_place,
          ];
          // Update data with new values and store it in DB.
          await this.updateRestock(restockUpdate, find, user);
        } else {
          // Create new record.
          const restockNew = {
            market_place: market_place,
            amz_sku: element["Merchant SKU"],
            amz_total_days_of_amz_supply: isNaN(
              +element["Days of Supply at Amazon Fulfillment Network"]
            )
              ? null
              : +element["Days of Supply at Amazon Fulfillment Network"],
            amz_recommended_order_qty: isNaN(
              +element["Recommended replenishment qty"]
            )
              ? null
              : +element["Recommended replenishment qty"],
            amz_recommended_order_date: !isNaN(
              Date.parse(element["Recommended ship date"])
            )
              ? new Date(element["Recommended ship date"])
              : null,
            amz_current_price: element["Price"],
            amazon_category: element["Condition"],
            update_reason: "Restock Sync",
          };
          // Insert in Restock table.
          await this.addRestock(restockNew, user);
        }
      } catch (error) {
        throw error;
      }
    }
  }
  async addRestock(data, user) {
    try {
      await mysql.query(addRestock, data);
      historyService.addHistory("Restock", user, null, JSON.stringify(data));
    } catch (error) {
      log.error(error);
    }
  }

  async updateRestock(data, olddata, user) {
    try {
      await mysql.query(updateRestock, data);
      var jsonData = data[0];
      jsonData["amz_sku"] = data[1];
      jsonData["market_place"] = data[2];
      historyService.addHistory(
        "Restock",
        user,
        JSON.stringify(olddata),
        JSON.stringify(jsonData)
      );
    } catch (error) {
      log.error(error);
    }
  }

  async fetchShipments() {
    try {
      var response = await inventoryPlannerService.fetchData();
      for (var i = 0; i < response.length; i++) {
        var shipmentItems = await inventoryPlannerService.fetchShipmentDetails(
          response[i]
        );
        if (shipmentItems.length > 0) {
          await inventoryPlannerService.savePurchaseOrder(
            response[i],
            shipmentItems
          );
        }
      }

      return "done";
    } catch (err) {
      return "Failed";
    }
  }
}
module.exports = new mwsSyncService();
