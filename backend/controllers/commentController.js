const pool = require("../config/db");

// get comments for resource
exports.getComments = async (req,res)=>{

const {resourceId} = req.params;

try{

const [rows] = await pool.query(
"SELECT * FROM comments WHERE resource_id=? ORDER BY created_at DESC",
[resourceId]
);

res.json(rows);

}catch(err){
console.error(err);
res.status(500).json({error:"Failed"});
}

};


// add comment
exports.addComment = async (req,res)=>{

const {resource_id,user_name,comment} = req.body;

try{

await pool.query(
"INSERT INTO comments (resource_id,user_name,comment) VALUES (?,?,?)",
[resource_id,user_name,comment]
);

res.json({success:true});

}catch(err){
console.error(err);
res.status(500).json({error:"Insert failed"});
}

};