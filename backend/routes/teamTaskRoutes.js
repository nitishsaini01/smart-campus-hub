const express = require("express");
const router = express.Router();
const pool = require("../config/db");

/* CREATE TASK */

router.post("/create", async (req,res)=>{

try{

const { teamId, text } = req.body;

await pool.query(
"INSERT INTO team_tasks (team_id,title) VALUES (?,?)",
[teamId,text]
);

res.json({message:"Task created"});

}catch(err){
console.log(err);
res.status(500).json({error:"Database error"});
}

});


/* GET TASKS */

router.get("/:teamId", async (req,res)=>{

try{

const { teamId } = req.params;

const [tasks] = await pool.query(
"SELECT * FROM team_tasks WHERE team_id=?",
[teamId]
);

res.json(tasks);

}catch(err){
console.log(err);
res.status(500).json({error:"Database error"});
}

});

module.exports = router;