async function getStudentIds() {
    const response = await fetch('http://127.0.0.1:3001/student_ids'); //, { mode: 'no-cors' }); // fetching at the api, returns a promise
    const responseJson = await response.json();                     // extracts the json based on the response
    return 'student_ids' in responseJson ? responseJson.student_ids : [];   // ternary operator, checks for  the reponse and prints out the student_ids else prints an array
}

// do the above for questions for the filter
async function getQuestions() {
    const response = await fetch('http://127.0.0.1:3001/question_ids'); //, { mode: 'no-cors' }); // fetching at the api, returns a promise
    const responseJson = await response.json();                     // extracts the json based on the response
    return 'question_ids' in responseJson ? responseJson.question_ids : [];   // ternary operator, checks for  the reponse and prints out the student_ids else prints an array
}

// having all the seat_group_no in the filter
async function getSeatGroups() {
    const response = await fetch('http://127.0.0.1:3001/student_groups'); //, { mode: 'no-cors' }); // fetching at the api, returns a promise
    const responseJson = await response.json();                     // extracts the json based on the response
    return 'seat_group_no' in responseJson ? responseJson.seat_group_no : [];   // ternary operator, checks for  the reponse and prints out the student_ids else prints an array
}

// printing the students in the class when "Whole Class" is selected
async function getRoster(){
    const response = await fetch('http://127.0.0.1:3001/all_students');
    const responseJson = await response.json();
    return responseJson;
}

async function getStudent(studentId){
    var link = 'http://localhost:3001/student_percentage?student_id=';
    link += studentId;
    const response = await fetch(link);
    const responseJson = await response.json();
    return responseJson;
}

async function questionPerformance(questionId){
    var link = 'http://localhost:3001/question_performance?question_id=';
    link += questionId;
    const response = await fetch(link);
    const responseJson = await response.json();
    return responseJson;
}

async function getStudentGroups(seat_group_no){
    var link = 'http://localhost:3001/student_groups_roster?seat_group_no=';
    link += seat_group_no;
    const response = await fetch(link);
    const responseJson = await response.json();
    return responseJson;
}

async function getHotSpot(){
    const response = await fetch('http://127.0.0.1:3001/hotspot_list');
    const responseJson = await response.json();
    return responseJson;
}

async function getHotSpotByGroup(seat_group_no){
    var link = 'http://localhost:3001/group_hotspot?seat_group_no=';
    link += seat_group_no;
    const response = await fetch(link);
    const responseJson = await response.json();
    return responseJson;
}

async function getHotSpotByQues(quesionId){
    var link = 'http://localhost:3001/ques_hotspot?question_id=';
    link += quesionId;
    const response = await fetch(link);
    const responseJson = await response.json();
    return responseJson;
}

// setTimeout(() => {
//     document.location.reload(true);
//   }, 3000);

// Document Nodes

function renderResults(filterValue) {
    return new Promise((resolve, reject) => {
        const filterOptionsDropdown = document.getElementById("filter_options_dropdown");
    
        if (filterValue === "total") {
            filterOptionsDropdown.hidden = true;
            renderResultsForWholeClass();
        } else {
            filterOptionsDropdown.innerHTML = "<option value=\"\" disabled selected>Select option</option>";
    
            if (filterValue === "student_id") {
                options = getStudentIds();
            } else if (filterValue === "question") {
                options = getQuestions();
            } else if (filterValue === "seat_group") {
                options = getSeatGroups();
            }
    
            options.then((result) => {
                for (var optionId in result) {
                    let option_value = filterValue + "-" + result[optionId];
                    filterOptionsDropdown.innerHTML += `<option value="${option_value}">${result[optionId]}</option>`;
                }
                filterOptionsDropdown.hidden = false;
                resolve();
            });
        }
    });
}

function renderResultsForWholeClass() {
    const resultsTable = document.getElementById("correct_percentage_table");
    let resultsTableLabel = document.getElementById("info");
    let resultsTableHeader = resultsTable.getElementsByTagName("thead")[0];
    let resultsTableBody = resultsTable.getElementsByTagName("tbody")[0];

    resultsTableHeader.innerHTML = "";
    resultsTableBody.innerHTML = "";

    const hotspotTable = document.getElementById("hotspot_table");
    let hotspotTableBody = hotspotTable.getElementsByTagName("tbody")[0];

    resultsTableLabel.innerHTML = "<h4>Class Roster</h4>";
    hotspotTableBody.innerHTML = "";

    resultsTableHeader.innerHTML = "<tr><td>student id</td><td>First Name</td><td>Last Name</td><td>Num Answred</td><td>Num Correct</td><td>Correct %</td></tr>";

    getRoster().then((result) => {
        for (let x in result){
            resultsTableBody.innerHTML += `<tr><td>${result[x].student_id}</td><td>${result[x].first_name}</td><td>${result[x].last_name}</td><td>${result[x].num_answered}</td><td>${result[x].num_correct}</td><td>${result[x].correct_percentage}</td></tr>`;
        }
    });

    getHotSpot().then((result) => {
        for (let x in result){
            hotspotTableBody.innerHTML += `<tr><td>${result[x].student_id}</td><td>${result[x].seat_group_no}</td><td>${result[x].question_id}</td><td>${result[x].incorrect_answer}</td><td>${result[x].hotspot_time}</td></tr>`;
        }
    })
}

