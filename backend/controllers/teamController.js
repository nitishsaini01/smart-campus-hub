exports.createTeam = async (req,res)=>{

const {name, description, department, created_by} = req.body;

const sql = `
INSERT INTO teams (name, description, department, created_by)
VALUES (?, ?, ?, ?)
`;

db.query(sql,[name,description,department,created_by],(err,result)=>{

if(err) return res.status(500).json(err);

res.json({message:"Team created successfully"});

});

};