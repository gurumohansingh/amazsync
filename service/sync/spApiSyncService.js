const reStockService = require("../restock/restockService"),
  sellingPartnerOperationsService = require("../sp-api/sellingPartnerOperationsService"),
  constant = require("../../util/constant"),
  mysql = require("../mysql"),
  { updateRestock, getRestockData } = require("../../util/sqlquery"),
  log = require("../log");
const sellingPartnerAPIService = require("../sp-api/sellingPartnerAPIService");

class spApiSyncService {
  async updateSalesMatrix() {
    const skus = await reStockService.getAllRestock();
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
          throw e;
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
          throw e;
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
          throw e;
        }
      }
    };
    const yearly = async function () {
      for (var i = 0; i < skus.length; i++) {
        try {
          var updateMatrix = {};
          var sku = skus[i];
          var marketPlace = constant.MARKETPLACE_ID_US;

          if (sku["market_place"].toUpperCase() == "CA") {
            marketPlace = constant.MARKETPLACE_ID_CA;
          }

          var response =
            await sellingPartnerOperationsService.getOrderMetricsYearly(
              marketPlace,
              sku["amz_sku"]
            );

          if (response) {
            updateMatrix["amz_units_ordered365"] = response[0].unitCount
              ? response[0].unitCount
              : 0;
            updateMatrix["amz_avg_selling_price365"] = (+response[0]
              .averageUnitPrice.amount).toFixed(2);
            updateMatrix["amz_total_sell_amt365"] =
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
          throw e;
        }
      }
    };
    weekly();
    monthly();
    threemonthly();
    yearly();
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
          updateMatrix["update_reason"] = "Restock Sync.";

          mysql.query(updateRestock, [
            updateMatrix,
            sku["amz_sku"],
            sku["market_place"],
          ]);
        } else {
          mysql.query(updateRestock, [
            { update_reason: apiResponse || "" },
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
        throw e;
      }
    }
    return true;
  }

  //TO update amazon total fees(FBA fees, monthly storage fees) in DB.
  async updateAmazonFees() {
    try {
      // Get FBA Fees data from sp-api
      const fbaFeeData = await this.getFeesFromSpAPI(
        constant.GET_FBA_ESTIMATED_FBA_FEES_TXT_DATA_SP_API
      );
      //Get storage Fees data from sp-api
      const storageFeeData = await this.getFeesFromSpAPI(
        constant.GET_FBA_STORAGE_FEE_CHARGES_DATA_SP_API
      );
      // Get all saved RESTOCK data.
      const savedRestockData = await reStockService.getAllRestock();
      console.log(savedRestockData.length);
      // Calculate AMAZON Total Fees and Save in DB for each saved product.
      savedRestockData.forEach(async (element) => {
        //Get average Monthly storage fees of matching ASIN.
        const avgStorageFee = this.storageFeeAvg(
          storageFeeData,
          element.amazonASIN,
          element.market_place,
          element.amazonFNSKU
        );

        //Get average FBA fees of matching ASIN.
        const avgFBAFees = this.fbaFeeAvg(
          fbaFeeData,
          element.amazonASIN,
          element.market_place,
          element.amz_sku
        );
        //Calculate total amazon fees.
        const totalAmazonFees =
          (+avgFBAFees ? +avgFBAFees : 0) +
          (+avgStorageFee ? +avgStorageFee : 0);
        log.info(
          `Total: ${totalAmazonFees} , FBAFees: ${avgFBAFees}, StorageFee: ${avgStorageFee} `
        );
        // Save in DB.
        await mysql.query(updateRestock, [
          { amz_total_fee: totalAmazonFees },
          element["amz_sku"],
          element["market_place"],
        ]);
      });
    } catch (err) {
      log.error(err);
      throw err;
    }
  }

  //To get report data from sp-api
  async getFeesFromSpAPI(reportType) {
    try {
      let doc = await sellingPartnerOperationsService.getReportDocumentId(
        reportType,
        [constant.MARKETPLACE_ID_US, constant.MARKETPLACE_ID_CA]
      );
      doc = doc.find(
        ({ marketplaceIds, processingStatus }) =>
          marketplaceIds.length > 1 && processingStatus === "DONE"
      );

      const data = await sellingPartnerAPIService.getreport(
        doc.reportDocumentId
      );
      return data;
    } catch (error) {
      log.error("restockService => getFeesFromSpAPI", error);
      throw error;
    }
  }

  //Average of Monthly Storage Fee
  storageFeeAvg(data, ASIN, countryCode, FNSKU) {
    const result = data.reduce(
      (accumulator, element) => {
        if (
          countryCode == element.country_code &&
          (ASIN == element.asin || FNSKU == element.fnsku)
        ) {
          // Initialize the sum and count for each key if not already done
          accumulator.monthlyFee += +element["estimated_monthly_storage_fee"];
          accumulator.countKey += 1;
        }
        return accumulator;
      },
      { monthlyFee: 0, countKey: 0 }
    );
    return (
      result["monthlyFee"] / (+result["countKey"] ? +result["countKey"] : 1)
    );
  }

  //Average of FBA Fee
  fbaFeeAvg(data, ASIN, countryCode, SKU) {
    const currency = this.getCountryCode(countryCode);
    const result = data.reduce(
      (accumulator, element) => {
        if (
          currency === element.currency &&
          (ASIN == element.asin || SKU == element.sku)
        ) {
          accumulator.feeTotal +=
            +element["estimated-fee-total"] +
            +element["estimated-referral-fee-per-unit"] +
            +element["estimated-variable-closing-fee"];
          accumulator.countKey += 1;
        }
        return accumulator;
      },
      { feeTotal: 0, countKey: 0 }
    );
    return result["feeTotal"] / (+result["countKey"] ? +result["countKey"] : 1);
  }

  getCountryCode(countryCode) {
    switch (countryCode) {
      case "US":
        return "USD";
      case "CA":
        return "CAD";
      default:
        return "USD";
    }
  }
}
module.exports = new spApiSyncService();
