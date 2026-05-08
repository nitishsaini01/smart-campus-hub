const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const resourceRoutes = require("./routes/resourceRoutes");
const studentRoutes = require("./routes/studentRoutes");
const departmentRoutes = require("./routes/departmentRoutes");
const announcementRoutes = require("./routes/announcementRoutes");
const commentRoutes = require("./routes/commentRoutes");
const chatRoutes = require("./routes/chatRoutes");
const assignmentRoutes = require("./routes/assignmentRoutes");
const submissionRoutes = require("./routes/submissionRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const teamRoutes = require("./routes/teamRoutes");
const teamTaskRoutes = require("./routes/teamTaskRoutes");
const teamFileRoutes = require("./routes/teamFileRoutes");
const teamMessageRoutes = require("./routes/teamMessageRoutes");

const pool = require("./config/db");

const app = express();

/* =========================
MIDDLEWARE
========================= */

app.use(cors());
app.use(express.json());

/* =========================
STATIC FILES
========================= */

app.use(express.static(path.join(__dirname, "../frontend")));

app.use(
"/uploads",
express.static(path.join(__dirname, "uploads"))
);

/* =========================
MYSQL CONNECTION
========================= */

pool.getConnection()
.then(conn => {

console.log("✅ MySQL Connected");

conn.release();

})
.catch(err => {

console.error("❌ MySQL Error:", err);

});

/* =========================
API ROUTES
========================= */

app.use("/api", authRoutes);

app.use("/api/resources", resourceRoutes);

app.use("/api/students", studentRoutes);

app.use("/api/departments", departmentRoutes);

app.use("/api/announcements", announcementRoutes);

app.use("/api/comments", commentRoutes);

app.use("/api/chat", chatRoutes);

app.use("/api/assignments", assignmentRoutes);

app.use("/api/submissions", submissionRoutes);

app.use("/api/notifications", notificationRoutes);

app.use("/api/teams", teamRoutes);

app.use("/api/team-tasks", teamTaskRoutes);

app.use("/api/team-files", teamFileRoutes);

app.use("/api/team-messages", teamMessageRoutes);

/* =========================
DEFAULT PAGE
========================= */

app.get("/", (req, res) => {

res.sendFile(
path.join(__dirname, "../frontend/login.html")
);

});

/* =========================
SOCKET SERVER
========================= */

const http = require("http");

const { Server } = require("socket.io");

const server = http.createServer(app);

const io = new Server(server, {

cors:{
origin:"*"
}

});

/* =========================
SOCKET CONNECTION
========================= */

io.on("connection",(socket)=>{

console.log("🟢 User connected");

/* =========================
GLOBAL CAMPUS CHAT
========================= */

socket.on("chat message", async (data)=>{

try{

const { sender, message } = data;

const [result] = await pool.query(
`
INSERT INTO chats
(sender_name,message)
VALUES (?,?)
`,
[
sender,
message
]
);

io.emit("chat message",{
id: result.insertId,
sender,
message
});

}catch(err){

console.log(err);

}

});

/* =========================
TEAM JOIN
========================= */

socket.on("joinTeam",(teamId)=>{

socket.join("team_"+teamId);

});

/* =========================
TEAM MESSAGE
========================= */

socket.on("team message", async (data)=>{

try{

const {
teamId,
userId,
sender,
message
} = data;

/* SAVE MESSAGE */

const [result] = await pool.query(
`
INSERT INTO team_messages
(team_id,user_id,message)
VALUES (?,?,?)
`,
[
teamId,
userId,
message
]
);

/* SEND MESSAGE */

io.to("team_"+teamId).emit("team message",{

id: result.insertId,

teamId,

userId,

sender: sender || "Unknown User",

message

});
}catch(err){

console.log(err);

}

});

/* =========================
DISCONNECT
========================= */

socket.on("disconnect",()=>{

console.log("🔴 User disconnected");

});

});

/* =========================
SERVER START
========================= */

const PORT = 3000;

server.listen(PORT,()=>{

console.log(
`🚀 Server running at http://localhost:${PORT}`
);

});