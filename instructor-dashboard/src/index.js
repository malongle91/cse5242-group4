// const { FORMAT } = require("sqlite3");

async function getStudentIds() {
    const response = await fetch('http://127.0.0.1:3001/student_ids'); //, { mode: 'no-cors' }); // fetching at the api, returns a promise
    const responseJson = await response.json();                     // extracts the json based on the response
    return 'student_ids' in responseJson ? responseJson.student_ids : [];   // ternary operator, checks for  the reponse and prints out the student_ids else prints an array
}

// do the above for questions for the filter
async function getQuestion() {
    const response = await fetch('http://127.0.0.1:3001/question_ids'); //, { mode: 'no-cors' }); // fetching at the api, returns a promise
    const responseJson = await response.json();                     // extracts the json based on the response
    return 'question_ids' in responseJson ? responseJson.question_ids : [];   // ternary operator, checks for  the reponse and prints out the student_ids else prints an array
}

// having all the seat_group_no in the filter
async function getSeatGroup() {
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

async function getHotSpot(num){
    var link = 'http://127.0.0.1:3001/hotspot?seat_group_no=';
    link += num;
    const response = await fetch(link);
    const responseJson = await response.json();
    return responseJson;
}
var optionsByFilter = {
    // student: ["Bob", "Jane", "Aaron"],
    // question: [1, 2, 3, 4, 5],
    seat_group: ["Teacher's Pets", "Kids in the Back", "Quiet Kids"]
}

getStudentIds().then((result) => {optionsByFilter.student_id = result;});

getQuestion().then((result) => {optionsByFilter.question = result;});
getSeatGroup().then((result) => {optionsByFilter.seat_group = result;});



function changeFilter(value) {
    const filterByElement = document.getElementById("filter_by");

    if (value.length == 0 || value === "total") {
         
        getRoster().then((result) => {
           
            //console.log(result);
            const filterWholeClass = document.getElementById("whole_class")
            
            filterWholeClass.innerHTML  +="<tr><td>student id</td><td>First Name</td><td>Last Name</td><td>Num Answred</td><td>Num Correct</td><td>Correct %</td></tr>";
         
            var optionsHTML = "";
            for (let x in result){
                   
                filterWholeClass.innerHTML += `<tr><td>${result[x].student_id}</td><td>${result[x].first_name}</td><td>${result[x].last_name}</td><td>${result[x].num_answered}</td><td>${result[x].num_correct}</td><td>${result[x].correct_percentage}</td></tr>`;
                  
            }
            
            
            filterWholeClass.hidden = false;
            filterByElement.hidden = true;
        
        } );
        
        
        
        
    }
    else if ( optionId === "1") {
         
        getHotSpot().then((result) => {
           
           
            const filterWholeClass = document.getElementById("whole_class")
            
            filterWholeClass.innerHTML  +="<tr><td>student id</td><td>First Name</td><td>Last Name</td></tr>";
         
            var optionsHTML = "";
            for (let x in result){
                   
                filterWholeClass.innerHTML += `<tr><td>${result[x].student_id}</td><td>${result[x].first_name}</td><td>${result[x].last_name}</td></tr>`;
                  
            }
            
            
            filterWholeClass.hidden = false;
            filterByElement.hidden = true;
        
        } );
        
        
        
        
    }
    else {
        var optionsHTML = "";
        const filterWholeClass = document.getElementById("whole_class")
        filterWholeClass.innerHTML ="";
        const options = optionsByFilter[value];
        for (var optionId in options) {
            optionsHTML += `<option value="${optionId}">${options[optionId]}</option>`;
        }
        filterByElement.innerHTML = optionsHTML;
        filterByElement.hidden = false;
        // var value = document.getElementById(optionId).value;
        // console.log(value);
        
        // if(optionId )
    }
}

function getOption(value){
    selectElement = document.querySelector('#filter_by');
    output = selectElement.value;
    console.log(output);

    getHotSpot(output+1)

}
