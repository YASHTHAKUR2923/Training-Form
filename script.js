document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("trainingForm");
    const tableBody = document.getElementById("dataTable");

    // Handle Form Submission
    if (form) {
        form.addEventListener("submit", function (event) {
            event.preventDefault();

            let storedData = JSON.parse(localStorage.getItem("formData")) || [];

            let formData = {
                srNo: storedData.length + 1, // Auto-increment Serial Number
             
                calendar: document.getElementById("calendar").value,
                trainerName: document.getElementById("trainerName").value,
                otherTrainer: document.getElementById("otherTrainer").value,
                trainingDate: document.getElementById("trainingDate").value,
                trainingTiming: document.getElementById("trainingTiming").value,
                trainingTimingEnd: document.getElementById("trainingTimingEnd").value,
                trainingHead: document.getElementById("trainingHead").value,
                trainingTopic: document.getElementById("trainingTopic").value,
                Location: document.getElementById("Location").value,
                referenceNo: document.getElementById("referenceNo").value,
                employeeCode: document.getElementById("employeeCode").value
            };

            storedData.push(formData);
            localStorage.setItem("formData", JSON.stringify(storedData));

            alert("Form submitted successfully!");
            form.reset();
            renderTable(); // Reload table without refreshing page
        });
    }

    // Function to Render Table
    function renderTable() {
        let storedData = JSON.parse(localStorage.getItem("formData")) || [];
        tableBody.innerHTML = ""; // Clear table before adding data

        storedData.forEach((data, index) => {
            let row = document.createElement("tr");
            row.innerHTML = `
                <td>${index + 1}</td>
                
                <td>${data.calendar}</td>
                <td>${data.trainerName}</td>
                <td>${data.otherTrainer}</td>
                <td>${data.trainingDate}</td>
                <td>${data.trainingTiming}</td>
                <td>${data.trainingTimingEnd}</td>
                <td>${data.trainingHead}</td>
                <td>${data.trainingTopic}</td>
                <td>${data.Location}</td>
                <td>${data.referenceNo}</td>
                <td>${data.employeeCode}</td>
                <td><button class="export-btn" data-index="${index}">Export</button></td>
                
            `;
            tableBody.appendChild(row);
        });

        // Add Event Listeners for Export Buttons
        document.querySelectorAll(".export-btn").forEach(button => {
            button.addEventListener("click", function () {
                let index = this.getAttribute("data-index");
                exportSingleRow(index);
            });
        });

        // Add Event Listeners for Delete Buttons
        document.querySelectorAll(".delete-btn").forEach(button => {
            button.addEventListener("click", function () {
                let index = this.getAttribute("data-index");
                deleteRow(index);
            });
        });
    }

    // Function to Delete Row with Confirmation
    function deleteRow(index) {
        let storedData = JSON.parse(localStorage.getItem("formData")) || [];

        // Show confirmation popup
        let confirmDelete = confirm("Are you sure you want to delete this row?");
        
        if (confirmDelete) {
            storedData.splice(index, 1); // Remove the selected row
            localStorage.setItem("formData", JSON.stringify(storedData)); // Save updated data
            renderTable(); // Re-render table
        }
    }
// Function to Export Single Row with Employee Code Vertically
function exportSingleRow(index) {
    let storedData = JSON.parse(localStorage.getItem("formData")) || [];
    if (storedData[index]) {
        let singleData = storedData[index];

        // Extract other fields (keep them in the same row)
        let otherFields = { ...singleData };
        delete otherFields.employeeCode; // Remove employeeCode for now

        // Split Employee Codes into separate rows while keeping other fields intact
        let employeeCodes = singleData.employeeCode.split(",");
        let formattedData = employeeCodes.map(code => ({
            ...otherFields, // Keep other fields the same
            employeeCode: code.trim() // Add one employee code per row
        }));

        let worksheet = XLSX.utils.json_to_sheet(formattedData);
        let workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Training Data");
        XLSX.writeFile(workbook, `Training_Data_${index + 1}.xlsx`);
    }
}

    // Load Table on Page Load
    renderTable();
});



