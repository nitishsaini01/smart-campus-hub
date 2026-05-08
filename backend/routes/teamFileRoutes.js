const express = require("express");
const router = express.Router();
const multer = require("multer");
const pool = require("../config/db");

/* =========================
MULTER STORAGE
========================= */

const storage = multer.diskStorage({

destination: function(req,file,cb){

cb(null,"uploads/");

},

filename: function(req,file,cb){

cb(null, Date.now()+"_"+file.originalname);

}

});

const upload = multer({storage});

/* =========================
UPLOAD FILE
========================= */

router.post(
"/upload",
upload.single("file"),
async (req,res)=>{

try{

const { teamId } = req.body;

const fileName = req.file.filename;

const filePath = "/uploads/" + fileName;

await pool.query(
`
INSERT INTO team_files
(team_id,file_name,file_path)
VALUES (?,?,?)
`,
[
teamId,
fileName,
filePath
]
);

res.json({
message:"File uploaded successfully"
});

}catch(err){

console.log(err);

res.status(500).json({
error:"Database error"
});

}

});

/* =========================
GET TEAM FILES
========================= */

router.get("/:teamId", async (req,res)=>{

try{

const { teamId } = req.params;

const [files] = await pool.query(
`
SELECT *
FROM team_files
WHERE team_id=?
ORDER BY id DESC
`,
[teamId]
);

res.json(files);

}catch(err){

console.log(err);

res.status(500).json({
error:"Database error"
});

}

});

/* =========================
DELETE FILE
========================= */

router.delete("/:id", async (req,res)=>{

try{

const { id } = req.params;

await pool.query(
"DELETE FROM team_files WHERE id=?",
[id]
);

res.json({
message:"File deleted"
});

}catch(err){

console.log(err);

res.status(500).json({
error:"Database error"
});

}

});

module.exports = router;