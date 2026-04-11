const express = require("express");
const router = express.Router();
const pool = require("../config/db");


// =====================
// GET ALL STUDENTS
// =====================
router.get("/", async (req, res) => {
    try {
        const [rows] = await pool.query(
            "SELECT id, name, email FROM users WHERE role='student'"
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// =====================
// ADD STUDENT
// =====================
router.post("/", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        await pool.query(
            "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'student')",
            [name, email, password]
        );

        res.json({ message: "Student added" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// =====================
// UPDATE STUDENT
// =====================
router.put("/:id", async (req, res) => {
    try {
        const { name, email } = req.body;

        await pool.query(
            "UPDATE users SET name=?, email=? WHERE id=? AND role='student'",
            [name, email, req.params.id]
        );

        res.json({ message: "Student updated" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// =====================
// DELETE STUDENT
// =====================
router.delete("/:id", async (req, res) => {
    try {
        await pool.query(
            "DELETE FROM users WHERE id=? AND role='student'",
            [req.params.id]
        );

        res.json({ message: "Student deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;