document.getElementById("calendar").addEventListener("change", function () {
    let selectedMonth = this.value; // Format: YYYY-MM
    if (selectedMonth) {
        let monthNames = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];
        
        let year = selectedMonth.split("-")[0]; // Extract Year
        let monthIndex = parseInt(selectedMonth.split("-")[1], 10) - 1; // Convert to index (0-11)
        let monthName = monthNames[monthIndex]; // Get Month Name
        
        // Generate a random number (you can modify logic for sequence)
        let randomNum = Math.floor(1000 + Math.random() * 9000); 
        
        // Set Reference No in format "Month1234"
        document.getElementById("referenceNo").value = `${monthName}${randomNum}`;
    }
});






// other input fileds script
function toggleOtherInput() {
    var trainerSelect = document.getElementById("trainerName");
    var otherInputDiv = document.getElementById("otherTrainerDiv");

    if (trainerSelect.value === "other") {
        otherInputDiv.style.display = "block";  // Show input field
    } else {
        otherInputDiv.style.display = "none";   // Hide input field
    }
}











const topics = {
    "Awareness": [
        "Awareness of Environment Management system",
        "Awareness Program on Quality Management System ISO -9001-2015",
        "ESIC & EPF Awareness",
        "H R Policy & Systems",
        "Human Rights"
    ],
    "Chemical Management System": [
        "Chemical Safety",
        "Policies & Procedure (Child Labour , Minimum Wages , Bribery , Freedom of Association etc)"
    ],
    "Compilance": [
        "BSCI Code of conduct",
        "Business Ethics",
        "Business social compliance initiative",
        "Code of conduct (SMETA Pillar 4)",
        "Disciplinary Process"
    ],
    "CT PAT": [
        "CTPAT Training"
    ],
    "Customer Compliance": [
        "Cultural framework and leadership model",
        "MI Core values"
    ],
    "ETP": [
        "ETP/STP"
    ],
    "Fire Safety": [
        "Fire safety",
        "Training on Fire safety"
    ],
    "Fire Safety Training": [
        "First Aid Training"
    ],
    "First Aid": [
        "First Aid Training"
    ],
    "Grievance": [
        "Grievance Policy",
        "Ungal Kural session(Grievance Management session)"
    ],
    "Hygiene": [
        "Personal hygiene and food contamination policy"
    ],
    "Production": [
        "Awareness about process related defects",
        "Kaizen & 5 S",
        "Material Handling"
    ],
    "QMS": [
        "Awareness Program on Quality Management System ISO -9001-2015",
        "SMETA COC [ETI]",
        "SMETA Pillar 4",
        "Social Performance Team",
        "WSI code of conduct"
    ],
    "Safety": [
        "Health & Safety and use of PPEs"
    ],
    "Salary & Wages": [
        "Wages and benefits"
    ],
    "Soft skills": [
        "Team Building and brainstorming session"
    ],
    "SOPs": [
        "SOP Awareness",
        "Awareness of SOP"
    ],
    "Waste Management": [
        "Hazardous and Non Hazardous waste (Proper handling, store and use of PPEs)"
    ]
};

function updateTopics() {
    let headSelect = document.getElementById("trainingHead");
    let topicSelect = document.getElementById("trainingTopic");
    let selectedHead = headSelect.value;

    // Clear previous options
    topicSelect.innerHTML = '<option value="" disabled selected>Select Training Topic</option>';

    // Add relevant topics
    if (topics[selectedHead]) {
        topics[selectedHead].forEach(topic => {
            let option = document.createElement("option");
            option.value = topic;
            option.textContent = topic;
            topicSelect.appendChild(option);
        });
    }
}





// other input lOcation
function toggleOtherLocation() {
    let locationSelect = document.getElementById("Location");
    let otherInput = document.getElementById("otherLocationInput");

    // Show input if "Other" is selected, otherwise hide it
    if (locationSelect.value === "Other") {
        otherInput.style.display = "block";
        otherInput.setAttribute("required", "true"); // Make input required when visible
    } else {
        otherInput.style.display = "none";
        otherInput.removeAttribute("required"); // Remove required if not visible
    }
}



