const pool = require("../config/db");
const notificationController = require("./notificationController");


/* ================= CREATE ASSIGNMENT ================= */

exports.createAssignment = async (req,res)=>{

try{

const {title,description,due_date,created_by} = req.body;

const file_url = req.file ? req.file.filename : null;

/* INSERT ASSIGNMENT */

await pool.query(
"INSERT INTO assignments (title,description,file_url,due_date,created_by) VALUES (?,?,?,?,?)",
[title,description,file_url,due_date,created_by]
);

/* CREATE NOTIFICATION */

await notificationController.createNotification(
`New assignment uploaded: ${title}`
);

res.json({message:"Assignment created"});

}catch(err){

console.log(err);
res.status(500).json({message:"Assignment upload error"});

}

};



/* ================= GET ALL ASSIGNMENTS ================= */

exports.getAssignments = async (req,res)=>{

try{

const [rows] = await pool.query(
"SELECT assignments.*, users.name FROM assignments JOIN users ON assignments.created_by = users.id"
);

res.json(rows);

}catch(err){

console.log(err);
res.status(500).json({message:"Error loading assignments"});

}

};



/* ================= SUBMIT ASSIGNMENT ================= */

exports.submitAssignment = async (req,res)=>{

try{

const {assignment_id,student_id} = req.body;

const file_url = req.file ? req.file.filename : null;

await pool.query(
"INSERT INTO submissions (assignment_id,student_id,file_url) VALUES (?,?,?)",
[assignment_id,student_id,file_url]
);

res.json({message:"Assignment submitted"});

}catch(err){

console.log(err);
res.status(500).json({message:"Submission error"});

}

};



/* ================= DELETE ASSIGNMENT ================= */

exports.deleteAssignment = async (req,res)=>{

try{

const id = req.params.id;

await pool.query(
"DELETE FROM assignments WHERE id=?",
[id]
);

res.json({message:"Assignment deleted"});

}catch(err){

console.log(err);
res.status(500).json({message:"Delete error"});

}

};



/* ================= GET SUBMISSIONS ================= */

exports.getSubmissions = async (req,res)=>{

try{

const assignmentId = req.params.id;

const [rows] = await pool.query(

"SELECT submissions.*, users.name FROM submissions JOIN users ON submissions.student_id = users.id WHERE submissions.assignment_id = ?",

[assignmentId]

);

res.json(rows);

}catch(err){

console.log(err);
res.status(500).json({message:"Error loading submissions"});

}

};