const { getRestockData } = require("../../util/sqlquery");
const mwsSyncService = require("../mws/mwsSyncService");
const sellingPartnerAPIService = require("../sp-api/sellingPartnerAPIService");
const spApiSyncService = require("../sync/spApiSyncService");
const constant = require("../../util/constant");
const mysql = require("../mysql");

async function syncRestock(user) {
  console.warn("In Fetching", user);
  console.warn("After log");

  var reportsUS = await sellingPartnerAPIService.getreportId(
    "GET_RESTOCK_INVENTORY_RECOMMENDATIONS_REPORT",
    constant.MARKETPLACE_ID_US
  );
  console.warn("After us report");

  var reportsCA = await sellingPartnerAPIService.getreportId(
    "GET_RESTOCK_INVENTORY_RECOMMENDATIONS_REPORT",
    constant.MARKETPLACE_ID_CA
  );
  console.warn("After ca report");

  var latestDataUS = await sellingPartnerAPIService.getreport(
    reportsUS[0].reportDocumentId
  );
  console.warn("After us Data");

  var latestDataCA = await sellingPartnerAPIService.getreport(
    reportsCA[0].reportDocumentId
  );
  console.warn("After ca Data");

  const savedRestockData = await mysql.query(getRestockData);
  console.warn("After Saved");

  try {
    console.log("IN IF");
    latestDataUS.forEach(async (element) => {
      var find = savedRestockData.find((el) => {
        return (
          el["market_place"] == "US" && element["Merchant SKU"] == el["amz_sku"]
        );
      });
      if (find) {
        var restockUSUpdate = [
          {
            amz_total_days_of_amz_supply:
              element["Days of Supply at Amazon Fulfillment Network"],
            amz_recommended_order_qty: element["Recommended replenishment qty"],
            amz_recommended_order_date: !isNaN(
              Date.parse(element["Recommended ship date"])
            )
              ? new Date(element["Recommended ship date"])
              : null,
            amz_current_price: element["Price"],
            amazon_category: element["Condition"],
          },
          element["Merchant SKU"],
          "US",
        ];

        await mwsSyncService.updateRestock(restockUSUpdate, find, user);
      } else {
        var restockUSNew = {
          market_place: "US",
          amz_sku: element["Merchant SKU"],
          amz_total_days_of_amz_supply:
            element["Days of Supply at Amazon Fulfillment Network"],
          amz_recommended_order_qty: element["Recommended replenishment qty"],
          amz_recommended_order_date: !isNaN(
            Date.parse(element["Recommended ship date"])
          )
            ? new Date(element["Recommended ship date"])
            : null,
          amz_current_price: element["Price"],
          amazon_category: element["Condition"],
        };
        await mwsSyncService.addRestock(restockUSNew, user);
      }
    });

    latestDataCA.forEach(async (element) => {
      var find = savedRestockData.find((el) => {
        return (
          el["market_place"] == "CA" && element["Merchant SKU"] == el["amz_sku"]
        );
      });
      if (find) {
        var restockCAUpdate = [
          {
            amz_total_days_of_amz_supply:
              element["Days of Supply at Amazon Fulfillment Network"],
            amz_recommended_order_qty: element["Recommended replenishment qty"],
            amz_recommended_order_date: !isNaN(
              Date.parse(element["Recommended ship date"])
            )
              ? new Date(element["Recommended ship date"])
              : null,
            amz_current_price: element["Price"],
            amazon_category: element["Condition"],
          },
          element["Merchant SKU"],
          "CA",
        ];
        await mwsSyncService.updateRestock(restockCAUpdate, find, user);
      } else {
        var restockCANew = [
          {
            market_place: "CA",
            amz_sku: element["Merchant SKU"],
            amz_total_days_of_amz_supply:
              element["Days of Supply at Amazon Fulfillment Network"],
            amz_recommended_order_qty: element["Recommended replenishment qty"],
            amz_recommended_order_date: !isNaN(
              Date.parse(element["Recommended ship date"])
            )
              ? new Date(element["Recommended ship date"])
              : null,
            amz_current_price: element["Price"],
            amazon_category: element["Condition"],
          },
        ];
        await mwsSyncService.addRestock(restockCANew, user);
      }
    });
    spApiSyncService.updateSalesMatrix();

    console.log("END SYNC");
  } catch (error) {
    console.log("ERROR:::", error);
    log.error(error);
  }
  return new Promise((resolve, reject) => {
    resolve("Done");
  });
}

module.exports = {
  syncRestock,
};