function renderResultsForFilter(filterOptionValue){
    let selected_value = filterOptionValue.split("-")[1];
    let parent_option = filterOptionValue.split("-")[0];

    const resultsTable = document.getElementById("correct_percentage_table");
    let resultsTableLabel = document.getElementById("info");
    let resultsTableHeader = resultsTable.getElementsByTagName("thead")[0];
    let resultsTableBody = resultsTable.getElementsByTagName("tbody")[0];

    resultsTableHeader.innerHTML = "";
    resultsTableBody.innerHTML = "";

    const hotspotTable = document.getElementById("hotspot_table");
    let hotspotTableBody = hotspotTable.getElementsByTagName("tbody")[0];

    if (parent_option == 'student_id') {
        resultsTableLabel.innerHTML = "<h4>Student Info:</h4>";
        resultsTableHeader.innerHTML = "<tr><td>student id</td><td>Num Answred</td><td>Num Correct</td><td>Correct %</td></tr>";

        getStudent(selected_value).then((result) => {
            resultsTableBody.innerHTML += `<tr><td>${result.student_id}</td><td>${result.num_answered}</td><td>${result.num_correct}</td><td>${result.correct_percentage}</td></tr>`;
        });
    } else if (parent_option == 'question') {
        resultsTableLabel.innerHTML = "<h4>Below is the list of students that have answered the question correctly</h4>";
        resultsTableHeader.innerHTML = "<tr><td>Student Id</td><td>First Name</td><td>Last Name</td><td>Num Answered</td><td>Num Correct</td></tr>";

        questionPerformance(selected_value).then((result) => {
            for (let x in result){
                resultsTableBody.innerHTML += `<tr><td>${result[x].student_id}</td><td>${result[x].first_name}</td><td>${result[x].last_name}</td><td>${result[x].num_answered}</td><td>${result[x].num_correct}</td></tr>`;
            }
        });

        hotspotTableBody.innerHTML = "";

        getHotSpotByQues(selected_value).then((result) => {
            for (let x in result){
                hotspotTableBody.innerHTML += `<tr><td>${result[x].student_id}</td><td>${result[x].seat_group_no}</td><td>${result[x].question_id}</td><td>${result[x].incorrect_answer}</td><td>${result[x].hotspot_time}</td></tr>`;
            }
        });
    } else if (parent_option == 'seat_group') {
        resultsTableLabel.innerHTML = "<h4>Seat Group Roster:</h4>";
        resultsTableHeader.innerHTML = "<tr><td>First Name</td><td>Last Name</td><td>Student Id</td></tr>";

        getStudentGroups(selected_value).then((result) => {
            for (let x in result){
                resultsTableBody.innerHTML += `<tr><td>${result[x].first_name}</td><td>${result[x].last_name}</td><td>${result[x].student_id}</td></tr>`;
            }
        });

        hotspotTableBody.innerHTML = "";

        getHotSpotByGroup(selected_value).then((result) => {
            for (let x in result){
                filterWholeClass.innerHTML += `<tr><td>${result[x].student_id}</td><td>${result[x].seat_group_no}</td><td>${result[x].question_id}</td><td>${result[x].incorrect_answer}</td><td>${result[x].hotspot_time}</td></tr>`;
            }
        });
    }
}

async function refreshResults() {
    const filtersDropdownValue = document.getElementById("filters_dropdown").value;
    if (filtersDropdownValue.length === 0 || filtersDropdownValue == "total") {
        renderResults(filtersDropdownValue);
    } else {
        var filterOptionsDropdown = document.getElementById("filter_options_dropdown");
        const existingValue = filterOptionsDropdown.value;
        await renderResults(filtersDropdownValue);

        for (var i = 0; i < filterOptionsDropdown.options.length; i++) {
            if (filterOptionsDropdown[i].value === existingValue) {
                filterOptionsDropdown[i].setAttribute("selected", true);
                filterOptionsDropdown.value = existingValue;
                break;
            }
        }
        renderResultsForFilter(existingValue);
    }
}