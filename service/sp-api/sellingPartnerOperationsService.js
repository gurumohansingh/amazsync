const sellingPartnerAPIService = require("../sp-api/sellingPartnerAPIService"),
  log = require("../log");

class sellingPartnerOperationsService {
  async getOrderMetricsWeekly(marketPlace, sku) {
    var paramns = {
      marketplaceIds: marketPlace,
      interval: `${this.getStartDate(7)}--${this.getEndDate()}`,
      granularity: "Total",
      sku: sku,
    };
    var response = await sellingPartnerAPIService.callAPi(
      "getOrderMetrics",
      "sales",
      paramns
    );
    return response;
  }

  async getOrderMetricsMonthly(marketPlace, sku) {
    var paramns = {
      marketplaceIds: marketPlace,
      interval: `${this.getStartDate(30)}--${this.getEndDate()}`,
      granularity: "Total",
      sku: sku,
    };
    var response = await sellingPartnerAPIService.callAPi(
      "getOrderMetrics",
      "sales",
      paramns
    );
    return response;
  }
  async getOrderMetricsThreeMonths(marketPlace, sku) {
    var paramns = {
      marketplaceIds: marketPlace,
      interval: `${this.getStartDate(90)}--${this.getEndDate()}`,
      granularity: "Total",
      sku: sku,
    };
    var response = await sellingPartnerAPIService.callAPi(
      "getOrderMetrics",
      "sales",
      paramns
    );
    return response;
  }

  async getOrderMetricsYearly(marketPlace, sku) {
    var paramns = {
      marketplaceIds: marketPlace,
      interval: `${this.getStartDate(365)}--${this.getEndDate()}`,
      granularity: "Total",
      sku: sku,
    };
    var response = await sellingPartnerAPIService.callAPi(
      "getOrderMetrics",
      "sales",
      paramns
    );
    return response;
  }

  getStartDate(days) {
    var today = new Date();
    today.setDate(today.getDate() - days);
    var startDate = today.toISOString().substr(0, 11) + "00:00:00-07:00";
    return startDate;
  }
  getEndDate() {
    var today = new Date();
    today.setDate(today.getDate() - 1);
    var endDate = today.toISOString().substr(0, 11) + "23:59:59-07:00";
    return endDate;
  }

  async getFeesEstimateBySKU(
    marketPlace,
    sku,
    amz_current_price,
    currencyCode
  ) {
    var bodyParams = {
      FeesEstimateRequest: {
        MarketplaceId: marketPlace,
        IsAmazonFulfilled: true,
        IdType: "SKU",
        Identifier: "total",
        PriceToEstimateFees: {
          ListingPrice: {
            CurrencyCode: currencyCode,
            Amount: amz_current_price,
          },
        },
      },
    };
    var response = await sellingPartnerAPIService.callAPiWithFullPath(
      "getMyFeesEstimates",
      "products",
      `/products/fees/v0/listings/${encodeURIComponent(sku)}/feesEstimate`,
      "POST",
      bodyParams
    );
    try {
      if (
        response &&
        response.FeesEstimateResult.FeesEstimate &&
        response.FeesEstimateResult.FeesEstimate.TotalFeesEstimate
      ) {
        return response.FeesEstimateResult.FeesEstimate.TotalFeesEstimate
          .Amount;
      } else {
        return (
          response?.FeesEstimateResult?.Error.Message || "An error occurred."
        );
      }
    } catch (error) {
      log.error("getFeesEstimateBySKU -error", error);
    }
  }
  async fetchShipmentByName(params) {
    var shipments = await sellingPartnerAPIService.callAPi(
      "getShipments",
      "fulfillmentInbound",
      params
    );
    return shipments;
  }

  async fetchShipmentItemsById(params, marketplaceId) {
    var query = {
      MarketplaceId: marketplaceId,
    };
    //queryParams=null,pathParams
    var shipments = await sellingPartnerAPIService.callAPi(
      "getShipmentItemsByShipmentId",
      "fulfillmentInbound",
      query,
      params
    );
    return shipments;
  }
  async fetchShipmentItemsByNextToken(params) {
    //queryParams=null,pathParams
    var shipments = await sellingPartnerAPIService.callAPi(
      "getShipmentItems",
      "fulfillmentInbound",
      params
    );
    return shipments;
  }

  async getReportDocumentId(reportType, marketplaceIds) {
    var reportDocumentId = await sellingPartnerAPIService.getreportId(
      reportType,
      marketplaceIds
    );
    return reportDocumentId;
  }

  async getReportData(rreportDocumentId) {
    var JsonData = await sellingPartnerAPIService.getreport(rreportDocumentId);
    return JsonData;
  }
}
module.exports = new sellingPartnerOperationsService();
