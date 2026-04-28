const pool = require("../config/db");

/* CREATE NOTIFICATION */

exports.createNotification = async (message) => {

try{

await pool.query(
"INSERT INTO notifications (message) VALUES (?)",
[message]
);

}catch(err){

console.log("Notification error:",err);

}

};


/* GET NOTIFICATIONS */

exports.getNotifications = async (req,res) => {

try{

const [rows] = await pool.query(
"SELECT * FROM notifications ORDER BY created_at DESC"
);

res.json(rows);

}catch(err){

console.log(err);
res.status(500).json({message:"Notification error"});

}

};