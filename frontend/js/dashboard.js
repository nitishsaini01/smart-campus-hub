/* ================= THEME SYSTEM ================= */

function applyTheme(theme){

if(theme === "dark"){
document.body.classList.add("dark-mode");
}else{
document.body.classList.remove("dark-mode");
}

}

const savedTheme = localStorage.getItem("theme") || "light";

applyTheme(savedTheme);



document.addEventListener("DOMContentLoaded", () => {

/* THEME TOGGLE */

const toggleBtn = document.getElementById("themeToggle");

if(toggleBtn){

toggleBtn.addEventListener("click", () => {

let theme = localStorage.getItem("theme");

if(theme === "dark"){
theme = "light";
}else{
theme = "dark";
}

localStorage.setItem("theme", theme);

applyTheme(theme);

});

}


/* ================= WELCOME TEXT ================= */

const name = localStorage.getItem("name");

if(name){
const welcome = document.getElementById("welcomeText");
if(welcome){
welcome.innerText = "Welcome, " + name;
}
}


/* ================= ROLE CONTROL ================= */

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


/* ================= LOAD DATA ================= */

loadResources();
loadUsers();
loadDepartmentsCount();
loadAnnouncements();
loadNotifications();
loadAssignmentsCount();
loadSubmissionsCount();
loadPendingAssignments();

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
<td>${r.department}</td>
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



/* ================= ASSIGNMENTS COUNT ================= */

async function loadAssignmentsCount(){

try{

const res = await fetch("http://localhost:3000/api/assignments/all");

const data = await res.json();

const el = document.getElementById("totalAssignments");

if(el){
el.innerText = data.length;
}

}catch(err){
console.error("Assignment count error:",err);
}

}



/* ================= SUBMISSIONS COUNT ================= */

async function loadSubmissionsCount(){

try{

const role = localStorage.getItem("role");

const userId = localStorage.getItem("userId");

let url = "";

if(role === "admin"){
url = "http://localhost:3000/api/submissions/all";
}
else{
url = `http://localhost:3000/api/submissions/student/${userId}`;
}

const res = await fetch(url);

const data = await res.json();

const el = document.getElementById("totalSubmissions");

if(el){
el.innerText = data.length;
}

}catch(err){
console.error("Submission count error:",err);
}

}



/* ================= PENDING ASSIGNMENTS ================= */

async function loadPendingAssignments(){

try{

const role = localStorage.getItem("role");

const userId = localStorage.getItem("userId");

const el = document.getElementById("pendingAssignments");

if(!el) return;

if(role === "admin"){
el.innerText = 0;
return;
}

const aRes = await fetch("http://localhost:3000/api/assignments/all");

const assignments = await aRes.json();

const sRes = await fetch(`http://localhost:3000/api/submissions/student/${userId}`);

const submissions = await sRes.json();

const pending = assignments.length - submissions.length;

el.innerText = pending;

}catch(err){
console.error("Pending assignment error:",err);
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



/* ================= NOTIFICATIONS ================= */

async function loadNotifications(){

try{

const res = await fetch("http://localhost:3000/api/notifications");

const data = await res.json();

const list = document.getElementById("notificationList");

if(!list) return;

list.innerHTML="";

data.forEach(n=>{

list.innerHTML += `<li>🔔 ${n.message}</li>`;

});

}catch(err){

console.error("Notification error:",err);

}

}