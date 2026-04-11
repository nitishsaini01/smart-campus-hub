document.addEventListener("DOMContentLoaded", () => {
    loadStudents();
});

async function loadStudents() {

    const role = localStorage.getItem("role");

    const res = await fetch("http://localhost:3000/api/students");
    const data = await res.json();

    console.log("Students data:", data);

    const table = document.getElementById("studentsTable");

    if (!table) {
        console.log("studentsTable not found in HTML");
        return;
    }

    table.innerHTML = "";

    data.forEach(s => {
        table.innerHTML += `
        <tr>
            <td>${s.id}</td>
            <td>${s.name}</td>
            <td>${s.email}</td>

            <td>
                ${role === "admin" 
                    ? `<button onclick="deleteStudent(${s.id})">Delete</button>` 
                    : ""
                }
            </td>
        </tr>
        `;
    });
}


// DELETE
async function deleteStudent(id) {

    const role = localStorage.getItem("role");

    if (role !== "admin") {
        alert("Access denied");
        return;
    }

    if (!confirm("Delete this student?")) return;

    await fetch(`http://localhost:3000/api/students/${id}`, {
        method: "DELETE"
    });

    loadStudents();
}


// LOGOUT
function logout() {
    localStorage.clear();
    window.location.href = "login.html";
}