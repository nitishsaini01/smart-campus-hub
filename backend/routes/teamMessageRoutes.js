const express = require("express");
const router = express.Router();
const pool = require("../config/db");

/* =========================
GET TEAM MESSAGES
========================= */

router.get("/:teamId", async (req,res)=>{

try{

const {teamId} = req.params;

const [messages] = await pool.query(`
SELECT 
team_messages.id,
team_messages.message,
team_messages.user_id,
users.name AS sender

FROM team_messages

LEFT JOIN users
ON team_messages.user_id = users.id

WHERE team_messages.team_id=?

ORDER BY team_messages.id ASC
`,[teamId]);

res.json(messages);

}catch(err){

console.log(err);

res.status(500).json({
error:"Database error"
});

}

});


/* =========================
DELETE MESSAGE
========================= */

router.delete("/:id", async (req,res)=>{

try{

const { id } = req.params;

const userId = req.query.userId;

/* CHECK MESSAGE OWNER */

const [messages] = await pool.query(
`
SELECT *
FROM team_messages
WHERE id=? AND user_id=?
`,
[
id,
userId
]
);

if(messages.length === 0){

return res.status(403).json({
message:"You can delete only your own messages"
});

}

/* DELETE MESSAGE */

await pool.query(
"DELETE FROM team_messages WHERE id=?",
[id]
);

res.json({
message:"Message deleted successfully"
});

}catch(err){

console.log(err);

res.status(500).json({
error:"Database error"
});

}

});

module.exports = router;