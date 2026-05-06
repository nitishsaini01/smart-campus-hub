/* ==============================
CREATE TEAM
============================== */

async function createTeam(){

const name = document.getElementById("teamName").value;
const description = document.getElementById("teamDesc").value;

if(!name){
alert("Please enter team name");
return;
}

try{

const res = await fetch("http://localhost:3000/api/teams/create",{
method:"POST",
headers:{ "Content-Type":"application/json" },
body: JSON.stringify({
name,
description,
created_by: localStorage.getItem("userId")
})
});

const data = await res.json();

alert(data.message || "Team created successfully");

document.getElementById("teamName").value="";
document.getElementById("teamDesc").value="";

loadTeams();

}catch(err){
console.error(err);
alert("Error creating team");
}

}


/* ==============================
LOAD TEAMS
============================== */

async function loadTeams(){

try{

const res = await fetch("http://localhost:3000/api/teams");

const teams = await res.json();

const container = document.getElementById("teamList");

container.innerHTML = "";

if(teams.length === 0){

container.innerHTML = "<p>No teams created yet</p>";
return;

}

teams.forEach(team => {

container.innerHTML += `

<div class="card">

<i class="fa-solid fa-users"></i>

<h3>${team.name}</h3>

<p>${team.description || "No description"}</p>

<button onclick="openTeam(${team.id})">
Open Team
</button>

</div>

`;

});

}catch(err){
console.error(err);
}

}


/* ==============================
OPEN TEAM WORKSPACE
============================== */

function openTeam(teamId){

localStorage.setItem("currentTeam", teamId);

window.location.href = "team-workspace.html";

}


/* ==============================
LOGOUT
============================== */

function logout(){

localStorage.clear();

window.location.href = "/login.html";

}


/* ==============================
AUTO LOAD
============================== */

loadTeams();