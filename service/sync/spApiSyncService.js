const { queryBatcher, promiseResolver } = require("../../util/common");
const reStockService = require("../restock/restockService"),
  sellingPartnerOperationsService = require("../sp-api/sellingPartnerOperationsService"),
  constant = require("../../util/constant"),
  { updateRestock } = require("../../util/sqlquery"),
  log = require("../log");
const sellingPartnerAPIService = require("../sp-api/sellingPartnerAPIService");

class spApiSyncService {
  async updateSalesMatrix() {
    const skus = await reStockService.getAllRestock();
    const queries = [];
    //Get and asign sales metrics for all SKUs
    for (const element of skus) {
      let updateMatrix = {};
      try {
        let marketPlace = constant.MARKETPLACE_ID_US;
        let currencyCode = "USD";
        //Check if marketPlace is 'CA'.
        if (element["market_place"].toUpperCase() == "CA") {
          marketPlace = constant.MARKETPLACE_ID_CA;
          currencyCode = "CAD";
        }
        //Get Metrics data
        const [
          responseWeekly,
          responseMonthly,
          responseThreeMonths,
          responseYearly,
          feeEstimateResponse,
        ] = await promiseResolver([
          sellingPartnerOperationsService.getOrderMetricsWeekly(
            marketPlace,
            element["amz_sku"]
          ),
          sellingPartnerOperationsService.getOrderMetricsMonthly(
            marketPlace,
            element["amz_sku"]
          ),
          sellingPartnerOperationsService.getOrderMetricsThreeMonths(
            marketPlace,
            element["amz_sku"]
          ),
          sellingPartnerOperationsService.getOrderMetricsYearly(
            marketPlace,
            element["amz_sku"]
          ),
          sellingPartnerOperationsService.getFeesEstimateBySKU(
            marketPlace,
            element["amz_sku"],
            element["amz_current_price"],
            currencyCode
          ),
        ]);
        // Check if Weekly metrics are present.
        if (responseWeekly) {
          // if true then create key value pairs.
          updateMatrix["amz_units_ordered7"] = responseWeekly[0].unitCount
            ? responseWeekly[0].unitCount
            : null;
          updateMatrix["amz_avg_selling_price7"] = (+responseWeekly[0]
            .averageUnitPrice.amount).toFixed(2);
          updateMatrix["amz_total_sell_amt7"] =
            responseWeekly[0].totalSales.amount;
        }
        // Check if Monthly metrics are present.
        if (responseMonthly) {
          // if true then create key value pairs.
          updateMatrix["amz_units_ordered30"] = responseMonthly[0].unitCount
            ? responseMonthly[0].unitCount
            : 0;
          updateMatrix["amz_avg_selling_price30"] = (+responseMonthly[0]
            .averageUnitPrice.amount).toFixed(2);
          updateMatrix["amz_total_sell_amt30"] =
            responseMonthly[0].totalSales.amount;
        }
        // Check if Three Months metrics are present.
        if (responseThreeMonths) {
          // if true then create key value pairs.
          updateMatrix["amz_units_ordered90"] = responseThreeMonths[0].unitCount
            ? responseThreeMonths[0].unitCount
            : 0;
          updateMatrix["amz_avg_selling_price90"] = (+responseThreeMonths[0]
            .averageUnitPrice.amount).toFixed(2);
          updateMatrix["amz_total_sell_amt90"] =
            responseThreeMonths[0].totalSales.amount;
        }
        // Check if Yearly metrics are present.
        if (responseYearly) {
          // if true then create key value pairs.
          updateMatrix["amz_units_ordered365"] = responseYearly[0].unitCount
            ? responseYearly[0].unitCount
            : 0;
          updateMatrix["amz_avg_selling_price365"] = (+responseYearly[0]
            .averageUnitPrice.amount).toFixed(2);
          updateMatrix["amz_total_sell_amt365"] =
            responseYearly[0].totalSales.amount;
        }
        // Check if Fee Estimates are present.
        if (!isNaN(feeEstimateResponse)) {
          updateMatrix["amz_fee_estimate"] = (+feeEstimateResponse).toFixed(2);
        }
        //Add update_reason and current time to updateMatrix.
        updateMatrix["update_reason"] = "Restock Sync.";
        updateMatrix["timespan"] = new Date();
        //Push into  Queries array.
        queries.push({
          query: updateRestock,
          params: [updateMatrix, element["amz_sku"], element["market_place"]],
        });
      } catch (e) {
        log.error(e);
        log.error(
          "updateSalesMatrix",
          updateMatrix,
          element["amz_sku"],
          element["market_place"]
        );
        throw e;
      }
    }
    await queryBatcher(1000, queries);
    return true;
  }
  //To update amazon total fees(FBA fees, monthly storage fees) in DB.
  async updateAmazonFees() {
    try {
      const [fbaFeeData, storageFeeData, savedRestockData] =
        await promiseResolver([
          this.getFeesFromSpAPI(
            constant.GET_FBA_ESTIMATED_FBA_FEES_TXT_DATA_SP_API
          ),
          this.getFeesFromSpAPI(
            constant.GET_FBA_STORAGE_FEE_CHARGES_DATA_SP_API
          ),
          reStockService.getAllRestock(),
        ]);
      // Calculate AMAZON Total Fees and Save in DB for each saved product.
      const totalFeeQueries = savedRestockData.map((element) => {
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
        // Save in DB.
        return {
          query: updateRestock,
          params: [
            { amz_total_fee: totalAmazonFees },
            element["amz_sku"],
            element["market_place"],
          ],
        };
      });
      await queryBatcher(1000, totalFeeQueries);
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
