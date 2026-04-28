const role = localStorage.getItem("role");
const userId = localStorage.getItem("userId");

/* Hide teacher upload section if student */

if(role === "student"){

const teacherSection = document.getElementById("teacherUpload");

if(teacherSection){
teacherSection.style.display = "none";
}

}

/* Load assignments */

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

/* Student submits assignment */

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

/* Teacher delete assignment */

async function deleteAssignment(id){

await fetch("/api/assignments/delete/"+id,{
method:"DELETE"
});

alert("Assignment deleted");

loadAssignments();

}

/* View submissions */

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

/* Teacher/Admin → only view */

if(role === "teacher" || role === "admin"){

actions = `
<a href="/uploads/assignments/${s.file_url}" target="_blank">
View Submission
</a>
`;

}

/* Students */

if(role === "student"){

/* If this student uploaded */

if(parseInt(userId) === s.student_id){

actions = `
<a href="/uploads/assignments/${s.file_url}" target="_blank">
View Submission
</a>

<button onclick="deleteSubmission(${s.id})">
Delete
</button>
`;

}

/* Other students */

else{

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

/* Student delete submission */

async function deleteSubmission(id){

await fetch("/api/submissions/"+id,{
method:"DELETE"
});

alert("Submission deleted");

loadAssignments();

}