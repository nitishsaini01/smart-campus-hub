const mysql = require("mysql2/promise");

const pool = mysql.createPool({
host: "localhost",
user: "root",
password: "mysqlnitish01",
database: "smart_campus"
});

module.exports = pool;