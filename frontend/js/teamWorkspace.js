const socket = io("http://localhost:3000");

const teamId = localStorage.getItem("currentTeam");

socket.emit("joinTeam", teamId);

function openTab(tab){

document.querySelectorAll(".tab-content").forEach(t=>{
t.style.display="none";
});

document.getElementById(tab).style.display="block";

}

/* =========================
CHAT
========================= */

function sendMessage(){

const input = document.getElementById("messageInput");

const message = input.value;

const sender = localStorage.getItem("username");

const userId = localStorage.getItem("userId");

socket.emit("team message",{
teamId,
userId,
sender,
message
});

input.value="";

}

socket.on("team message",(data)=>{

const box = document.getElementById("messages");

box.innerHTML += `
<div class="message">

<b>${data.sender}</b>: ${data.message}

<button onclick="deleteMessage(${data.id})">
🗑
</button>

</div>
`;

});

async function loadMessages(){

const res = await fetch(`http://localhost:3000/api/team-messages/${teamId}`);

const messages = await res.json();

const box = document.getElementById("messages");

box.innerHTML="";

messages.forEach(msg=>{

box.innerHTML += `
<div class="message">
<b>${msg.sender}</b>: ${msg.message}
</div>
`;

});

}

loadMessages();


/* =========================
FILES
========================= */

async function uploadFile(){

const file = document.getElementById("fileUpload").files[0];

const formData = new FormData();

formData.append("file",file);
formData.append("teamId",teamId);

await fetch("http://localhost:3000/api/team-files/upload",{
method:"POST",
body:formData
});

alert("File uploaded");

}


/* =========================
TASKS
========================= */

async function createTask(){

const text = document.getElementById("taskText").value;

await fetch("http://localhost:3000/api/team-tasks/create",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body: JSON.stringify({
teamId,
text
})

});

document.getElementById("taskText").value="";

loadTasks();

}

async function loadTasks(){

const res = await fetch(`http://localhost:3000/api/team-tasks/${teamId}`);

const tasks = await res.json();

const container = document.getElementById("taskList");

container.innerHTML="";

tasks.forEach(t=>{

container.innerHTML += `
<div class="card">${t.text}</div>
`;

});

}

loadTasks();

/* =========================
MEMBERS
========================= */

async function loadMembers(){

const res = await fetch(`http://localhost:3000/api/teams/members/${teamId}`);

const members = await res.json();

const container = document.getElementById("memberList");

container.innerHTML = "";

members.forEach(m => {

container.innerHTML += `
<div class="card">
${m.name} (${m.email})
</div>
`;

});

}


async function addMember(){

const userId = document.getElementById("memberId").value;

await fetch("http://localhost:3000/api/teams/add-member",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body: JSON.stringify({
teamId,
userId
})

});

document.getElementById("memberId").value="";

loadMembers();

}


loadMembers();

async function loadMessages(){

const res = await fetch(
"http://localhost:3000/api/team-messages/"+teamId
);

const messages = await res.json();

const box = document.getElementById("messages");

messages.forEach(m =>{

box.innerHTML += `
<div class="message">

<b>${m.sender}</b>: ${m.message}

<button onclick="deleteMessage(${m.id})">🗑</button>

</div>
`;

});

}

loadMessages();

async function deleteMessage(id){

await fetch("http://localhost:3000/api/team-messages/"+id,{
method:"DELETE"
});

location.reload();

}