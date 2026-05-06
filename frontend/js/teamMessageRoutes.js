const express = require("express");
const router = express.Router();
const pool = require("../config/db");

/* GET TEAM MESSAGES */

router.get("/:teamId", async (req,res)=>{

try{

const { teamId } = req.params;

const [messages] = await pool.query(`
SELECT tm.id, tm.message, u.name AS sender
FROM team_messages tm
JOIN users u ON tm.user_id = u.id
WHERE tm.team_id = ?
ORDER BY tm.created_at ASC
`,[teamId]);

res.json(messages);

}catch(err){
console.log(err);
res.status(500).json({error:"Database error"});
}

});

/* DELETE MESSAGE */

router.delete("/:id", async (req,res)=>{

try{

const { id } = req.params;

await pool.query(
"DELETE FROM team_messages WHERE id=?",
[id]
);

res.json({message:"Message deleted"});

}catch(err){
console.log(err);
res.status(500).json({error:"Database error"});
}

});

module.exports = router;