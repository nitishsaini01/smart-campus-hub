// backend/config/db.js
const mysql = require("mysql2");

const db = mysql.createPool({
  host: "localhost",
  user: "root",       // your MySQL username
  password: "mysqlnitish01",       // your MySQL password
  database: "smart_campus_hub"
});

// Test connection
db.getConnection((err, connection) => {
    if(err) {
        console.error("❌ MySQL connection failed:", err.message);
    } else {
        console.log("✅ MySQL connected successfully!");
        connection.release(); // release the connection back to pool
    }
});

module.exports = db;