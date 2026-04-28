const notificationController = require("./notificationController");
const pool = require("../config/db");


/* ================= GET ALL RESOURCES ================= */

exports.getResources = async (req, res) => {

try{

const [rows] = await pool.query(
`SELECT resources.*, users.name, departments.name AS department
FROM resources
JOIN users ON resources.uploaded_by = users.id
JOIN departments ON resources.department_id = departments.id`
);

res.json(rows);

}catch(err){

console.log(err);
res.status(500).json({message:"Error loading resources"});

}

};



/* ================= UPLOAD RESOURCE ================= */

exports.uploadResource = async (req, res) => {

try{

if(!req.file){
return res.status(400).json({message:"No file uploaded"});
}

const {title,description,department_id} = req.body;

const uploaded_by = req.body.uploaded_by;

const fileUrl = "/uploads/" + req.file.filename;

/* SAVE RESOURCE */

await pool.query(
"INSERT INTO resources (title,description,file_url,uploaded_by,department_id) VALUES (?,?,?,?,?)",
[title,description,fileUrl,uploaded_by,department_id]
);


/* CREATE NOTIFICATION */

await notificationController.createNotification(
`${title} resource uploaded`
);


res.json({message:"Resource uploaded successfully"});

}catch(err){

console.log(err);
res.status(500).json({message:"Upload error"});

}

};



/* ================= DELETE RESOURCE ================= */

exports.deleteResource = async (req,res)=>{

try{

const id = req.params.id;

await pool.query(
"DELETE FROM resources WHERE id=?",
[id]
);

res.json({message:"Resource deleted"});

}catch(err){

console.log(err);
res.status(500).json({message:"Delete error"});

}

};