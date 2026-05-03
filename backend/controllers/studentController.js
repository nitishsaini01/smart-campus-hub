const pool = require("../config/db");

/* =====================
GET ALL STUDENTS
===================== */

exports.getStudents = async (req,res)=>{

const [rows] = await pool.query(
"SELECT id,name,email,role,profile_pic FROM users"
);

res.json(rows);

};


/* =====================
GET USER ACTIVITY
===================== */

exports.getActivity = async (req,res)=>{

const id = req.params.id;

try{

const [resources] = await pool.query(
"SELECT COUNT(*) AS count FROM resources WHERE user_id=?",
[id]
);

const [assignments] = await pool.query(
"SELECT COUNT(*) AS count FROM submissions WHERE student_id=?",
[id]
);

const [comments] = await pool.query(
"SELECT COUNT(*) AS count FROM comments WHERE user_id=?",
[id]
);

res.json({
resources: resources[0].count,
assignments: assignments[0].count,
comments: comments[0].count
});

}catch(err){

console.log(err);
res.status(500).json({error:"Server error"});

}

};


/* =====================
UPDATE PROFILE
===================== */

exports.updateProfile = async (req,res)=>{

const id = req.params.id;
const {name,email} = req.body;

try{

if(name){
await pool.query(
"UPDATE users SET name=? WHERE id=?",
[name,id]
);
}

if(email){
await pool.query(
"UPDATE users SET email=? WHERE id=?",
[email,id]
);
}

res.json({message:"Profile updated"});

}catch(err){

console.log(err);
res.status(500).json({error:"Server error"});

}

};


/* =====================
UPDATE PASSWORD
===================== */

exports.updatePassword = async (req,res)=>{

const {password} = req.body;
const id = req.params.id;

await pool.query(
"UPDATE users SET password=? WHERE id=?",
[password,id]
);

res.json({message:"Password updated"});

};


/* =====================
UPLOAD PROFILE PIC
===================== */

exports.uploadProfilePic = async (req,res)=>{

const id = req.params.id;
const file = req.file.filename;

await pool.query(
"UPDATE users SET profile_pic=? WHERE id=?",
[file,id]
);

res.json({message:"Profile picture updated"});

};