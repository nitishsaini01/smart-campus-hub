const express = require("express");
const router = express.Router();

const resourceController = require("../controllers/resourceController");
const upload = require("../controllers/uploadController"); // multer

router.get("/", resourceController.getResources);
router.post("/", resourceController.addResource);

// POST /upload with file
router.post("/upload", upload.single("file"), resourceController.uploadResource);

module.exports = router;