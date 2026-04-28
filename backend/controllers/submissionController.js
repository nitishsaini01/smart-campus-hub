const pool = require("../config/db");

exports.submitAssignment = async (req,res)=>{

const {assignment_id, student_id, file_url} = req.body;

await pool.query(
"INSERT INTO submissions (assignment_id, student_id, file_url) VALUES (?,?,?)",
[assignment_id, student_id, file_url]
);

res.json({message:"Assignment submitted successfully"});
};

exports.getSubmissions = async (req,res)=>{

const [rows] = await pool.query(`
SELECT submissions.*, users.name, assignments.title
FROM submissions
JOIN users ON submissions.student_id = users.id
JOIN assignments ON submissions.assignment_id = assignments.id
`);

res.json(rows);
};

exports.deleteSubmission = async (req,res)=>{

const id = req.params.id;

await pool.query(
"DELETE FROM submissions WHERE id=?",
[id]
);

res.json({message:"Submission deleted"});
};