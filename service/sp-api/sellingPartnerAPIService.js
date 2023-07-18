const SellingPartnerAPI = require("amazon-sp-api"),
  log = require("../log");
const constant = require("../../util/constant");

let sellingPartner = new SellingPartnerAPI({
  region: "na", // The region to use for the SP-API endpoints ("eu", "na" or "fe")
  refresh_token: process.env.access_token, // The refresh token of your app user
});

class sellingPartnerAPIService {
  async getreport(report_document, reportId) {
    // var config = await this.getConfig(user);
    try {
      let document = await sellingPartner.callAPI({
        operation: "getReportDocument",
        endpoint: "reports",
        path: {
          reportDocumentId: report_document,
        },
      });
      let report = await sellingPartner.download(document, {
        json: true,
      });
      return report;
    } catch (e) {
      log.error(e);
    }
  }
  async getreportId(reportType, marketplaceIds) {
    // var config = await this.getConfig(user);
    try {
      let res = await sellingPartner.callAPI({
        operation: "getReports",
        endpoint: "reports",
        query: {
          reportTypes: reportType,
          marketplaceIds: marketplaceIds,
        },
      });
      return res;
    } catch (e) {
      log.error(e);
    }
  }

  async getReportDocumentsUsingSPAPI(reportIds) {
    try {
      const promises = reportIds.map(async (report, index) => {
        const response = await this.getreport(report.reportDocumentId);

        return response;
      });

      const reportDocuments = await Promise.all(promises);

      const flatDocuments = reportDocuments.flat();
      log.info(flatDocuments.length)
      return flatDocuments;
    } catch (error) {
      log.error(
        "Error fetching report documents using Selling Partner API:",
        error
      );
      throw error;
    }
  }

  async getReportslist(reportType, config) {
    try {
      const response = await sellingPartner.callAPI({
        operation: "getReports",
        endpoint: "reports",
        query: {
          reportTypes: reportType,
          processingStatuses: "DONE",
        },
      });

      return response;
    } catch (error) {
      log.error("Failed to fetch report requests:", error);
      throw error;
    }
  }

  async searchCatalogItemsBySellerSKU(asin, config) {
    try {
  
      const response = await sellingPartner.callAPI({
        operation: "getCatalogItem",
        path: {
          asin,
        },
        query: {
          marketplaceIds: config.MarketPalaceID,
          includedData: 'attributes,images',
        },  
      });
  
      log.info(JSON.stringify(response));
      return response;
    } catch (error) {
      log.error(error);
      throw error;
    }
  }
  
  async getPrepInstruction(sellerSKUs) {
    const batchSize = 50; // Set the batch size as per your requirements
    const totalSKUs = sellerSKUs.length;
    const result = [];
  
    log.info("Getting getPrep instruction against", totalSKUs, `Total batches will be ${Math.ceil(totalSKUs / batchSize)}`);
  
    try {
      for (let i = 0; i < totalSKUs; i += batchSize) {
        const batchSKUs = sellerSKUs.slice(i, i + batchSize);
  
        const response = await sellingPartner.callAPI({
          operation: "getPrepInstructions",
          query: {
            SellerSKUList: batchSKUs,
            ShipToCountryCode: "US",
          },
        });
  
        result.push(...(response?.SKUPrepInstructionsList || []));
  
        log.info(`Fetched batch ${i / batchSize + 1}`);
      }
  
      log.info("Getting getPrep instruction completed");
      return result;
    } catch (error) {
      log.error(error);
      throw error;
    }
  }
  
  async callAPi(
    operation,
    endpoint,
    queryParams = null,
    pathParams = null,
    option = null
  ) {
    try {
      let res = await sellingPartner.callAPI({
        operation: operation,
        endpoint: endpoint,
        query: queryParams,
        path: pathParams,
        options: option,
      });
      return res;
    } catch (e) {
      log.error(e);
    }
  }

  async callAPiWithFullPath(
    operation,
    endpoint,
    apiPath,
    method = "POST",
    bodyParams = null,
    pathParams = null,
    queryParams = null
  ) {
    try {
      let res = await sellingPartner.callAPI({
        operation: operation,
        endpoint: endpoint,
        api_path: apiPath,
        method: method,
        body: bodyParams,
        query: queryParams,
        pathParams: pathParams,
      });
      return res;
    } catch (e) {
      log.error(
        "callAPiWithFullPath",
        e,
        operation,
        endpoint,
        apiPath,
        method,
        bodyParams,
        pathParams,
        queryParams
      );
    }
  }
}
module.exports = new sellingPartnerAPIService();
