// API base URL of your backend
const API_BASE = "http://localhost:4000/api";  // change to your server URL after hosting

// Load saved reports on page load
document.addEventListener("DOMContentLoaded", loadRecords);

// Save a patient report
async function saveReport() {
    let name = document.getElementById("name").value;
    let bp = parseInt(document.getElementById("bp").value);
    let sugar = parseInt(document.getElementById("sugar").value);
    let disease = document.getElementById("disease").value;
    let file = document.getElementById("reportFile").files[0];

    if (!name || !bp || !sugar || !disease) {
        alert("Please fill all fields");
        return;
    }

    // Prepare formData for backend
    const formData = new FormData();
    formData.append("name", name);
    formData.append("bp", bp);
    formData.append("sugar", sugar);
    formData.append("disease", disease);
    if (file) formData.append("file", file);

    // Send to backend API
    const response = await fetch(`${API_BASE}/reports`, {
        method: "POST",
        body: formData
    });

    if (!response.ok) {
        alert("Failed to save report");
        return;
    }

    alert("Report Saved Successfully!");
    loadRecords();
}

// Load records from backend
async function loadRecords() {
    let container = document.getElementById("records");
    container.innerHTML = "";

    const response = await fetch(`${API_BASE}/reports`);
    const reports = await response.json();

    reports.forEach((rep) => {
        let suggestion = getSuggestion(rep.bp, rep.sugar);

        container.innerHTML += `
            <div class="record">
                <h3>${rep.name}</h3>
                <p><b>BP:</b> ${rep.bp}</p>
                <p><b>Sugar:</b> ${rep.sugar}</p>
                <p><b>Disease:</b> ${rep.disease}</p>
                <p><b>AI Suggestion:</b> ${suggestion}</p>
                ${rep.fileUrl 
                    ? `<a href="${rep.fileUrl}" target="_blank">📄 Open Report</a>` 
                    : "" }
            </div>
        `;
    });
}

// AI Suggestion logic
function getSuggestion(bp, sugar) {
    let msg = "";

    if (bp > 140) msg += "⚠ High BP! Reduce salt, check again, consult doctor. ";
    if (bp < 90) msg += "⚠ Low BP! Drink water and rest. ";

    if (sugar > 180) msg += "⚠ High Sugar! Avoid sweets & check insulin. ";
    if (sugar < 70) msg += "⚠ Low Sugar! Take glucose immediately. ";

    if (msg === "") msg = "✔ All readings normal.";

    return msg;
}
