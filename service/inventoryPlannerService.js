var log = require("./log");

const MwsApi = require("amazon-mws"),
  sellerSettings = require("./settings/sellerSettings"),
  constant = require("../util/constant"),
  amazonMws = new MwsApi();
const axios = require("axios");
const url = require("url");
const mysql = require("./mysql"),
  {
    savePurchaseOrder,
    getPurchaseOrder,
    deletePurchaseOrder,
    getVirtualPurchaseOrder,
    getVirtualShipmentById,
    updateVirtualShipmentById,
    removeVirtualShipmentById,
    updateShipmenStatus,
    getShipmentByShipmentId,
    getShipmentByName,
    getPurchaseOrderCount,
    getVirtualPurchaseOrderCount,
  } = require("../util/sqlquery");
const params = new url.URLSearchParams({ limit: 1000, page: 0 });
const productrService = require("./products/productsService");
const inventoryService = require("./location/locationService");
const sellingPartnerOperationsService = require("../service/sp-api/sellingPartnerOperationsService");
const CommonUtil = require("../util/common");

class inventoryPlannerService {
  async fetchData(user, reportId) {
    return new Promise((resolve, reject) => {
      var params = {
        ShipmentStatusList: [
          "WORKING",
          "READY_TO_SHIP",
          "SHIPPED",
          "RECEIVING",
          "CANCELLED",
          "DELETED",
          "CLOSED",
          "ERROR",
          "IN_TRANSIT",
          "DELIVERED",
          "CHECKED_IN",
        ],
        QueryType: "DATE_RANGE",
        MarketplaceId: constant.MARKETPLACE_ID_US,
        LastUpdatedAfter: new Date(
          new Date().setDate(new Date().getDate() - 2)
        ),
        LastUpdatedBefore: new Date(
          new Date().setDate(new Date().getDate() + 1)
        ),
      };
      sellingPartnerOperationsService
        .fetchShipmentByName(params)
        .then((ids) => {
          var shipmentId = [];
          shipmentId.push(...ids.ShipmentData);

          var loadNext = function (token) {
            params["QueryType"] = "NEXT_TOKEN";
            params["NextToken"] = token;
            sellingPartnerOperationsService
              .fetchShipmentByName(params)
              .then((nextids) => {
                if (nextids.ShipmentData) {
                  shipmentId.push(...ids.ShipmentData);
                }
                if (nextids.NextToken) {
                  loadNext(nextids.NextToken);
                } else {
                  resolve(shipmentId);
                }
              });
          };
          if (ids.NextToken) {
            loadNext(ids.NextToken);
          } else {
            resolve(shipmentId);
          }
        });
    });
  }
  async getConfig(user) {
    var config = await sellerSettings.getUserSetting(
      user,
      constant.INVENTORY_PLANNER
    );
    return new Promise((resolve, reject) => {
      if (config && config.length > 0 && config[0].settings) {
        resolve(JSON.parse(config[0].settings));
      } else {
        reject();
      }
    });
  }
  fetchOrders(page, config) {
    return new Promise((resolve, reject) => {
      axios
        .get(
          `${constant.INVENTORY_PLANNER_SERVICE_URL}?limit=1000&page=${page}`,
          {
            method: "get",
            headers: {
              "Content-Type": "application/json",
              Account: config.Account,
              Authorization: config.Authorization,
            },
          }
        )
        .then((data) => resolve(data.data))
        .catch((error) => {
          reject(error);
        });
    });
  }

