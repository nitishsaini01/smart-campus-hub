const userId = localStorage.getItem("userId");

/* Load Profile */

async function loadProfile(){

const res = await fetch("http://localhost:3000/api/students");

const users = await res.json();

const user = users.find(u => u.id == userId);

if(!user) return;

document.getElementById("name").innerText = user.name;
document.getElementById("email").innerText = user.email;
document.getElementById("role").innerText = user.role;

/* ✅ PROFILE IMAGE FIX ADDED HERE */
if(user.profile_pic){
document.getElementById("profilePic").src =
"/uploads/profiles/" + user.profile_pic;
}

}

loadProfile();


/* Update Name */

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


/* Change Password */

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


/* Upload Profile Picture */

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