var log = require('../log');

const MwsApi = require('amazon-mws'),
    sellerSettings = require('../settings/sellerSettings'),
    constant = require("../../util/constant"),
    amazonMws = new MwsApi(),
    MWSClient = require('mws-api');
var xml2js = require('xml2js');
var xmlParser = new xml2js.Parser({
    mergeAttrs: true,
    explicitArray: false,
    emptyTag: {},
    charkey: 'Value'
});
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
                    log.error(error.Message);
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
                    log.error(error.Message);
                    reject(error)
                }
                else {
                    if (response && response.ReportRequestInfo && response.ReportRequestInfo.length > 0) {
                        resolve(response.ReportRequestInfo);
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
                    log.error(error.Message);
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
                    if (products.length > 0) {
                        resolve(products);
                    }
                    resolve(response);
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

    async getByStatus(user) {
        var config = await this.getConfig(user);
        amazonMws.setApiKey(config.AWSAccessKeyId, config.ClientSecret);
        var ShipmentData = await amazonMws.fulfillmentInboundShipment.search({
            'Version': '2010-10-01',
            'Action': 'ListInboundShipments',
            'SellerId': config.SellerId,
            'MWSAuthToken': config.MWSAuthToken,
            'ShipmentStatusList.member.1': 'WORKING',
            'ShipmentStatusList.member.2': 'SHIPPED',
            'ShipmentStatusList.member.3': 'IN_TRANSIT',
            'ShipmentStatusList.member.4': 'DELIVERED',
            'ShipmentStatusList.member.5': 'CHECKED_IN',
            'ShipmentStatusList.member.6': 'RECEIVING',
            'ShipmentStatusList.member.7': 'CLOSED'

        });       
        return ShipmentData
    }

    async getByStatusbytoken(user, token) {
        var config = await this.getConfig(user);
        amazonMws.setApiKey(config.AWSAccessKeyId, config.ClientSecret);
        var shipmentIds = await amazonMws.fulfillmentInboundShipment.search({
            'Version': '2010-10-01',
            'Action': 'ListInboundShipmentsByNextToken',
            'SellerId': config.SellerId,
            'MWSAuthToken': config.MWSAuthToken,
            'NextToken': token

        });
        return shipmentIds;
    }

    async fetchinboundShipment(user, id) {
        var me = this;
        var config = await this.getConfig(user);
        amazonMws.setApiKey(config.AWSAccessKeyId, config.ClientSecret);
        return new Promise((resolve, reject) => {
            amazonMws.fulfillmentInboundShipment.search({
                'Version': '2010-10-01',
                'Action': 'ListInboundShipmentItems',
                'SellerId': config.SellerId,
                'MWSAuthToken': config.MWSAuthToken,
                'ShipmentId': id

            }, function (error, response) {
                if (error) {
                    reject(error)
                }
                else {
                    if (response.NextToken && response.NextToken != "") {
                        me.fetchinboundShipmentByToken(user, response).then((data) => {
                            resolve(data);
                        })
                    }
                    else {
                        console.log('ListInboundShipmentItems', response)
                        resolve(response.ItemData.member)
                    }

                }
            });
        });
    }
    async fetchinboundShipmentByToken(user, response) {
        var config = await this.getConfig(user);
        const mws = new MWSClient({
            accessKeyId: config.AWSAccessKeyId,
            secretAccessKey: config.ClientSecret,
            merchantId: config.SellerId,
            meta: {
                retry: true, // retry requests when throttled
                next: true, // auto-paginate
                limit: Infinity // only get this number of items (NOT the same as MaxRequestsPerPage)
            }
        });
        var data = response.ItemData.member, token = response.NextToken;
        return new Promise((resolve, reject) => {
            var nextLoad = function (token) {
                mws.FulfillmentInboundShipment.ListInboundShipmentItemsByNextToken({
                    NextToken: token
                }).then(({ result, metadata }) => {
                    if (metadata) {
                        reject(metadata)
                    }
                    else {
                        xmlParser.parseString(result, function (err, nextresponse) {
                            var nextdata = nextresponse.ListInboundShipmentItemsByNextTokenResponse.ListInboundShipmentItemsByNextTokenResult.ItemData.member, nexttoken = nextresponse.ListInboundShipmentItemsByNextTokenResponse.ListInboundShipmentItemsByNextTokenResult.NextToken;
                            if (nexttoken) {
                                if (nextdata) {
                                    data.push(...nextdata)
                                }
                                nextLoad(nexttoken);
                            }
                            else {
                                if (nextdata) {
                                    data.push(...nextdata)
                                }
                                resolve(data);
                            }
                        });
                    }
                });
            }
            nextLoad(token);
        });
    }

    async validateShipmentName(user, shipmentName) {
        return new Promise((resolve, reject) => {
            var me = this;
            me.getByStatus(user).then((ids) => {
                var members = ids.ShipmentData.member;
                for (var i = 0; i < members.length; i++) {

                    if (members[i].ShipmentName.toLowerCase().indexOf(shipmentName) > -1) {
                        resolve(true);
                        break;
                    }
                }
                var loadNext = function (token) {
                    me.getByStatusbytoken(user, token).then((nextids) => {
                        if (nextids.ShipmentData.member) {
                            var members = nextids.ShipmentData.member;
                            for (var i = 0; i < members.length; i++) {
                                if (members[i].ShipmentName.toLowerCase().indexOf(shipmentName) > -1) {
                                    resolve(true);
                                    break;
                                }
                            }
                        }
                        if (nextids.NextToken) {
                            loadNext(nextids.NextToken);
                        }
                        else {
                            resolve(false);
                        }
                    })

                }
                if (ids.NextToken) {
                    loadNext(ids.NextToken)
                }

            })
        });
    }

}
module.exports = new mwsService;
