document.addEventListener("DOMContentLoaded", function () {
    const role = localStorage.getItem("role");
    const adminLink = document.querySelector("nav ul li a[href='admin.html']");

    if (role !== "admin") {
        adminLink.style.display = "none"; // Hide the Dashboard link for non-admins
    }
});

function logout() {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("role");
    window.location.href = "login.html";
}

document.addEventListener("DOMContentLoaded", function () {
    const role = localStorage.getItem("role"); // Get user role
    const deleteBtn = document.getElementById("deleteBtn"); // Select the delete button

    // Hide delete button if the user is not an admin
    if (role !== "admin" && deleteBtn) {
        deleteBtn.style.display = "none";
    }
});





// ...............................................................................................................................................

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("trainingForm");
    const tableBody = document.getElementById("dataTable");
    



    if (form) {
        form.addEventListener("submit", async function (event) {
            event.preventDefault();

            let formData = {
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
                employeeCode: document.getElementById("employeeCode").value,
                dataEnterBy: document.getElementById("dataEnterBy").value  // Added this line
                
            };

            try {
                const response = await fetch("http://localhost:5000/submit-form", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    alert("Form submitted successfully!");

                    // Save the form submission to localStorage
                    let submissions = JSON.parse(localStorage.getItem("submissions")) || [];
                    submissions.push(formData);
                    localStorage.setItem("submissions", JSON.stringify(submissions));

                    form.reset();
                    fetchTableData(); // Reload table with only new data
                } else {
                    alert("Error submitting form.");
                }
            } catch (error) {
                console.error(error);
            }
        });
    }

    async function fetchTableData() {
        try {
            const response = await fetch("http://localhost:5000/get-data");
            const data = await response.json();
            const role = localStorage.getItem("role"); // Get user role
    
            tableBody.innerHTML = "";
    
            data.forEach((entry, index) => {
                let employeeCodesArray = entry.employeecode.split(",");
                let employeeCodesCount = employeeCodesArray.length;
                let row = document.createElement("tr");
    
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${entry.calendar}</td>
                    <td>${entry.trainername}</td>
                    <td>${entry.othertrainer}</td>
                    <td>${entry.trainingdate}</td>
                    <td>${entry.trainingtiming}</td>
                    <td>${entry.trainingtimingend}</td>
                    <td>${entry.traininghead}</td>
                    <td>${entry.trainingtopic}</td>
                    <td>${entry.location}</td>
                    <td>${entry.referenceno}</td>
                    <td>${employeeCodesCount} Codes</td>
                    <td>${entry.dataenterby}</td>
                    <td><button class="export-btn" data-index="${index}">Export</button></td>
                    ${role === "admin" ? `<td><button class="delete-btn" data-id="${entry.id}">Delete</button></td>` : ""}
                `;
                
                tableBody.appendChild(row);
            });

            // 🔹 Attach Export Button Event Listeners
            document.querySelectorAll(".export-btn").forEach(button => {
                button.addEventListener("click", function () {
                    let index = this.getAttribute("data-index");
                    exportSingleRow(index);
                });
            });


            document.querySelectorAll(".delete-btn").forEach(button => {
                button.addEventListener("click", function () {
                    let id = this.getAttribute("data-id");
                    deleteRow(id);
                });
            });
                  

        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }


    function deleteRow(id) {
        if (confirm("Are you sure you want to delete this submission?")) {
            fetch(`http://localhost:5000/delete-data/${id}`, {
                method: "DELETE",
            })
                .then(response => response.json())
                .then(data => {
                    alert("Row deleted successfully!");
                    fetchTableData(); // Refresh table
                })
                .catch(error => console.error("Error deleting row:", error));
        }
    }




    
  
    function exportSingleRow(index) {
        fetch("http://localhost:5000/get-data")
            .then(response => response.json())
            .then(data => {
                let entry = data[index];
    
                if (!entry) {
                    alert("Invalid row selection!");
                    return;
                }
    
                let employeeCodes = entry.employeecode.split(","); // Get the actual codes
                let formattedData = employeeCodes.map(code => ({
                    calendar: entry.calendar,
                    trainerName: entry.trainername,
                    otherTrainer: entry.othertrainer,
                    trainingDate: entry.trainingdate,
                    trainingTiming: entry.trainingtiming,
                    trainingTimingEnd: entry.trainingtimingend,
                    trainingHead: entry.traininghead,
                    trainingTopic: entry.trainingtopic,
                    Location: entry.location,
                    referenceNo: entry.referenceno,
                    dataenterby: entry.dataenterby,
                    employeeCode: code.trim() // Each code in a separate row
                }));
    
                let worksheet = XLSX.utils.json_to_sheet(formattedData);
                let workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, "Training Data");
                XLSX.writeFile(workbook, `Training_Data_${index + 1}.xlsx`);
            })
            .catch(error => console.error("Error fetching data:", error));
    }

    fetchTableData(); // Load table on page load
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



  // Logout functionality
  function logout() {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("role");
    window.location.href = "login.html";
}


function filterTrainer() {
    let input = document.getElementById("searchTrainer").value.toLowerCase();
    let table = document.getElementById("dataTable");
    let rows = table.getElementsByTagName("tr");

    for (let i = 0; i < rows.length; i++) {
        let trainerCell = rows[i].getElementsByTagName("td")[2]; // 3rd column (Trainer Name)
        if (trainerCell) {
            let trainerName = trainerCell.textContent || trainerCell.innerText;
            rows[i].style.display = trainerName.toLowerCase().includes(input) ? "" : "none";
        }
    }
}



function filterByMonth() {
    let monthInput = document.getElementById("calendars").value; 
    let selectedMonth = new Date(monthInput).toLocaleString('en-us', { month: 'short' }).toLowerCase(); // "feb" for February
    let table = document.getElementById("dataTable");
    let rows = table.getElementsByTagName("tr");

    for (let i = 0; i < rows.length; i++) {
        let referenceCell = rows[i].getElementsByTagName("td")[10]; // 11th column (Reference No)
        if (referenceCell) {
            let referenceText = referenceCell.textContent.toLowerCase();
            rows[i].style.display = referenceText.startsWith(selectedMonth) ? "" : "none";
        }
    }
}



// Logout functionality
function logout() {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("role");
    window.location.href = "login.html";
  }
  
  // Redirect if not logged in
  if (localStorage.getItem("isLoggedIn") !== "true") {
    window.location.href = "login.html";
  }
  
  // Load queries on page load
  window.onload = loadQueries;
  