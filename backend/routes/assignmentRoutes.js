const express = require("express");
const router = express.Router();
const assignmentController = require("../controllers/assignmentController");
const multer = require("multer");

const storage = multer.diskStorage({
destination:"uploads/assignments",
filename:(req,file,cb)=>{
cb(null,Date.now()+"-"+file.originalname);
}
});

const upload = multer({storage});

router.post("/create", upload.single("file"), assignmentController.createAssignment);

router.get("/all", assignmentController.getAssignments);

router.post("/submit", upload.single("file"), assignmentController.submitAssignment);

router.delete("/delete/:id", assignmentController.deleteAssignment);

router.get("/submissions/:id", assignmentController.getSubmissions);

module.exports = router;