document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("trainingForm");
    const tableBody = document.getElementById("dataTable");


        // Get deleted rows from localStorage
        // let deletedRows = JSON.parse(localStorage.getItem("deletedRows")) || [];

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
                
            };

            try {
                const response = await fetch("http://localhost:5000/submit-form", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    alert("Form submitted successfully!");
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




            // Filter out deleted rows
            // const filteredData = data.filter(entry => !deletedRows.includes(entry.referenceNo));
            // 🔹 Show only new data by clearing old data first

            tableBody.innerHTML = "";

            data.forEach((entry, index) => {
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
                    <td>${entry.employeecode}</td>
                     
                    <td>
                        <button class="export-btn" data-index="${index}">Export</button>
                        
                    </td>
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

                    // Attach event listeners for Delete Buttons
                    // document.querySelectorAll(".delete-btn").forEach(button => {
                    //     button.addEventListener("click", function () {
                    //         let referenceNo = this.getAttribute("data-ref");
                    //         deleteRow(referenceNo);
                    //     });
                    // });
        

        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }
    // function deleteRow(referenceNo) {
        // Add the deleted referenceNo to localStorage
        // deletedRows.push(referenceNo);
        // localStorage.setItem("deletedRows", JSON.stringify(deletedRows));

        // Remove row from UI
    //     fetchTableData();
    // }
    function exportSingleRow(index) {
        let rows = document.querySelectorAll("#dataTable tr");

        if (rows[index]) {
            let row = rows[index].children;

            let rowData = {
                calendar: row[1].textContent.trim(),
                trainerName: row[2].textContent.trim(),
                otherTrainer: row[3].textContent.trim(),
                trainingDate: row[4].textContent.trim(),
                trainingTiming: row[5].textContent.trim(),
                trainingTimingEnd: row[6].textContent.trim(),
                trainingHead: row[7].textContent.trim(),
                trainingTopic: row[8].textContent.trim(),
                Location: row[9].textContent.trim(),
                referenceNo: row[10].textContent.trim(),
                employeeCode: row[11].textContent.trim()
            };

            let employeeCodes = rowData.employeeCode.split(",");
            let formattedData = employeeCodes.map(code => ({
                ...rowData,
                employeeCode: code.trim()
            }));

            let worksheet = XLSX.utils.json_to_sheet(formattedData);
            let workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Training Data");
            XLSX.writeFile(workbook, `Training_Data_${index + 1}.xlsx`);
        } else {
            alert("Invalid row selection!");
        }
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
