const express = require("express");
const router = express.Router();
const submissionController = require("../controllers/submissionController");

router.post("/submit", submissionController.submitAssignment);

router.get("/all", submissionController.getSubmissions);

router.delete("/:id", submissionController.deleteSubmission);

module.exports = router;