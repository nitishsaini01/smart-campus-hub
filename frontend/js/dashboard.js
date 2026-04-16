document.addEventListener("DOMContentLoaded", () => {

const name = localStorage.getItem("name");

if(name){
const welcome = document.getElementById("welcomeText");
if(welcome){
welcome.innerText = "Welcome, " + name;
}
}

const role = localStorage.getItem("role");

if (role !== "admin") {

const adminPanel = document.getElementById("adminPanel");
if (adminPanel) {
adminPanel.style.display = "none";
}

const adminLink = document.querySelector("a[onclick='showAdmin()']");
if (adminLink) {
adminLink.style.display = "none";
}

}

loadResources();
loadUsers();
loadDepartmentsCount();
loadAnnouncements();

});



/* ================= RESOURCES ================= */

async function loadResources(){

try{

const res = await fetch("http://localhost:3000/api/resources");
const data = await res.json();

const total = document.getElementById("totalResources");
if(total){
total.innerText = data.length;
}

const recent = document.getElementById("recentResources");

if(recent){

recent.innerHTML="";

data.forEach(r=>{

recent.innerHTML += `
<tr>
<td>${r.title}</td>
<td>${r.description}</td>
<td>${r.name}</td>
<td><a href="${r.file_url}" target="_blank">Open</a></td>
</tr>
`;

});

}

}catch(err){
console.error("Resource load error:",err);
}

}



/* ================= USERS ================= */

async function loadUsers(){

try{

const res = await fetch("http://localhost:3000/api/students");
const data = await res.json();

const users = document.getElementById("totalUsers");

if(users){
users.innerText = data.length;
}

}catch(err){
console.error("User load error:",err);
}

}



/* ================= ADMIN PANEL ================= */

function showAdmin(){

const role = localStorage.getItem("role");

if(role !== "admin"){
alert("Access denied");
return;
}

document.getElementById("adminPanel").style.display="block";

loadAdminResources();

}



async function loadAdminResources(){

try{

const res = await fetch("http://localhost:3000/api/resources");
const data = await res.json();

const table = document.getElementById("adminResources");

if(!table) return;

table.innerHTML="";

data.forEach(r=>{

table.innerHTML += `
<tr>
<td>${r.title}</td>
<td>${r.description}</td>
<td>${r.name}</td>
<td>
<button onclick="deleteResource(${r.id})">Delete</button>
</td>
</tr>
`;

});

}catch(err){
console.error("Admin resource error:",err);
}

}



async function deleteResource(id){

const confirmDelete = confirm("Delete this resource?");

if(!confirmDelete) return;

try{

await fetch(`http://localhost:3000/api/resources/${id}`,{
method:"DELETE"
});

loadAdminResources();
loadResources();

}catch(err){
console.error("Delete error:",err);
}

}



/* ================= ANNOUNCEMENTS ================= */

async function loadAnnouncements(){

try{

const res = await fetch("http://localhost:3000/api/announcements");
const data = await res.json();

const list = document.getElementById("announcementList");

if(!list) return;

list.innerHTML="";

data.forEach(a=>{

list.innerHTML += `<li>📢 ${a.message}</li>`;

});

}catch(err){
console.error("Announcement error",err);
}

}



async function postAnnouncement(){

const message = document.getElementById("announcementText").value;

if(!message){
alert("Write something");
return;
}

try{

await fetch("http://localhost:3000/api/announcements",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({message})

});

document.getElementById("announcementText").value="";

loadAnnouncements();

}catch(err){
console.error("Post announcement error",err);
}

}



/* ================= DEPARTMENTS ================= */

async function loadDepartmentsCount(){

try{

const res = await fetch("http://localhost:3000/api/departments");
const data = await res.json();

const dep = document.getElementById("totalDepartments");

if(dep){
dep.innerText = data.length;
}

}catch(err){
console.error("Department count error:",err);
}

}



/* ================= LOGOUT ================= */

function logout(){

localStorage.clear();

window.location.href="login.html";

}
async function postComment(resourceId){

const name = localStorage.getItem("name");

const input = document.getElementById("commentInput"+resourceId);

const comment = input.value;

if(!comment) return;

await fetch("http://localhost:3000/api/comments",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
resource_id:resourceId,
user_name:name,
comment:comment
})

});

input.value="";

loadComments(resourceId);

}

async function loadComments(resourceId){

const res = await fetch(`http://localhost:3000/api/comments/${resourceId}`);

const data = await res.json();

const list = document.getElementById("comments"+resourceId);

if(!list) return;

list.innerHTML="";

data.forEach(c=>{

list.innerHTML += `<p><b>${c.user_name}</b>: ${c.comment}</p>`;

});

}

