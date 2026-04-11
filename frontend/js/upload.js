document.getElementById("uploadForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    try {
        const res = await fetch("http://localhost:3000/api/resources/upload", {
            method: "POST",
            body: formData
        });

        const data = await res.json();

        if (res.ok) {
            alert(data.message);
        } else {
            alert("Error: " + data.message);
        }
    } catch (err) {
        console.error(err);
        alert("Upload failed. Check server console.");
    }
});