const express = require("express");
const router = express.Router();

console.log("Resource routes loaded");

const pool = require("../config/db"); // ✅ database connection
const resourceController = require("../controllers/resourceController");
const upload = require("../controllers/uploadController");

// Get all resources
router.get("/", resourceController.getResources);

// Add resource
router.post("/", resourceController.addResource);

// Upload resource with file
router.post("/upload", upload.single("file"), resourceController.uploadResource);

// Delete resource
router.delete("/:id", async (req,res)=>{

const { id } = req.params;

try{

await pool.query(
"DELETE FROM resources WHERE id=?",
[id]
);

res.json({message:"Resource deleted"});

}catch(err){
console.error(err);
res.status(500).json({error:"Delete failed"});
}

});

module.exports = router;