const express = require("express");
const router = express.Router();
const pool = require("../config/db");

/* ===============================
CREATE TEAM
================================ */

router.post("/create", async (req,res)=>{

try{

const { name, description, created_by } = req.body;

/* CREATE TEAM */

const [result] = await pool.query(
`
INSERT INTO teams
(name,description,created_by)
VALUES (?,?,?)
`,
[name,description,created_by]
);

const teamId = result.insertId;

/* AUTO ADD CREATOR AS MEMBER */

await pool.query(
`
INSERT INTO team_members
(team_id,user_id,is_admin)
VALUES (?,?,?)
`,
[
teamId,
created_by,
1
]
);

res.json({
message:"Team created successfully"
});

}catch(err){

console.log(err);

res.status(500).json({
error:"Database error"
});

}

});

/* ===============================
GET ONLY USER TEAMS
================================ */

router.get("/:userId", async (req,res)=>{

try{

const { userId } = req.params;

const [teams] = await pool.query(
`
SELECT teams.*

FROM teams

JOIN team_members
ON teams.id = team_members.team_id

WHERE team_members.user_id=?
`,
[userId]
);

res.json(teams);

}catch(err){

console.log(err);

res.status(500).json({
error:"Database error"
});

}

});

/* ===============================
CHECK TEAM ACCESS
================================ */

router.get("/check-access/:teamId/:userId", async (req,res)=>{

try{

const { teamId, userId } = req.params;

const [member] = await pool.query(
`
SELECT *
FROM team_members
WHERE team_id=? AND user_id=?
`,
[teamId,userId]
);

if(member.length === 0){

return res.status(403).json({
message:"Access denied"
});

}

res.json({
message:"Access granted"
});

}catch(err){

console.log(err);

res.status(500).json({
error:"Database error"
});

}

});

/* ===============================
ADD MEMBER (ADMIN ONLY)
================================ */

router.post("/add-member", async (req,res)=>{

try{

const {
teamId,
userId,
adminId
} = req.body;

/* CHECK ADMIN */

const [admin] = await pool.query(
`
SELECT *
FROM team_members
WHERE team_id=? 
AND user_id=?
AND is_admin=1
`,
[
teamId,
adminId
]
);

if(admin.length === 0){

return res.status(403).json({
message:"Only admin can add members"
});

}

/* ADD MEMBER */

await pool.query(
`
INSERT INTO team_members
(team_id,user_id,is_admin)
VALUES (?,?,?)
`,
[
teamId,
userId,
0
]
);

res.json({
message:"Member added"
});

}catch(err){

console.log(err);

res.status(500).json({
error:"Database error"
});

}

});

/* ===============================
REMOVE MEMBER (ADMIN ONLY)
================================ */

router.delete("/remove-member", async (req,res)=>{

try{

const {
teamId,
userId,
adminId
} = req.body;

/* CHECK ADMIN */

const [admin] = await pool.query(
`
SELECT *
FROM team_members
WHERE team_id=?
AND user_id=?
AND is_admin=1
`,
[
teamId,
adminId
]
);

if(admin.length === 0){

return res.status(403).json({
message:"Only admin can remove members"
});

}

/* REMOVE */

await pool.query(
`
DELETE FROM team_members
WHERE team_id=? AND user_id=?
`,
[
teamId,
userId
]
);

res.json({
message:"Member removed"
});

}catch(err){

console.log(err);

res.status(500).json({
error:"Database error"
});

}

});

/* ===============================
GET TEAM MEMBERS
================================ */

router.get("/members/:teamId", async (req,res)=>{

try{

const {teamId} = req.params;

const [members] = await pool.query(`
SELECT 
users.id,
users.name,
users.email,
team_members.is_admin

FROM team_members

JOIN users
ON users.id = team_members.user_id

WHERE team_members.team_id = ?
`,[teamId]);

res.json(members);

}catch(err){

console.log(err);

res.status(500).json({
error:"Database error"
});

}

});

/* ===============================
DELETE TEAM OR LEAVE TEAM
================================ */

router.delete("/:teamId/:userId", async (req,res)=>{

try{

const { teamId, userId } = req.params;

/* CHECK IF USER IS ADMIN */

const [admin] = await pool.query(
`
SELECT *
FROM team_members
WHERE team_id=? AND user_id=? AND is_admin=1
`,
[teamId,userId]
);

/* =========================
IF ADMIN → DELETE TEAM
========================= */

if(admin.length > 0){

await pool.query(
"DELETE FROM team_members WHERE team_id=?",
[teamId]
);

await pool.query(
"DELETE FROM task_assignments WHERE task_id IN (SELECT id FROM team_tasks WHERE team_id=?)",
[teamId]
);

await pool.query(
"DELETE FROM team_tasks WHERE team_id=?",
[teamId]
);

await pool.query(
"DELETE FROM team_messages WHERE team_id=?",
[teamId]
);

await pool.query(
"DELETE FROM team_files WHERE team_id=?",
[teamId]
);

await pool.query(
"DELETE FROM teams WHERE id=?",
[teamId]
);

return res.json({
message:"Team deleted for everyone"
});

}

/* =========================
IF MEMBER → LEAVE TEAM
========================= */

await pool.query(
`
DELETE FROM team_members
WHERE team_id=? AND user_id=?
`,
[teamId,userId]
);

res.json({
message:"You left the team"
});

}catch(err){

console.log(err);

res.status(500).json({
error:"Database error"
});

}

});

/* ===============================
GET SINGLE TEAM (FOR ADMIN CHECK)
================================ */

router.get("/team-info/:teamId", async (req,res)=>{

try{

const { teamId } = req.params;

const [team] = await pool.query(
`
SELECT id, created_by
FROM teams
WHERE id=?
`,
[teamId]
);

if(team.length === 0){
return res.status(404).json({message:"Team not found"});
}

res.json(team[0]);

}catch(err){

console.log(err);

res.status(500).json({error:"Database error"});

}

});

module.exports = router;