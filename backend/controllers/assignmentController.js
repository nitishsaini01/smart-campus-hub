const pool = require("../config/db");

exports.createAssignment = async (req,res)=>{

const {title,description,due_date,created_by} = req.body;
const file_url = req.file ? req.file.filename : null;

await pool.query(
"INSERT INTO assignments (title,description,file_url,due_date,created_by) VALUES (?,?,?,?,?)",
[title,description,file_url,due_date,created_by]
);

res.json({message:"Assignment created"});
};


exports.getAssignments = async (req,res)=>{

const [rows] = await pool.query(
"SELECT assignments.*, users.name FROM assignments JOIN users ON assignments.created_by = users.id"
);

res.json(rows);
};


exports.submitAssignment = async (req,res)=>{

const {assignment_id,student_id} = req.body;
const file_url = req.file ? req.file.filename : null;

await pool.query(
"INSERT INTO submissions (assignment_id,student_id,file_url) VALUES (?,?,?)",
[assignment_id,student_id,file_url]
);

res.json({message:"Assignment submitted"});
};

exports.deleteAssignment = async (req,res)=>{

const id = req.params.id;

await pool.query("DELETE FROM assignments WHERE id=?", [id]);

res.json({message:"Assignment deleted"});

};


exports.getSubmissions = async (req,res)=>{

const assignmentId = req.params.id;

const [rows] = await pool.query(

"SELECT submissions.*, users.name FROM submissions JOIN users ON submissions.student_id = users.id WHERE submissions.assignment_id = ?",

[assignmentId]

);

res.json(rows);

};