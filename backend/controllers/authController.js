const pool = require("../config/db");

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
name:user.name
});

}else{

res.json({
success:false,
message:"Invalid credentials"
});

}

};