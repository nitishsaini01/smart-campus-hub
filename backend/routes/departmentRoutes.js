console.log("Department routes loaded");
const express = require("express");
const router = express.Router();
const pool = require("../config/db");

/* =========================
   GET ALL DEPARTMENTS
========================= */
router.get("/", async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM departments");
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});


/* =========================
   ADD DEPARTMENT (ADMIN)
========================= */
router.post("/", async (req, res) => {
    try {
        const { name } = req.body;

        await pool.query(
            "INSERT INTO departments (name) VALUES (?)",
            [name]
        );

        res.json({ message: "Department added successfully" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});


/* =========================
   DELETE DEPARTMENT (ADMIN)
========================= */
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        await pool.query(
            "DELETE FROM departments WHERE id = ?",
            [id]
        );

        res.json({ message: "Department deleted successfully" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;