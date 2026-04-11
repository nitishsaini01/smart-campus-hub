const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const resourceRoutes = require("./routes/resourceRoutes");
const pool = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());

/* ---------- MYSQL CONNECTION ---------- */

pool.getConnection()
.then(conn => {
console.log("✅ MySQL Connected");
conn.release();
})
.catch(err => {
console.error("❌ MySQL Error:", err);
});

/* ---------- STATIC FILES ---------- */

app.use(express.static(path.join(__dirname, "../frontend")));

/* ---------- UPLOAD FOLDER ---------- */

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ---------- ROUTES ---------- */

app.use("/api", authRoutes);
app.use("/api/resources", resourceRoutes);

/* ---------- DEFAULT PAGE ---------- */

app.get("/", (req, res) => {
res.sendFile(path.join(__dirname, "../frontend/login.html"));
});

/* ---------- SERVER ---------- */

const PORT = 3000;

app.listen(PORT, () => {
console.log(`🚀 Server running at http://localhost:${PORT}`);
});