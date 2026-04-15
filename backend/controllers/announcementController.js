const pool = require("../config/db");

// get all announcements
exports.getAnnouncements = async (req,res)=>{

try{

const [rows] = await pool.query(
"SELECT * FROM announcements ORDER BY created_at DESC"
);

res.json(rows);

}catch(err){
console.error(err);
res.status(500).json({error:"Failed"});
}

};


// add announcement
exports.addAnnouncement = async (req,res)=>{

const {message} = req.body;

try{

await pool.query(
"INSERT INTO announcements (message) VALUES (?)",
[message]
);

res.json({success:true});

}catch(err){
console.error(err);
res.status(500).json({error:"Insert failed"});
}

};