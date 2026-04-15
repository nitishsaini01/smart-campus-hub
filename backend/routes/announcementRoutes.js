const express = require("express");
const router = express.Router();

const announcementController = require("../controllers/announcementController");

// get announcements
router.get("/", announcementController.getAnnouncements);

// add announcement
router.post("/", announcementController.addAnnouncement);

module.exports = router;