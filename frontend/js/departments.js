const role = localStorage.getItem("role");

if (role !== "admin") {
    document.getElementById("adminAdd").style.display = "none";
    document.getElementById("actionHeader").style.display = "none";
}

async function loadDepartments() {

const res = await fetch("http://localhost:3000/api/departments");
const data = await res.json();

const table = document.getElementById("deptTable");

table.innerHTML = "";

data.forEach(d => {

let action = "";

if(role === "admin"){
action = `<button onclick="deleteDepartment(${d.id})">Delete</button>`;
}

table.innerHTML += `
<tr>
<td>${d.id}</td>

<td>
<a href="departmentView.html?id=${d.id}&name=${encodeURIComponent(d.name)}">
${d.name}
</a>
</td>

<td>${action}</td>
</tr>
`;

});

}

async function addDepartment(){

const name = document.getElementById("deptName").value.trim();

if(name === ""){
alert("Please enter department name");
return;
}

await fetch("http://localhost:3000/api/departments",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({name})
});

document.getElementById("deptName").value = "";

loadDepartments();

}

async function deleteDepartment(id){

await fetch(`http://localhost:3000/api/departments/${id}`,{
method:"DELETE"
});

loadDepartments();

}

function logout(){
localStorage.clear();
window.location.href="login.html";
}

loadDepartments();