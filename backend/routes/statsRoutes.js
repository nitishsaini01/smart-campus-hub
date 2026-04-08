const express = require("express");
const router = express.Router();
const db = require("../config/db"); // your MySQL connection

// API endpoint to get counts for dashboard
router.get("/counts", (req, res) => {
    const counts = {};

    // Count resources
    db.query("SELECT COUNT(*) AS count FROM resources", (err, result) => {
        if(err) return res.status(500).json({ message: "DB error (resources)" });
        counts.resources = result[0].count;

        // Count projects
        db.query("SELECT COUNT(*) AS count FROM projects", (err, result) => {
            if(err) return res.status(500).json({ message: "DB error (projects)" });
            counts.projects = result[0].count;

            // Count messages
            db.query("SELECT COUNT(*) AS count FROM messages", (err, result) => {
                if(err) return res.status(500).json({ message: "DB error (messages)" });
                counts.messages = result[0].count;

                // Send all counts as JSON
                res.json(counts);
            });
        });
    });
});

module.exports = router;