const express = require("express");
const router = express.Router();
const multer = require("multer");

const resourceController = require("../controllers/resourceController");

console.log("Resource routes loaded");

/* FILE STORAGE */

const storage = multer.diskStorage({
destination: function (req, file, cb) {
cb(null, "uploads/");
},
filename: function (req, file, cb) {
cb(null, Date.now() + "-" + file.originalname);
}
});

const upload = multer({ storage: storage });

/* GET RESOURCES */

router.get("/",
resourceController.getResources
);

/* UPLOAD RESOURCE */

router.post("/",
upload.single("file"),
resourceController.uploadResource
);

/* DELETE RESOURCE */

router.delete("/:id",
resourceController.deleteResource
);

module.exports = router;