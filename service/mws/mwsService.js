const MwsApi = require('amazon-mws'),
    sellerSettings = require('../settings/sellerSettings'),
    constant = require("../../util/constant"),
    amazonMws = new MwsApi(),
    MWSClient = require('mws-api');

class mwsService {
    async getreport(user, reportId) {
        var config = await this.getConfig(user);
        amazonMws.setApiKey(config.AWSAccessKeyId, config.ClientSecret);
        return new Promise((resolve, reject) => {
            amazonMws.reports.search({
                'Version': '2009-01-01',
                'Action': 'GetReport',
                'SellerId': config.SellerId,
                'MWSAuthToken': config.MWSAuthToken,
                'ReportId': reportId

            }, function (error, response) {
                if (error) {
                    reject(error)
                }
                else {
                    resolve(response)
                }
            });
        });
    }
    async getReportslist(user, reportType) {
        var config = await this.getConfig(user);
        amazonMws.setApiKey(config.AWSAccessKeyId, config.ClientSecret);
        return new Promise((resolve, reject) => {
            amazonMws.reports.search({
                'Version': '2009-01-01',
                'Action': 'GetReportRequestList',
                'SellerId': config.SellerId,
                'MWSAuthToken': config.MWSAuthToken,
                'eportProcessingStatusList.Status.1': '_DONE_',
                'ReportTypeList.Type.1': reportType,
                'delimiter': ','

            }, function (error, response) {
                if (error) {
                    reject(error)
                }
                else {
                    if (response && response.ReportRequestInfo && response.ReportRequestInfo.length > 0) {
                        resolve(response.ReportRequestInfo[1].GeneratedReportId);
                    }
                    else {
                        reject("No report found")
                    }

                }
            });
        });
    }
    async getMatchingProductForId(user, skuList) {
        var config = await this.getConfig(user);
        amazonMws.setApiKey(config.AWSAccessKeyId, config.ClientSecret);
        return new Promise((resolve, reject) => {
            amazonMws.products.searchFor({
                'Version': '2011-10-01',
                'Action': 'GetMatchingProductForId',
                'SellerId': config.SellerId,
                'MWSAuthToken': config.MWSAuthToken,
                'MarketplaceId': config.MarketPalaceID,
                'IdType': constant.IDTYPE,
                ...skuList
            }, function (error, response) {

                if (error) {
                    reject(error)
                }
                else {
                    var products = [];
                    //check manually if all 5 responses are returning
                    if (response[0]) {
                        products.push(response[0]);
                    }
                    if (response[1]) {
                        products.push(response[1]);
                    }
                    if (response[2]) {
                        products.push(response[2]);
                    }
                    if (response[3]) {
                        products.push(response[3]);
                    }
                    if (response[4]) {
                        products.push(response[4]);
                    }
                    console.log(products);
                    resolve(products);
                }
            });
        });
    }
    async getConfig(user) {
        var config = await sellerSettings.getSetting(user, constant.SELLERSETTINGGROUP);
        return new Promise((resolve, reject) => {
            if (config && config.length > 0 && config[0].settings) {
                resolve(JSON.parse(config[0].settings));
            }
            else {
                reject();
            }
        }
        )
    }
}
module.exports = new mwsService;
