const role = localStorage.getItem("role");
const userId = localStorage.getItem("userId");

/* ================= CREATE ASSIGNMENT ================= */

const form = document.getElementById("assignmentForm");

if(form){

form.addEventListener("submit", async function(e){

e.preventDefault();

const title = document.getElementById("title").value;
const description = document.getElementById("description").value;
const due_date = document.getElementById("due_date").value;
const file = document.getElementById("file").files[0];

const formData = new FormData();

formData.append("title", title);
formData.append("description", description);
formData.append("due_date", due_date);
formData.append("created_by", userId);
formData.append("file", file);

await fetch("/api/assignments/create",{
method:"POST",
body:formData
});

alert("Assignment uploaded");

form.reset();

loadAssignments();

});

}

/* ================= HIDE TEACHER SECTION ================= */

if(role === "student"){

const teacherSection = document.getElementById("teacherUpload");

if(teacherSection){
teacherSection.style.display = "none";
}

}

/* ================= LOAD ASSIGNMENTS ================= */

async function loadAssignments(){

const res = await fetch("/api/assignments/all");
const assignments = await res.json();

const container = document.getElementById("assignmentList");

container.innerHTML = "";

assignments.forEach(a => {

container.innerHTML += `

<div class="card">

<h3>${a.title}</h3>

<p>${a.description}</p>

<p>Due Date: ${new Date(a.due_date).toLocaleDateString()}</p>

<a href="/uploads/assignments/${a.file_url}" target="_blank">
Download Assignment
</a>

<br><br>

${role === "student" ? `

<input type="file" id="file${a.id}">

<button onclick="submitAssignment(${a.id})">
Submit Assignment
</button>

<br><br>

<button onclick="viewSubmissions(${a.id})">
View Student Submissions
</button>

<div id="submissions${a.id}"></div>

` : ""}

${role === "teacher" || role === "admin" ? `

<br><br>

<button onclick="deleteAssignment(${a.id})">
Delete Assignment
</button>

<button onclick="viewSubmissions(${a.id})">
View Student Submissions
</button>

<div id="submissions${a.id}"></div>

` : ""}

</div>

`;

});

}

loadAssignments();

/* ================= SUBMIT ASSIGNMENT ================= */

async function submitAssignment(id){

const fileInput = document.getElementById("file"+id);

if(!fileInput.files[0]){
alert("Please select a file");
return;
}

const formData = new FormData();

formData.append("assignment_id", id);
formData.append("student_id", userId);
formData.append("file", fileInput.files[0]);

await fetch("/api/assignments/submit",{
method:"POST",
body:formData
});

alert("Assignment submitted");

}

/* ================= DELETE ASSIGNMENT ================= */

async function deleteAssignment(id){

await fetch("/api/assignments/delete/"+id,{
method:"DELETE"
});

alert("Assignment deleted");

loadAssignments();

}

/* ================= VIEW SUBMISSIONS ================= */

async function viewSubmissions(id){

const res = await fetch("/api/assignments/submissions/"+id);

const submissions = await res.json();

const container = document.getElementById("submissions"+id);

container.innerHTML = "<h4>Student Submissions</h4>";

if(submissions.length === 0){
container.innerHTML += "<p>No submissions yet</p>";
return;
}

submissions.forEach(s => {

let actions = "";

/* Teacher/Admin */

if(role === "teacher" || role === "admin"){

actions = `
<a href="/uploads/assignments/${s.file_url}" target="_blank">
View Submission
</a>
`;

}

/* Students */

if(role === "student"){

if(parseInt(userId) === s.student_id){

actions = `
<a href="/uploads/assignments/${s.file_url}" target="_blank">
View Submission
</a>

<button onclick="deleteSubmission(${s.id})">
Delete
</button>
`;

}else{

actions = `<p>Submitted</p>`;

}

}

container.innerHTML += `

<div style="margin-bottom:10px">

<b>${s.name}</b>

<br>

${actions}

</div>

`;

});

}

/* ================= DELETE SUBMISSION ================= */

async function deleteSubmission(id){

await fetch("/api/submissions/"+id,{
method:"DELETE"
});

alert("Submission deleted");

loadAssignments();

}