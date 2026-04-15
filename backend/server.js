const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const resourceRoutes = require("./routes/resourceRoutes");
const studentRoutes = require("./routes/studentRoutes");
const departmentRoutes = require("./routes/departmentRoutes");
const announcementRoutes = require("./routes/announcementRoutes");
const commentRoutes = require("./routes/commentRoutes");

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

/* ---------- API ROUTES ---------- */

app.use("/api", authRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/comments", commentRoutes);

/* ---------- DEFAULT PAGE ---------- */

app.get("/", (req, res) => {
res.sendFile(path.join(__dirname, "../frontend/login.html"));
});

/* ---------- SERVER ---------- */

const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

io.on("connection", (socket) => {
    console.log("🟢 User connected");

    socket.on("chat message", (msg) => {
        io.emit("chat message", msg);
    });

    socket.on("disconnect", () => {
        console.log("🔴 User disconnected");
    });
});

const PORT = 3000;

server.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});