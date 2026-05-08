const express = require("express");
const router = express.Router();
const pool = require("../config/db");

/* =========================
CREATE TASK (ADMIN ONLY)
========================= */

router.post("/create", async (req,res)=>{

try{

const {
teamId,
title,
description,
assignedUsers,
adminId
} = req.body;

/* CHECK ADMIN */

const [admin] = await pool.query(
`
SELECT *
FROM team_members
WHERE team_id=? AND user_id=? AND is_admin=1
`,
[
teamId,
adminId
]
);

if(admin.length === 0){

return res.status(403).json({
message:"Only admin can create tasks"
});

}

/* INSERT TASK */

const [result] = await pool.query(
`
INSERT INTO team_tasks
(team_id,title,description,status)
VALUES (?,?,?,?)
`,
[
teamId,
title,
description,
"todo"
]
);

const taskId = result.insertId;

/* INSERT ASSIGNED USERS */

if(assignedUsers && assignedUsers.length > 0){

for(const userId of assignedUsers){

await pool.query(
`
INSERT INTO task_assignments
(task_id,user_id)
VALUES (?,?)
`,
[
taskId,
userId
]
);

}

}

res.json({
message:"Task created successfully"
});

}catch(err){

console.log(err);

res.status(500).json({
error:"Database error"
});

}

});


/* =========================
GET TASKS
========================= */

router.get("/:teamId", async (req,res)=>{

try{

const { teamId } = req.params;

const [tasks] = await pool.query(
`
SELECT
team_tasks.*,

GROUP_CONCAT(users.name SEPARATOR ', ')
AS assigned_members

FROM team_tasks

LEFT JOIN task_assignments
ON team_tasks.id = task_assignments.task_id

LEFT JOIN users
ON users.id = task_assignments.user_id

WHERE team_tasks.team_id=?

GROUP BY team_tasks.id

ORDER BY team_tasks.id DESC
`,
[teamId]
);

res.json(tasks);

}catch(err){

console.log(err);

res.status(500).json({
error:"Database error"
});

}

});


/* =========================
UPDATE TASK STATUS
========================= */

router.put("/status/:id", async (req,res)=>{

try{

const { id } = req.params;

const { status } = req.body;

await pool.query(
`
UPDATE team_tasks
SET status=?
WHERE id=?
`,
[status,id]
);

res.json({
message:"Task status updated"
});

}catch(err){

console.log(err);

res.status(500).json({
error:"Database error"
});

}

});


/* =========================
DELETE TASK (ADMIN ONLY)
========================= */

router.delete("/:id", async (req,res)=>{

try{

const { id } = req.params;

const { adminId } = req.body;

/* FIND TEAM OF TASK */

const [task] = await pool.query(
`
SELECT team_id
FROM team_tasks
WHERE id=?
`,
[id]
);

if(task.length === 0){

return res.status(404).json({
message:"Task not found"
});

}

const teamId = task[0].team_id;

/* CHECK ADMIN */

const [admin] = await pool.query(
`
SELECT *
FROM team_members
WHERE team_id=? AND user_id=? AND is_admin=1
`,
[
teamId,
adminId
]
);

if(admin.length === 0){

return res.status(403).json({
message:"Only admin can delete tasks"
});

}

/* DELETE TASK */

await pool.query(
"DELETE FROM task_assignments WHERE task_id=?",
[id]
);

await pool.query(
"DELETE FROM team_tasks WHERE id=?",
[id]
);

res.json({
message:"Task deleted"
});

}catch(err){

console.log(err);

res.status(500).json({
error:"Database error"
});

}

});

module.exports = router;