  async fetchShipmentDetails(shipment) {
    return new Promise(async (resolve, reject) => {
      var shipmentItemDetails = [];
      var params = {
        shipmentId: shipment.ShipmentId,
      };
      sellingPartnerOperationsService
        .fetchShipmentItemsById(params, constant.MARKETPLACE_ID_US)
        .then((ids) => {
          if (ids.ItemData.length > 0) {
            shipmentItemDetails.push(...ids.ItemData);
          }
          var loadNext = function (token) {
            params["QueryType"] = "NEXT_TOKEN";
            (params["NextToken"] = token),
              (params["MarketplaceId"] = constant.MARKETPLACE_ID_US);
            sellingPartnerOperationsService
              .fetchShipmentItemsByNextToken(params)
              .then((nextids) => {
                if (nextids && nextids.ItemData.length > 0) {
                  shipmentItemDetails.push(...nextids.ItemData);
                }
                if (nextids.NextToken) {
                  loadNext(nextids.NextToken);
                } else {
                  resolve(shipmentItemDetails);
                }
              });
          };
          if (ids.NextToken) {
            loadNext(ids.NextToken);
          } else {
            resolve(shipmentItemDetails);
          }
        });
    });
  }
  async savePurchaseOrder(shipment, shipmentItems) {
    var checkExist = await mysql.query(
      getShipmentByShipmentId,
      shipment.ShipmentId
    );

    log.info(shipment.ShipmentId, shipment.ShipmentName);
    if (checkExist.length > 0) {
      mysql.query(updateShipmenStatus, [
        shipment.ShipmentStatus,
        shipment.ShipmentId,
      ]);
    } else {
      var sku = [],
        totalShipments = 0;
      shipmentItems.forEach((item) => {
        sku.push({
          sku: item["SellerSKU"],
          masterSKU: null,
          sent: item["QuantityShipped"],
          casePackQuantity: item["QuantityInCase"],
        });
        totalShipments += +item["QuantityShipped"];
      });
      var data = {
        reference: shipment.ShipmentName,
        remoteId: shipment.ShipmentId,
        status: shipment.ShipmentStatus,
        created_date: new Date(),
        items: JSON.stringify(sku),
        total: totalShipments,
        total_ordered: totalShipments,
        created_at: new Date(),
        sent_date: new Date(),
        total_sent: totalShipments,
        created_by: "Auto Job",
        warehouse: null,
        is_virtual: null,
      };
      await mysql.query(savePurchaseOrder, data);
    }
  }
  async getPurchaseOrder(queryParams) {
    return new Promise((resolve, reject) => {
      const { sorting, searchParam, sort } = queryParams;

      const parsedSort = JSON.parse(sort || "[]");

      let sqlQuery = getPurchaseOrder;
      const whereParams = [];

      if (searchParam) {
        sqlQuery +=
          " where is_virtual <1 || is_virtual is null AND remoteId LIKE ? OR reference LIKE ? ORDER by created_date DESC";
        whereParams.push(`%${searchParam}%`);
        whereParams.push(`%${searchParam}%`);
      } else {
        sqlQuery +=
          " where is_virtual <1 || is_virtual is null ORDER by created_date DESC";
      }

      if (sorting) {
        sqlQuery.replace("ORDER by created_date DESC", "");
      }

      const unknownColumns = ["import"];

      if (
        parsedSort.length &&
        !unknownColumns.includes(parsedSort[0].property)
      ) {
        const sortQuery = sqlQuery.includes("ORDER")
          ? `, ${parsedSort[0].property} ${parsedSort[0].direction}`
          : ` ORDER BY ${parsedSort[0].property} ${parsedSort[0].direction}`;
        sqlQuery += sortQuery;
      }

      sqlQuery = CommonUtil.createPaginationAndSortingQuery(
        sqlQuery,
        queryParams,
        whereParams
      );

      mysql
        .query(sqlQuery, whereParams)
        .then(async (shipments) => {
          const shipmentIDS = shipments?.map((ship) => ship.id) || [];

          if (!shipmentIDS.length) {
            resolve(shipments);
            return;
          }

          const products = await productrService.getFullProductsByPurchaseOrder(
            shipmentIDS
          );
          shipments.forEach((data) => {
            let prepareItems = [];
            const items = JSON.parse(data["items"]);
            items.forEach((element) => {
              const foundProduct = products.find(
                (product) => product.sellerSKU == element.sku
              );
              if (foundProduct) {
                element["image"] = foundProduct["imageUrl"];
                element["title"] = foundProduct["itemName"];
                element["asin"] = foundProduct["amazonASIN"];
              }
              prepareItems.push(element);
            });
            data["items"] = JSON.stringify(prepareItems);
          });
          resolve(shipments);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  async getPurchaseOrderCount(queryParams) {
    return new Promise((resolve, reject) => {
      const { searchParam } = queryParams;

      let sqlQuery = getPurchaseOrderCount;
      const whereParams = [];

      if (searchParam) {
        sqlQuery +=
          " AND remoteId LIKE ? OR reference LIKE ? ORDER by created_date DESC";
        whereParams.push(`%${searchParam}%`);
        whereParams.push(`%${searchParam}%`);
      }

      mysql
        .query(sqlQuery, whereParams)
        .then(async (shipments) => {
          resolve(shipments);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  async getVirtualShipments(queryParams) {
    const { type, sorting, searchParam } = queryParams;

    let whereParams = [];
    let sqlQuery = getVirtualPurchaseOrder;

    whereParams.push(type);

    if (searchParam) {
      sqlQuery +=
        " where is_virtual =? AND remoteId LIKE ? OR reference LIKE ? ORDER by created_date DESC";
      whereParams.push(`%${searchParam}%`);
      whereParams.push(`%${searchParam}%`);
    } else {
      sqlQuery += " where is_virtual =? ORDER by created_date DESC";
    }

    if (sorting) {
      sqlQuery.replace("ORDER by created_date DESC", "");
    }

    sqlQuery = CommonUtil.createPaginationAndSortingQuery(
      sqlQuery,
      queryParams,
      whereParams
    );

    const virtualShipments = await mysql.query(sqlQuery, whereParams);
    const virtualShipmentIds = virtualShipments?.map((ship) => ship.id) || [];

    if (!virtualShipmentIds.length) {
      return virtualShipments;
    }

    const products = await productrService.getFullProductsByPurchaseOrder(
      virtualShipmentIds
    );

    try {
      virtualShipments.forEach(async (data) => {
        let prepareItems = [];
        const items = JSON.parse(data["items"]);
        items.forEach((element) => {
          const foundProduct = products.find(
            (product) => product.sellerSKU == element.sku
          );
          if (foundProduct) {
            element["image"] = foundProduct["imageUrl"];
            element["title"] = foundProduct["itemName"];
            element["asin"] = foundProduct["amazonASIN"];
            element["replenishment"] = element.sent;
          }
          prepareItems.push(element);
        });
        data["items"] = JSON.stringify(prepareItems);
      });
    } catch (error) {
      console.log(error);
    }
    return virtualShipments;
  }

  async getVirtualShipmentsCount(queryParams) {
    const { type, searchParam } = queryParams;

    let sqlQuery = getVirtualPurchaseOrderCount;

    const whereParams = [];
    whereParams.push(type);

    if (searchParam) {
      sqlQuery += " AND remoteId LIKE ? OR reference LIKE ?";
      whereParams.push(`%${searchParam}%`);
      whereParams.push(`%${searchParam}%`);
    }

    const virtualShipments = await mysql.query(sqlQuery, whereParams);

    return virtualShipments;
  }

  async getVirtualShipmentById(id) {
    var getVirtualShipments = await mysql.query(getVirtualShipmentById, id);
    var products = await productrService.getFullProducts();
    getVirtualShipments.forEach((data) => {
      var prepareItems = [];
      var items = JSON.parse(data["items"]);
      items.forEach((element) => {
        var foundProduct = products.filter(
          (product) => product.sellerSKU == element.sku
        );
        if (foundProduct.length > 0) {
          element["image"] = foundProduct[0]["imageUrl"];
          element["title"] = foundProduct[0]["itemName"];
          element["asin"] = foundProduct[0]["amazonASIN"];
          element["total_ordered"] = element.sent;
          element["replenishment"] = element.sent;
        }
        prepareItems.push(element);
      });
      data["items"] = JSON.stringify(prepareItems);
    });
    return getVirtualShipments;
  }

  async addVirtualShipment(
    username,
    items,
    totalSent,
    shipmentName,
    marketPlace,
    wareHouse
  ) {
    var current = new Date();
    var data = {
      reference: shipmentName,
      remoteId:
        shipmentName +
        `-${
          current.getMonth() + 1
        }-${current.getDate()}-${current.getFullYear()}`,
      status: "Active",
      created_date: new Date(),
      items: items,
      total: totalSent,
      total_ordered: totalSent,
      created_at: new Date(),
      sent_date: new Date(),
      total_sent: totalSent,
      created_by: username,
      warehouse: wareHouse,
      is_virtual: 1,
    };
    let inventory = JSON.parse(items);
    inventory.forEach(async function (item) {
      var sku = item.sku;
      if (item.masterSKU) {
        sku = item.masterSKU;
      }
      var stock = await inventoryService.getInventoryStock([sku, wareHouse]);
      if (stock.length > 0) {
        var updateStock = stock[0]["stock"] - item["sent"];
        await inventoryService.updateInventoryStockNoMaster([
          updateStock,
          sku,
          wareHouse,
        ]);
      }
    });
    var shvedData = await mysql.query(savePurchaseOrder, data);
    var newShipment = await this.getVirtualShipmentById(shvedData.insertId);
    return newShipment;
  }
  async updateVirtualShipmentById(items, id) {
    await mysql.query(updateVirtualShipmentById, [items, new Date(), id]);
    return true;
  }

  async removeVirtualShipmentById(status, id) {
    const sql = removeVirtualShipmentById.split("WHERE");
    try {
      if (status === "Removed") {
        await mysql.query(`${sql[0]}, deleted_at=? WHERE ${sql[1]}`, [
          status,
          new Date(),
          id,
        ]);
      } else if (status === "Finalized") {
        await mysql.query(`${sql[0]}, finalized_at=? WHERE ${sql[1]}`, [
          status,
          new Date(),
          id,
        ]);
      }
      return true;
    } catch (error) {
      throw error;
    }
  }
  async getShipmentByName(shipmentName) {
    var existShipment = await mysql.query(getShipmentByName, [
      shipmentName.toLowerCase(),
    ]);
    return existShipment;
  }
}
module.exports = new inventoryPlannerService();
