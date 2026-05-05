const userId = localStorage.getItem("userId");

/* =====================
LOAD PROFILE
===================== */

async function loadProfile(){

const res = await fetch("http://localhost:3000/api/students");

const users = await res.json();

const user = users.find(u => u.id == userId);

if(!user) return;

document.getElementById("name").innerText = user.name;
document.getElementById("email").innerText = user.email;
document.getElementById("role").innerText = user.role;
document.getElementById("department").innerText = user.department;
document.getElementById("semester").innerText = user.semester;

/* NEW — Department & Semester */

document.getElementById("department").innerText = user.department || "Not set";
document.getElementById("semester").innerText = user.semester || "Not set";

/* Profile Image */

if(user.profile_pic){
document.getElementById("profilePic").src =
"/uploads/profiles/" + user.profile_pic;
}

}

loadProfile();


/* =====================
LOAD USER ACTIVITY
===================== */

async function loadActivity(){

const res = await fetch("/api/students/activity/"+userId);

const data = await res.json();

document.getElementById("resCount").innerText = data.resources;
document.getElementById("subCount").innerText = data.assignments;
document.getElementById("comCount").innerText = data.comments;

}

loadActivity();


/* =====================
UPDATE NAME
===================== */

async function updateName(){

const newName = document.getElementById("newName").value;

if(!newName){
alert("Enter new name");
return;
}

await fetch(`http://localhost:3000/api/students/${userId}`,{

method:"PUT",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
name:newName
})

});

alert("Name updated");

location.reload();

}


/* =====================
UPDATE EMAIL
===================== */

async function updateEmail(){

const newEmail = document.getElementById("newEmail").value;

if(!newEmail){
alert("Enter email");
return;
}

await fetch(`http://localhost:3000/api/students/${userId}`,{

method:"PUT",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
email:newEmail
})

});

alert("Email updated");

location.reload();

}


/* =====================
CHANGE PASSWORD
===================== */

async function changePassword(){

const newPassword = document.getElementById("newPassword").value;

if(!newPassword){
alert("Enter password");
return;
}

await fetch(`http://localhost:3000/api/students/password/${userId}`,{

method:"PUT",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
password:newPassword
})

});

alert("Password updated");

document.getElementById("newPassword").value="";

}


/* =====================
UPLOAD PROFILE PICTURE
===================== */

async function uploadProfile(){

const file = document.getElementById("image").files[0];

if(!file){
alert("Select image");
return;
}

const formData = new FormData();

formData.append("image",file);

await fetch("/api/students/profile-pic/"+userId,{
method:"POST",
body:formData
});

alert("Profile picture updated");

location.reload();

}


/* =====================
DELETE ACCOUNT
===================== */

const deleteBtn = document.getElementById("deleteAccountBtn");

if(deleteBtn){

deleteBtn.addEventListener("click", async () => {

const confirmDelete = confirm("Are you sure you want to delete your account? This action cannot be undone.");

if(!confirmDelete) return;

try{

const res = await fetch(`/api/students/delete/${userId}`,{
method:"DELETE"
});

const data = await res.json();

alert(data.message);

/* logout user */

localStorage.clear();

window.location.href = "login.html";

}catch(err){

console.error(err);

alert("Error deleting account");

}

});

}