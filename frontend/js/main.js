document.getElementById("loginForm").addEventListener("submit", async e => {

e.preventDefault();

const email = e.target.email.value;
const password = e.target.password.value;

const res = await fetch("http://localhost:3000/api/login",{

method:"POST",
headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({email,password})

});

const data = await res.json();

if(data.success){

localStorage.setItem("userId",data.userId);
localStorage.setItem("role",data.role);
localStorage.setItem("name",data.name);   // saves username

window.location.href="dashboard.html";

}else{

alert("Invalid Login");

}

});