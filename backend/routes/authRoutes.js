const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const pool = require("../config/db");   // ✅ ADD THIS LINE

router.post("/login", authController.login);

router.post("/register", async (req,res)=>{

const {name,email,password} = req.body;

try{

await pool.query(
"INSERT INTO users (name,email,password,role) VALUES (?,?,?,'student')",
[name,email,password]
);

res.json({message:"Account created. Please login."});

}catch(err){

console.error(err);
res.status(500).json({message:"Registration failed"});

}

});

module.exports = router;