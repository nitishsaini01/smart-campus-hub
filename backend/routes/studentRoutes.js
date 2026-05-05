const express = require("express");
const router = express.Router();
const pool = require("../config/db");

const multer = require("multer");
const studentController = require("../controllers/studentController");


/* =====================
MULTER CONFIG (PROFILE IMAGE)
===================== */

const storage = multer.diskStorage({
destination: (req,file,cb)=>{
cb(null,"uploads/profiles");
},
filename:(req,file,cb)=>{
cb(null, Date.now()+"-"+file.originalname);
}
});

const upload = multer({storage});


/* =====================
GET ALL USERS
===================== */

router.get("/", async (req,res)=>{
try{

const [rows] = await pool.query(
"SELECT id,name,email,role,profile_pic,department,semester FROM users"
);

res.json(rows);

}catch(err){
res.status(500).json({error:err.message});
}
});


/* =====================
GET SINGLE USER PROFILE
===================== */

router.get("/profile/:id", async (req,res)=>{
try{

const [rows] = await pool.query(
"SELECT id,name,email,role,profile_pic,department,semester FROM users WHERE id=?",
[req.params.id]
);

if(rows.length === 0){
return res.status(404).json({message:"User not found"});
}

res.json(rows[0]);

}catch(err){
res.status(500).json({error:err.message});
}
});


/* =====================
GET USER ACTIVITY
===================== */

router.get("/activity/:id", async (req,res)=>{

try{

const id = req.params.id;

/* COUNT RESOURCES */

const [resources] = await pool.query(
"SELECT COUNT(*) AS count FROM resources WHERE uploaded_by=?",
[id]
);

/* COUNT ASSIGNMENTS */

const [assignments] = await pool.query(
"SELECT COUNT(*) AS count FROM submissions WHERE student_id=?",
[id]
);

/* GET USER NAME FOR COMMENTS */

const [user] = await pool.query(
"SELECT name FROM users WHERE id=?",
[id]
);

let commentCount = 0;

if(user.length > 0){

const [comments] = await pool.query(
"SELECT COUNT(*) AS count FROM comments WHERE user_name=?",
[user[0].name]
);

commentCount = comments[0].count;

}

res.json({
resources: resources[0]?.count || 0,
assignments: assignments[0]?.count || 0,
comments: commentCount
});

}catch(err){

res.status(500).json({error:err.message});

}

});


/* =====================
ADD STUDENT
===================== */

router.post("/", async (req,res)=>{

try{

const {name,email,password} = req.body;

await pool.query(
"INSERT INTO users (name,email,password,role) VALUES (?,?,?,'student')",
[name,email,password]
);

res.json({message:"Student added"});

}catch(err){

res.status(500).json({error:err.message});

}

});


/* =====================
UPDATE PROFILE
===================== */

router.put("/:id", async (req,res)=>{

try{

const {name,email} = req.body;

if(name && email){

await pool.query(
"UPDATE users SET name=?, email=? WHERE id=?",
[name,email,req.params.id]
);

}

else if(name){

await pool.query(
"UPDATE users SET name=? WHERE id=?",
[name,req.params.id]
);

}

else if(email){

await pool.query(
"UPDATE users SET email=? WHERE id=?",
[email,req.params.id]
);

}

res.json({message:"Profile updated"});

}catch(err){

res.status(500).json({error:err.message});

}

});


/* =====================
UPDATE PASSWORD
===================== */

router.put("/password/:id", async (req,res)=>{

try{

const {password} = req.body;

await pool.query(
"UPDATE users SET password=? WHERE id=?",
[password,req.params.id]
);

res.json({message:"Password updated"});

}catch(err){

res.status(500).json({error:err.message});

}

});


/* =====================
UPLOAD PROFILE PICTURE
===================== */

router.post(
"/profile-pic/:id",
upload.single("image"),
studentController.uploadProfilePic
);


/* =====================
DELETE STUDENT
===================== */

router.delete("/:id", async (req,res)=>{

try{

await pool.query(
"DELETE FROM users WHERE id=? AND role='student'",
[req.params.id]
);

res.json({message:"Student deleted"});

}catch(err){

res.status(500).json({error:err.message});

}

});

/* =====================
DELETE ACCOUNT
===================== */

router.delete("/delete/:id", async (req, res) => {

try{

const { id } = req.params;

/* delete student */

await pool.query(
"DELETE FROM users WHERE id = ?",
[id]
);

res.json({
message: "Account deleted successfully"
});

}catch(err){

console.error(err);
res.status(500).json({error:"Server error"});

}

});

module.exports = router;