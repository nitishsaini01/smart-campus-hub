const pool = require("../config/db");

/* ================= SUBMIT ASSIGNMENT ================= */

exports.submitAssignment = async (req,res)=>{

const {assignment_id, student_id, file_url} = req.body;

await pool.query(
"INSERT INTO submissions (assignment_id, student_id, file_url) VALUES (?,?,?)",
[assignment_id, student_id, file_url]
);

res.json({message:"Assignment submitted successfully"});
};


/* ================= GET ALL SUBMISSIONS (ADMIN) ================= */

exports.getSubmissions = async (req,res)=>{

const [rows] = await pool.query(`
SELECT submissions.*, users.name, assignments.title
FROM submissions
JOIN users ON submissions.student_id = users.id
JOIN assignments ON submissions.assignment_id = assignments.id
`);

res.json(rows);
};


/* ================= GET STUDENT SUBMISSIONS ================= */

exports.getStudentSubmissions = async (req,res)=>{

const studentId = req.params.studentId;

const [rows] = await pool.query(`
SELECT *
FROM submissions
WHERE student_id = ?
`,[studentId]);

res.json(rows);

};


/* ================= DELETE SUBMISSION ================= */

exports.deleteSubmission = async (req,res)=>{

const id = req.params.id;

await pool.query(
"DELETE FROM submissions WHERE id=?",
[id]
);

res.json({message:"Submission deleted"});
};