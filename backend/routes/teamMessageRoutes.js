const express = require("express");
const router = express.Router();
const pool = require("../config/db");

/* GET TEAM MESSAGES */

router.get("/:teamId", async (req,res)=>{

try{

const {teamId} = req.params;

const [messages] = await pool.query(`
SELECT team_messages.id,
users.name AS sender,
team_messages.message
FROM team_messages
JOIN users ON team_messages.user_id = users.id
WHERE team_messages.team_id=?
ORDER BY team_messages.created_at ASC
`,[teamId]);

res.json(messages);

}catch(err){
console.log(err);
res.status(500).json({error:"Database error"});
}

});

module.exports = router;