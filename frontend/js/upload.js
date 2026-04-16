const form = document.getElementById("uploadForm");

form.addEventListener("submit", async (e)=>{

e.preventDefault();

const formData = new FormData(form);

const uploaded_by = localStorage.getItem("userId");

formData.append("uploaded_by", uploaded_by);

try{

const res = await fetch("/api/resources",{
method:"POST",
body:formData
});

const data = await res.json();

alert("Resource uploaded successfully");

window.location.href="dashboard.html";

}catch(err){

console.log(err);
alert("Upload failed");

}

});