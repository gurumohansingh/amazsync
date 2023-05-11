const { json } = require('express');
const mysql = require('./mysql'),
    { selectLastSynch } = require("../util/sqlquery"),
    sellerSettings = require("../service/settings/sellerSettings");
constant = require("../util/constant");
class infoService {
    getLastSync = async function (userName) {
        return new Promise((resolve, reject) => {
            mysql.query(selectLastSynch, [])
                .then((history) => resolve(history))
                .catch((error) => reject(error))
        })
    }
}

module.exports = new infoService;