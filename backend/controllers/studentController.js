const pool = require("../config/db");

exports.updateName = async (req,res)=>{

const {name} = req.body;
const id = req.params.id;

await pool.query(
"UPDATE users SET name=? WHERE id=?",
[name,id]
);

res.json({message:"Name updated"});

};


exports.updatePassword = async (req,res)=>{

const {password} = req.body;
const id = req.params.id;

await pool.query(
"UPDATE users SET password=? WHERE id=?",
[password,id]
);

res.json({message:"Password updated"});

};


exports.uploadProfilePic = async (req,res)=>{

const id = req.params.id;
const file = req.file.filename;

await pool.query(
"UPDATE users SET profile_pic=? WHERE id=?",
[file,id]
);

res.json({message:"Profile picture updated"});

};