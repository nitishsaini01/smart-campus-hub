// =====================
// ROLE CHECK (IMPORTANT)
// =====================
document.addEventListener("DOMContentLoaded", () => {
    const role = localStorage.getItem("role");

    console.log("User role:", role);

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
});


// =====================
// LOAD RESOURCES
// =====================
async function loadResources() {
    try {
        const res = await fetch("http://localhost:3000/api/resources");
        const data = await res.json();

        const total = document.getElementById("totalResources");
        if (total) {
            total.innerText = data.length;
        }

        const list = document.getElementById("resourceList");
        if (list) {
            list.innerHTML = "";

            data.forEach(r => {
                let icon = "📄";

                if (r.file_url?.endsWith(".pdf")) icon = "📕";
                if (r.file_url?.endsWith(".ppt") || r.file_url?.endsWith(".pptx")) icon = "📊";
                if (r.file_url?.endsWith(".doc") || r.file_url?.endsWith(".docx")) icon = "📝";

                list.innerHTML += `
                <div class="resource">
                    <h3>${icon} ${r.title}</h3>
                    <p>${r.description}</p>
                    <a href="${r.file_url}" target="_blank">Open</a>
                </div>
                `;
            });
        }

        const recent = document.getElementById("recentResources");
        if (recent) {
            recent.innerHTML = "";

            data.slice(0, 5).forEach(r => {
                recent.innerHTML += `
                <tr>
                    <td>${r.title}</td>
                    <td>${r.description}</td>
                    <td>${r.name}</td>
                </tr>
                `;
            });
        }

    } catch (err) {
        console.error("Error loading resources:", err);
    }
}

loadResources();


// =====================
// LOAD USERS COUNT
// =====================
async function loadUsers() {
    try {
        const res = await fetch("http://localhost:3000/api/students");
        const data = await res.json();

        const userCount = document.getElementById("totalUsers");

        if (userCount) {
            userCount.innerText = data.length;
        }

    } catch (err) {
        console.error("Error loading users:", err);
    }
}

loadUsers();


// =====================
// SHOW ADMIN PANEL
// =====================
function showAdmin() {
    const role = localStorage.getItem("role");

    if (role !== "admin") {
        alert("Access denied!");
        return;
    }

    document.getElementById("adminPanel").style.display = "block";
    loadAdminResources();
}


// =====================
// LOAD ADMIN RESOURCES
// =====================
async function loadAdminResources() {
    try {
        const res = await fetch("http://localhost:3000/api/resources");
        const data = await res.json();

        const table = document.getElementById("adminResources");

        if (!table) return;

        table.innerHTML = "";

        data.forEach(r => {
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

    } catch (err) {
        console.error("Error loading admin resources:", err);
    }
}


// =====================
// DELETE RESOURCE
// =====================
async function deleteResource(id) {
    if (!confirm("Delete this resource?")) return;

    try {
        await fetch(`http://localhost:3000/api/resources/${id}`, {
            method: "DELETE"
        });

        loadAdminResources();

    } catch (err) {
        console.error("Delete error:", err);
    }
}

function logout() {
    localStorage.clear();
    window.location.href = "login.html";
}

async function loadDepartmentsCount() {

try {

const res = await fetch("http://localhost:3000/api/departments");
const data = await res.json();

document.getElementById("totalDepartments").innerText = data.length;

} catch(err){
console.error("Department count error:", err);
}

}

loadDepartmentsCount();