const socket = io("http://localhost:3000");

const teamId = localStorage.getItem("currentTeam");
const currentUserId = localStorage.getItem("userId");
const currentUsername = localStorage.getItem("username") || "Unknown User";

let isAdmin = false;

/* =========================
CHECK LOGIN
========================= */

if(!currentUserId){

alert("Please login first");
window.location.href="/login.html";

}

/* =========================
JOIN TEAM
========================= */

socket.emit("joinTeam",teamId);

/* =========================
TAB SWITCHING
========================= */

function openTab(tab){

document.querySelectorAll(".tab-content").forEach(t=>{
t.style.display="none";
});

document.getElementById(tab).style.display="block";

}

/* =========================
CHECK ADMIN
========================= */

async function checkAdmin(){

const res = await fetch(`http://localhost:3000/api/teams/team-info/${teamId}`)

const team = await res.json();

isAdmin = String(team.created_by) === String(currentUserId);

/* SHOW / HIDE ADMIN UI */

const memberInput = document.getElementById("memberId");
const addBtn = document.getElementById("addMemberBtn");
const taskCreator = document.getElementById("taskCreator");

if(memberInput) memberInput.style.display = isAdmin ? "block":"none";
if(addBtn) addBtn.style.display = isAdmin ? "inline-block":"none";
if(taskCreator) taskCreator.style.display = isAdmin ? "block":"none";

}

checkAdmin();

/* =========================
CHAT
========================= */

function sendMessage(){

const input=document.getElementById("messageInput");
const message=input.value.trim();

if(message==="") return;

socket.emit("team message",{

teamId,
userId:currentUserId,
sender:currentUsername,
message

});

input.value="";

}

socket.on("team message",(data)=>{

const box=document.getElementById("messages");

box.innerHTML+=`

<div class="message">

<b>${data.sender}</b>

<p>${data.message}</p>

${
String(data.userId)===String(currentUserId)

?

`<button onclick="deleteMessage(${data.id})">🗑</button>`

:

""
}

</div>

`;

box.scrollTop=box.scrollHeight;

});

async function loadMessages(){

const res=await fetch(
`http://localhost:3000/api/team-messages/${teamId}`
);

const messages=await res.json();

const box=document.getElementById("messages");

box.innerHTML="";

messages.forEach(m=>{

box.innerHTML+=`

<div class="message">

<b>${m.sender}</b>

<p>${m.message}</p>

${
String(m.user_id)===String(currentUserId)

?

`<button onclick="deleteMessage(${m.id})">🗑</button>`

:

""
}

</div>

`;

});

box.scrollTop=box.scrollHeight;

}

loadMessages();

async function deleteMessage(id){

const confirmDelete=confirm("Delete this message?");
if(!confirmDelete) return;

await fetch(
`http://localhost:3000/api/team-messages/${id}?userId=${currentUserId}`,
{method:"DELETE"}
);

loadMessages();

}

/* =========================
FILES
========================= */

async function uploadFile(){

const file=document.getElementById("fileUpload").files[0];

if(!file){
alert("Select file");
return;
}

const formData=new FormData();

formData.append("file",file);
formData.append("teamId",teamId);

await fetch(
"http://localhost:3000/api/team-files/upload",
{
method:"POST",
body:formData
});

alert("File uploaded");

loadFiles();

}

async function loadFiles(){

const res=await fetch(
`http://localhost:3000/api/team-files/${teamId}`
);

const files=await res.json();

const container=document.getElementById("fileList");

container.innerHTML="";

files.forEach(file=>{

container.innerHTML+=`

<div class="task-card">

<h4>${file.file_name}</h4>

<a href="http://localhost:3000${file.file_path}" target="_blank">
Download
</a>

<br><br>

<button onclick="deleteFile(${file.id})">
🗑 Delete
</button>

</div>

`;

});

}

loadFiles();

