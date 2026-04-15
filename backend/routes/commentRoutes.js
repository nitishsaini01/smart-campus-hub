const express = require("express");
const router = express.Router();

const commentController = require("../controllers/commentController");

router.get("/:resourceId", commentController.getComments);

router.post("/", commentController.addComment);

module.exports = router;