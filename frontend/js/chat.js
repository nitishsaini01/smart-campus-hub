const socket = io("http://localhost:3000");

const chatBox = document.getElementById("chatMessages");
const chatInput = document.getElementById("chatInput");
const sendBtn = document.getElementById("sendBtn");

const username = localStorage.getItem("name") || "Student";


/* LOAD OLD MESSAGES */

async function loadMessages(){

try{

const res = await fetch("/api/chat/messages");
const messages = await res.json();

chatBox.innerHTML="";

messages.forEach(msg=>{

const div = document.createElement("div");

let deleteBtn = "";

/* show delete button only for own messages */

if(msg.sender_name === username){
deleteBtn = `<button onclick="deleteMessage(${msg.id})">❌</button>`;
}

div.innerHTML = `
<b>${msg.sender_name}</b>: ${msg.message}
${deleteBtn}
`;

chatBox.appendChild(div);

});

chatBox.scrollTop = chatBox.scrollHeight;

}catch(err){

console.log(err);

}

}

loadMessages();


/* SEND MESSAGE */

sendBtn.addEventListener("click", ()=>{

const message = chatInput.value.trim();

if(message==="") return;

socket.emit("chat message",{
sender:username,
message:message
});

chatInput.value="";

});


/* RECEIVE MESSAGE */

socket.on("chat message",(data)=>{

const div=document.createElement("div");

let deleteBtn = "";

if(data.sender === username){
deleteBtn = `<button onclick="deleteMessage(${data.id})">❌</button>`;
}

div.innerHTML = `
<b>${data.sender}</b>: ${data.message}
${deleteBtn}
`;

chatBox.appendChild(div);

chatBox.scrollTop = chatBox.scrollHeight;

});


/* DELETE MESSAGE */

async function deleteMessage(id){

const confirmDelete = confirm("Delete this message?");

if(!confirmDelete) return;

const name = localStorage.getItem("name");

await fetch(`/api/chat/delete/${id}?sender=${name}`,{
method:"DELETE"
});

loadMessages();

}