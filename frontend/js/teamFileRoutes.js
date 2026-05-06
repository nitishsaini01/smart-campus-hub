const express = require("express");
const router = express.Router();
const multer = require("multer");

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

router.post("/upload", upload.single("file"), (req,res)=>{

res.json({
message:"File uploaded",
file:req.file.filename
});

});

module.exports = router;