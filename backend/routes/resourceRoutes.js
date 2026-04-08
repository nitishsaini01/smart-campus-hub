const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/resources", (req, res) => {
    db.query("SELECT * FROM resources", (err, results) => {
        if(err) return res.status(500).json({ message: "DB error" });
        res.json(results);
    });
});

module.exports = router;