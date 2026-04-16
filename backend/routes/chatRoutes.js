const express = require("express");
const router = express.Router();
const pool = require("../config/db");

/* GET ALL MESSAGES */

router.get("/messages", async (req,res)=>{

try{

const [rows] = await pool.query(
"SELECT * FROM chats ORDER BY id ASC"
);

res.json(rows);

}catch(err){

console.log(err);
res.status(500).json({error:"Server error"});

}

});


/* DELETE MESSAGE */

router.delete("/delete/:id", async (req,res)=>{

const id = req.params.id;
const sender = req.query.sender;

try{

const [rows] = await pool.query(
"SELECT * FROM chats WHERE id=?",
[id]
);

if(rows.length === 0){
return res.status(404).json({error:"Message not found"});
}

const message = rows[0];

if(message.sender_name !== sender){
return res.status(403).json({error:"You can delete only your own message"});
}

await pool.query(
"DELETE FROM chats WHERE id=?",
[id]
);

res.json({success:true});

}catch(err){

console.log(err);
res.status(500).json({error:"Delete failed"});

}

});

module.exports = router;