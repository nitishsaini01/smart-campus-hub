document.getElementById("registerForm").addEventListener("submit", async e => {

e.preventDefault();

const name = e.target.name.value;
const email = e.target.email.value;
const password = e.target.password.value;
const department = e.target.department.value;
const semester = e.target.semester.value;

const res = await fetch("http://localhost:3000/api/register",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body: JSON.stringify({
name,
email,
password,
department,
semester
})

});

const data = await res.json();

alert(data.message);

if(res.ok){
window.location.href="/login.html";
}

});