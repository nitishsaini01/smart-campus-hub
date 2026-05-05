const pool = require("../config/db");

/* REGISTER */

exports.register = async (req,res)=>{

try{

const {name,email,password,department,semester} = req.body;

await pool.query(

"INSERT INTO users (name,email,password,role,department,semester) VALUES (?,?,?,?,?,?)",

[name,email,password,"student",department,semester]

);

res.json({
message:"Registration successful"
});

}catch(err){

console.log(err);

res.status(500).json({
message:"Server error"
});

}

};


/* LOGIN */

exports.login = async (req,res)=>{

const {email,password} = req.body;

const [rows] = await pool.query(
"SELECT * FROM users WHERE email=? AND password=?",
[email,password]
);

if(rows.length > 0){

const user = rows[0];

res.json({
success:true,
role:user.role,
userId:user.id,
name:user.name,
department:user.department,
semester:user.semester
});

}else{

res.json({
success:false,
message:"Invalid credentials"
});

}

};