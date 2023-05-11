const mysql = require("../mysql"),
    { getProfit} = require("../../util/sqlquery")

class profitService {
    getprofit(marketPlace) {
        return new Promise((resolve, reject) => {
            mysql.query(getProfit, marketPlace)
                .then(profit => resolve(profit))
                .catch(err => reject(err));
        })
    }
}
module.exports = new profitService;