const express = require("express");
const router = express.Router();
const pool = require("../config/db");

/* ===============================
CREATE TEAM
================================ */

router.post("/create", async (req,res)=>{

try{

const { name, description, created_by } = req.body;

await pool.query(
"INSERT INTO teams (name,description,created_by) VALUES (?,?,?)",
[name,description,created_by]
);

res.json({ message:"Team created successfully" });

}catch(err){
console.log(err);
res.status(500).json({ error:"Database error" });
}

});

/* ===============================
GET ALL TEAMS
================================ */

router.get("/", async (req,res)=>{

try{

const [teams] = await pool.query("SELECT * FROM teams");

res.json(teams);

}catch(err){
console.log(err);
res.status(500).json({ error:"Database error" });
}

});

/* ===============================
ADD MEMBER
================================ */

router.post("/add-member", async (req,res)=>{

try{

const { teamId, userId } = req.body;

await pool.query(
"INSERT INTO team_members (team_id,user_id) VALUES (?,?)",
[teamId,userId]
);

res.json({message:"Member added"});

}catch(err){
console.log(err);
res.status(500).json({error:"Database error"});
}

});


/* ===============================
GET TEAM MEMBERS
================================ */

router.get("/members/:teamId", async (req,res)=>{

try{

const {teamId} = req.params;

const [members] = await pool.query(`
SELECT users.id, users.name, users.email
FROM team_members
JOIN users ON users.id = team_members.user_id
WHERE team_members.team_id = ?
`,[teamId]);

res.json(members);

}catch(err){
console.log(err);
res.status(500).json({error:"Database error"});
}

});

module.exports = router;