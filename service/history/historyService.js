const mysql = require("../mysql"),
    { addHistory, getAllHistory } = require("../../util/sqlquery")

class historyService {
    getAllHistory(startDate, endDate, type, searchFilter) {
        return new Promise((resolve, reject) => {
            var searchText = searchFilter ? '%' + searchFilter + '%' : '%%';
            mysql.query(getAllHistory, [startDate, endDate, type, searchText, searchText])
                .then(history => resolve(history))
                .catch(err => reject(err));
        })
    }
    addHistory(type, user, oldvalue, newValue) {
        return new Promise((resolve, reject) => {
            mysql.query(addHistory, [type, user, oldvalue, newValue])
                .then(history => resolve("Added"))
                .catch(err => reject(err));
        })
    }

}
module.exports = new historyService;
