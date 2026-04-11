// controllers/resourceController.js
const pool = require("../config/db");

exports.getResources = async (req, res) => {
    const [rows] = await pool.query(
        "SELECT resources.*, users.name FROM resources JOIN users ON resources.uploaded_by = users.id"
    );
    res.json(rows);
};

exports.addResource = async (req, res) => {
    const { title, description, file_url, uploaded_by } = req.body;
    await pool.query(
        "INSERT INTO resources (title, description, file_url, uploaded_by) VALUES (?,?,?,?)",
        [title, description, file_url, uploaded_by]
    );
    res.json({ success: true });
};

exports.uploadResource = async (req, res) => {
    try {
        console.log("BODY:", req.body);
        console.log("FILE:", req.file);

        if (!req.file) return res.status(400).json({ message: "No file uploaded" });

        const { title, description } = req.body;
        const fileUrl = "/uploads/" + req.file.filename;

        await pool.query(
            "INSERT INTO resources (title, description, file_url, uploaded_by) VALUES (?,?,?,1)",
            [title, description, fileUrl]
        );

        res.json({ message: "Resource uploaded successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Upload error" });
    }
};