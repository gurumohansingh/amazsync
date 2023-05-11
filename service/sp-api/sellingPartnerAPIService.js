const SellingPartnerAPI = require('amazon-sp-api'),
    log = require('../log');

let sellingPartner = new SellingPartnerAPI({
    region: 'na', // The region to use for the SP-API endpoints ("eu", "na" or "fe")
    refresh_token: process.env.access_token, // The refresh token of your app user    
});

class sellingPartnerAPIService {

    async getreport(report_document, reportId) {
        // var config = await this.getConfig(user);        
        try {
            let document = await sellingPartner.callAPI({
                operation: 'getReportDocument',
                endpoint: 'reports',
                path: {
                    reportDocumentId: report_document
                }
            });
            let report = await sellingPartner.download(document, {
                json: true
            });
            return report;
        } catch (e) {
            log.error(e)
        }
    }
    async getreportId(reportType, marketplaceIds) {
        // var config = await this.getConfig(user);        
        try {
            let res = await sellingPartner.callAPI({
                operation: 'getReports',
                endpoint: 'reports',
                query: {
                    reportTypes: reportType,
                    marketplaceIds: marketplaceIds
                }
            });
            return res;
        } catch (e) {
            log.error(e)
        }
    }
    async callAPi(operation, endpoint, queryParams=null,pathParams=null,option=null) {
        try {
            let res = await sellingPartner.callAPI({
                operation: operation,
                endpoint: endpoint,
                query: queryParams,
                path:pathParams,
                options:option

            });
            return res;
        } catch (e) {
            log.error(e)
        }
    }

    async callAPiWithFullPath(operation, endpoint, apiPath, method="POST", bodyParams=null, pathParams=null, queryParams=null) {
        try {
            let res = await sellingPartner.callAPI({
                operation: operation,
                endpoint: endpoint,
                api_path: apiPath,
                method: method,
                body: bodyParams,
                query: queryParams,
                pathParams: pathParams
            });
            return res;
        } catch (e) {
            log.error("callAPiWithFullPath",e,operation, endpoint, apiPath, method, bodyParams, pathParams, queryParams)
        }
    }
}
module.exports = new sellingPartnerAPIService;
