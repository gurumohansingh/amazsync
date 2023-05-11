var pool = require('./mysqlConnection'),
    log = require('./log');

exports.query = function (query, params) {
    return new Promise((resolve, reject) => {
        try {
            pool.getConnection(function (err, connection) {
                if (err) {
                    log.error(err);
                    connection.release();
                    reject(err);
                }
                connection.query(query, params, function (err, rows) {
                    //log.info("sql quey " + query, params);
                    connection.release();
                    if (!err) {
                        resolve(rows);
                    }
                    else {
                        log.error(err);
                        reject(err);
                    }
                });
            });
        }
        catch (err) {
            log.error(err);
        }
    })
}