async function deleteFile(id){

if(!confirm("Delete file?")) return;

await fetch(
"http://localhost:3000/api/team-files/"+id,
{method:"DELETE"}
);

loadFiles();

}

/* =========================
TASKS
========================= */

async function createTask(){

if(!isAdmin){
alert("Only admin can create tasks");
return;
}

const title=document.getElementById("taskTitle").value;
const description=document.getElementById("taskDescription").value;

const assignedUsers = Array.from(
document.getElementById("assignMembers").selectedOptions
).map(o => o.value);

await fetch(
"http://localhost:3000/api/team-tasks/create",
{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
teamId: teamId,
title: title,
description: description,
assignedUsers: assignedUsers,
adminId: currentUserId
})
});

document.getElementById("taskTitle").value="";
document.getElementById("taskDescription").value="";

loadTasks();

}

async function loadTasks(){

const res=await fetch(
`http://localhost:3000/api/team-tasks/${teamId}`
);

const tasks=await res.json();

const container=document.getElementById("taskList");

container.innerHTML="";

tasks.forEach(t=>{

container.innerHTML+=`

<div class="task-card">

<h4>${t.title}</h4>

<p>${t.description}</p>

<p><b>Status:</b> ${t.status}</p>

<p><b>Assigned:</b> ${t.assigned_members || "None"}</p>

${
isAdmin

?

`<button onclick="deleteTask(${t.id})">🗑 Delete</button>`

:

""
}

</div>

`;

});

}

loadTasks();

async function deleteTask(id){

if(!isAdmin){
alert("Only admin can delete tasks");
return;
}

if(!confirm("Delete task?")) return;

await fetch(
"http://localhost:3000/api/team-tasks/"+id,
{method:"DELETE"}
);

loadTasks();

}

/* =========================
MEMBERS
========================= */

async function loadMembers(){

const res=await fetch(
`http://localhost:3000/api/teams/members/${teamId}`
);

const members=await res.json();

const container=document.getElementById("memberList");

container.innerHTML="";

members.forEach(m=>{

container.innerHTML+=`

<div class="member-card">

<h4>
${m.name}
${m.is_admin==1?"(Admin)":""}
</h4>

<p>${m.email}</p>

${
isAdmin && String(m.id)!==String(currentUserId)

?

`<button onclick="removeMember(${m.id})">❌ Remove</button>`

:

""
}

</div>

`;

});

}

loadMembers();

/* =========================
ADD MEMBER
========================= */

async function addMember(){

if(!isAdmin){
alert("Only admin can add members");
return;
}

const userId=document.getElementById("memberId").value;

if(userId===""){
alert("Enter student ID");
return;
}

const res=await fetch(
"http://localhost:3000/api/teams/add-member",
{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
teamId,
userId,
adminId:currentUserId
})
});

const data=await res.json();

alert(data.message);

document.getElementById("memberId").value="";

loadMembers();
loadAssignMembers();

}

/* =========================
REMOVE MEMBER
========================= */

async function removeMember(userId){

if(!isAdmin){
alert("Only admin can remove members");
return;
}

if(!confirm("Remove member?")) return;

const res=await fetch(
"http://localhost:3000/api/teams/remove-member",
{
method:"DELETE",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
teamId,
userId,
adminId:currentUserId
})
});

const data=await res.json();

alert(data.message);

loadMembers();
loadAssignMembers();

}

/* =========================
ASSIGN MEMBERS DROPDOWN
========================= */

async function loadAssignMembers(){

const res=await fetch(
`http://localhost:3000/api/teams/members/${teamId}`
);

const members=await res.json();

const select=document.getElementById("assignMembers");

if(!select) return;

select.innerHTML="";

members.forEach(m=>{

select.innerHTML+=`
<option value="${m.id}">
${m.name}
</option>
`;

});

}

loadAssignMembers();

/* =========================
LOGOUT
========================= */

function logout(){

localStorage.clear();
window.location.href="/login.html";

}