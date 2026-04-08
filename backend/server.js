// backend/server.js
const express = require("express");
const cors = require("cors");
const path = require("path");
const authRoutes = require("./routes/authRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve frontend static files (CSS, JS)
app.use("/static", express.static(path.join(__dirname, "../frontend")));

// API routes
app.use("/api", authRoutes);
const statsRoutes = require("./routes/statsRoutes");
app.use("/api", statsRoutes);

// Serve login page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/login.html"));
});

const resourceRoutes = require("./routes/resourceRoutes");
app.use("/api", resourceRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});