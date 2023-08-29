const reStockService = require("../restock/restockService"),
  sellingPartnerOperationsService = require("../sp-api/sellingPartnerOperationsService"),
  constant = require("../../util/constant"),
  mysql = require("../mysql"),
  { updateRestock } = require("../../util/sqlquery"),
  log = require("../log");

class spApiSyncService {
  async updateSalesMatrix() {
    var skus = await reStockService.getAllRestock();
    const weekly = async function () {
      for (var i = 0; i < skus.length; i++) {
        try {
          var updateMatrix = {};
          var sku = skus[i];
          var marketPlace = constant.MARKETPLACE_ID_US;

          if (sku["market_place"].toUpperCase() == "CA") {
            marketPlace = constant.MARKETPLACE_ID_CA;
          }
          var response =
            await sellingPartnerOperationsService.getOrderMetricsWeekly(
              marketPlace,
              sku["amz_sku"]
            );

          if (response) {
            updateMatrix["amz_units_ordered7"] = response[0].unitCount
              ? response[0].unitCount
              : null;
            updateMatrix["amz_avg_selling_price7"] = (+response[0]
              .averageUnitPrice.amount).toFixed(2);
            updateMatrix["amz_total_sell_amt7"] = response[0].totalSales.amount;
          }

          updateMatrix["timespan"] = new Date();

          mysql.query(updateRestock, [
            updateMatrix,
            sku["amz_sku"],
            sku["market_place"],
          ]);
        } catch (e) {
          log.error(e);
          log.error(
            "updateSalesMatrix",
            updateMatrix,
            sku["amz_sku"],
            sku["market_place"]
          );
        }
      }
    };
    const monthly = async function () {
      for (var i = 0; i < skus.length; i++) {
        try {
          var updateMatrix = {};
          var sku = skus[i];
          var marketPlace = constant.MARKETPLACE_ID_US;

          if (sku["market_place"].toUpperCase() == "CA") {
            marketPlace = constant.MARKETPLACE_ID_CA;
          }

          var response =
            await sellingPartnerOperationsService.getOrderMetricsMonthly(
              marketPlace,
              sku["amz_sku"]
            );

          if (response) {
            updateMatrix["amz_units_ordered30"] = response[0].unitCount
              ? response[0].unitCount
              : 0;
            updateMatrix["amz_avg_selling_price30"] = (+response[0]
              .averageUnitPrice.amount).toFixed(2);
            updateMatrix["amz_total_sell_amt30"] =
              response[0].totalSales.amount;
          }
          updateMatrix["timespan"] = new Date();

          mysql.query(updateRestock, [
            updateMatrix,
            sku["amz_sku"],
            sku["market_place"],
          ]);
        } catch (e) {
          log.error(e);
          log.error(
            "updateSalesMatrix",
            updateMatrix,
            sku["amz_sku"],
            sku["market_place"]
          );
        }
      }
    };
    const threemonthly = async function () {
      for (var i = 0; i < skus.length; i++) {
        try {
          var updateMatrix = {};
          var sku = skus[i];
          var marketPlace = constant.MARKETPLACE_ID_US;

          if (sku["market_place"].toUpperCase() == "CA") {
            marketPlace = constant.MARKETPLACE_ID_CA;
          }

          var response =
            await sellingPartnerOperationsService.getOrderMetricsThreeMonths(
              marketPlace,
              sku["amz_sku"]
            );

          if (response) {
            updateMatrix["amz_units_ordered90"] = response[0].unitCount
              ? response[0].unitCount
              : 0;
            updateMatrix["amz_avg_selling_price90"] = (+response[0]
              .averageUnitPrice.amount).toFixed(2);
            response[0].totalSales.amount;
          }

          updateMatrix["timespan"] = new Date();

          mysql.query(updateRestock, [
            updateMatrix,
            sku["amz_sku"],
            sku["market_place"],
          ]);
        } catch (e) {
          log.error(e);
          log.error(
            "updateSalesMatrix",
            updateMatrix,
            sku["amz_sku"],
            sku["market_place"]
          );
        }
      }
    };
    weekly();
    monthly();
    threemonthly();
    var feeskus = await reStockService.getRestocktoGetFee();

    for (var i = 0; i < feeskus.length; i++) {
      try {
        var marketPlace = constant.MARKETPLACE_ID_US;

        var sku = feeskus[i],
          currencyCode = "USD",
          updateMatrix = {};
        if (sku["market_place"].toUpperCase() == "CA") {
          marketPlace = constant.MARKETPLACE_ID_CA;
          currencyCode = "CAD";
        }

        var apiResponse =
          await sellingPartnerOperationsService.getFeesEstimateBySKU(
            marketPlace,
            sku["amz_sku"],
            sku["amz_current_price"],
            currencyCode
          );

        if (!isNaN(apiResponse)) {
          updateMatrix["amz_fee_estimate"] = (+apiResponse).toFixed(2);
          updateMatrix["timespan"] = new Date();

          mysql.query(updateRestock, [
            updateMatrix,
            sku["amz_sku"],
            sku["market_place"],
          ]);
        } else {
          mysql.query(updateRestock, [
            { update_reason: apiResponse },
            sku["amz_sku"],
            sku["market_place"],
          ]);
        }
      } catch (e) {
        log.error(e);
        log.error(
          "updateSalesMatrix",
          updateMatrix,
          sku["amz_sku"],
          sku["market_place"]
        );
      }
    }

    return true;
  }
}
module.exports = new spApiSyncService();
