const { json } = require('express');
const mysql = require('./mysql'),
    { selectLastSynch } = require("../util/sqlquery"),
    sellerSettings = require("../service/settings/sellerSettings");
constant = require("../util/constant");
class infoService {
    getLastSync = async function (userName) {
        var config = await sellerSettings.getSetting(userName, constant.SELLERSETTINGGROUP);
        var configJson = JSON.parse(config[0].settings);
        var lastSync = await mysql.query(selectLastSynch, [userName, configJson.SellerId]);
        return new Promise((resolve, reject) => {
            resolve(lastSync[0]);
        })
    }
}
module.exports = new infoService;