var mysql = require('mysql');
// Initialize pool
var pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DBSERVER || null,
    user: process.env.DBUSER || null,
    password: process.env.DBPASSWORD || null,
    database: process.env.DBNAME || null,
    debug: false
});
module.exports = pool;
