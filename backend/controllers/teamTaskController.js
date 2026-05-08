const db = require("../config/db");

/* =========================
CREATE TASK
========================= */

exports.createTask = (req,res)=>{

const { teamId, title, description, assignedUsers } = req.body;

if(!teamId || !title){
return res.status(400).json({message:"Missing task data"});
}

const sql = `
INSERT INTO team_tasks (team_id,title,description,status)
VALUES (?,?,?,?)
`;

db.query(sql,[teamId,title,description,"Pending"],(err,result)=>{

if(err){
console.log(err);
return res.status(500).json(err);
}

const taskId = result.insertId;

/* SAVE ASSIGNED MEMBERS */

if(assignedUsers && assignedUsers.length > 0){

assignedUsers.forEach(userId=>{

const assignSql = `
INSERT INTO team_task_members (task_id,user_id)
VALUES (?,?)
`;

db.query(assignSql,[taskId,userId]);

});

}

res.json({message:"Task created successfully"});

});

};

/* =========================
GET TASKS
========================= */

exports.getTasks = (req,res)=>{

const teamId = req.params.teamId;

const sql = `
SELECT 
t.id,
t.title,
t.description,
t.status,
GROUP_CONCAT(u.name SEPARATOR ', ') AS assigned_members
FROM team_tasks t
LEFT JOIN team_task_members tm ON t.id = tm.task_id
LEFT JOIN users u ON tm.user_id = u.id
WHERE t.team_id = ?
GROUP BY t.id
ORDER BY t.id DESC
`;

db.query(sql,[teamId],(err,result)=>{

if(err) return res.status(500).json(err);

res.json(result);

});

};

/* =========================
DELETE TASK
========================= */

exports.deleteTask = (req,res)=>{

const taskId = req.params.id;

db.query(
"DELETE FROM team_task_members WHERE task_id=?",
[taskId]
);

db.query(
"DELETE FROM team_tasks WHERE id=?",
[taskId],
(err)=>{
if(err) return res.status(500).json(err);

res.json({message:"Task deleted"});
}
);

};