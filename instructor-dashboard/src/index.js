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

// async function getHotSpot(num){
//     var link = 'http://127.0.0.1:3001/hotspot?seat_group_no=';
//     link += num;
//     const response = await fetch(link);
//     const responseJson = await response.json();
//     return responseJson;
// }

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
    console.log('HERE');
    if (value.length == 0 || value === "total") {
         
        getRoster().then((result) => {
           
            //console.log(result);
            const filterWholeClass = document.getElementById("whole_class")
            
            const p_wc = document.getElementById("info");
            p_wc.innerHTML = "<h4>Class Roster</h4>";

            filterWholeClass.innerHTML = "";
            filterWholeClass.innerHTML  +="<tr><td>student id</td><td>First Name</td><td>Last Name</td><td>Num Answred</td><td>Num Correct</td><td>Correct %</td></tr>";
         
            var optionsHTML = "";
            for (let x in result){
                   
                filterWholeClass.innerHTML += `<tr><td>${result[x].student_id}</td><td>${result[x].first_name}</td><td>${result[x].last_name}</td><td>${result[x].num_answered}</td><td>${result[x].num_correct}</td><td>${result[x].correct_percentage}</td></tr>`;
                  
            }
            
            
            filterWholeClass.hidden = false;
            filterByElement.hidden = true;
        
        } );
        
        getHotSpot().then((result) => {
           
            //console.log(result);
            const filterWholeClass = document.getElementById("cheaters")
            
            // const p_wc = document.getElementById("info");
            // p_wc.innerHTML = "<h4>Class Roster</h4>";
           
            filterWholeClass.innerHTML = "";
            filterWholeClass.innerHTML  +="<tr><td>student id</td><td>seat_group_no</td><td>question_id</td><td>incorrect_answer</td><td>hotspot_time</td></tr>";
         
            var optionsHTML = "";
            for (let x in result){
                   
                filterWholeClass.innerHTML += `<tr><td>${result[x].student_id}</td><td>${result[x].seat_group_no}</td><td>${result[x].question_id}</td><td>${result[x].incorrect_answer}</td><td>${result[x].hotspot_time}</td></tr>`;
                  
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
            let option_value = value + "-" + options[optionId];
            console.log(option_value);
            optionsHTML += `<option value="${option_value}">${options[optionId]}</option>`;
        }
        filterByElement.innerHTML = optionsHTML;
        filterByElement.hidden = false;
        // var value = document.getElementById(optionId).value;
        // console.log(value);
        
        // if(optionId )
    }

    if(value == 'student_id'){
        let studentId = document.getElementById('filter_by').value;
    
        console.log("value =" + studentId);
        
        getOption(studentId);

        
    }else if(value == 'question'){
        let questionId = document.getElementById('filter_by').value;
        console.log("value =" + questionId);
        getOption(questionId);
        
    }else if(value == 'seat_group'){
        let seatGroup = document.getElementById('filter_by').value;
        console.log("value =" + seatGroup);
        getOption(seatGroup);
    }

}

function getOption(selectId){
    let selected_value = selectId.split("-")[1];
    let parent_option = selectId.split("-")[0];
     console.log("parent: " + parent_option);
     if(parent_option == 'student_id'){
        getStudent(selected_value).then((result) => {
            console.log("student: " + selected_value);
            
            const filterWholeClass = document.getElementById("whole_class");

            const p_s = document.getElementById("info");
            p_s.innerHTML = "<h4>Student Info:</h4>";
            
            filterWholeClass.innerHTML  ="<tr><td>student id</td><td>Num Answred</td><td>Num Correct</td><td>Correct %</td></tr>";
            filterWholeClass.innerHTML += `<tr><td>${result.student_id}</td><td>${result.num_answered}</td><td>${result.num_correct}</td><td>${result.correct_percentage}</td></tr>`;

        });
    }else if(parent_option == 'question'){
        questionPerformance(selected_value).then((result) => {
            console.log("Question #: " + selected_value);

            const p_question = document.getElementById("info");
            p_question.innerHTML = "<h4>Below is the list of students that have answered the question correctly</h4>";

            const filterWholeClass = document.getElementById("whole_class");
            
            filterWholeClass.innerHTML  ="<tr><td>Student Id</td><td>First Name</td><td>Last Name</td><td>Num Answered</td><td>Num Correct</td></tr>";
            for (let x in result){
                filterWholeClass.innerHTML += `<tr><td>${result[x].student_id}</td><td>${result[x].first_name}</td><td>${result[x].last_name}</td><td>${result[x].num_answered}</td><td>${result[x].num_correct}</td></tr>`;
            }
        });

        getHotSpotByQues(selected_value).then((result) => {
            // console.log("Seat group #: " + selected_value);

            const filterWholeClass = document.getElementById("cheaters")
            
            // const p_wc = document.getElementById("info");
            // p_wc.innerHTML = "<h4>Class Roster</h4>";
           
            filterWholeClass.innerHTML = "";
            filterWholeClass.innerHTML  +="<tr><td>student id</td><td>seat_group_no</td><td>question_id</td><td>incorrect_answer</td><td>hotspot_time</td></tr>";
         
            var optionsHTML = "";
            for (let x in result){
                   
                filterWholeClass.innerHTML += `<tr><td>${result[x].student_id}</td><td>${result[x].seat_group_no}</td><td>${result[x].question_id}</td><td>${result[x].incorrect_answer}</td><td>${result[x].hotspot_time}</td></tr>`;
                  
            }
        });

    }else if(parent_option == 'seat_group'){
        getStudentGroups(selected_value).then((result) => {
            console.log("Seat group #: " + selected_value);

            const filterWholeClass = document.getElementById("whole_class")
            
            const p_sg = document.getElementById("info");
            p_sg.innerHTML = "<h4>Seat Group Roster:</h4>";

            filterWholeClass.innerHTML  ="<tr><td>First Name</td><td>Last Name</td><td>Student Id</td></tr>";
            for (let x in result){
                filterWholeClass.innerHTML += `<tr><td>${result[x].first_name}</td><td>${result[x].last_name}</td><td>${result[x].student_id}</td></tr>`;
            }
        });
        getHotSpotByGroup(selected_value).then((result) => {
            console.log("Seat group #: " + selected_value);

            const filterWholeClass = document.getElementById("cheaters")
            
            // const p_wc = document.getElementById("info");
            // p_wc.innerHTML = "<h4>Class Roster</h4>";
           
            filterWholeClass.innerHTML = "";
            filterWholeClass.innerHTML  +="<tr><td>student id</td><td>seat_group_no</td><td>question_id</td><td>incorrect_answer</td><td>hotspot_time</td></tr>";
         
            var optionsHTML = "";
            for (let x in result){
                   
                filterWholeClass.innerHTML += `<tr><td>${result[x].student_id}</td><td>${result[x].seat_group_no}</td><td>${result[x].question_id}</td><td>${result[x].incorrect_answer}</td><td>${result[x].hotspot_time}</td></tr>`;
                  
            }
        });
        
    }
    
}
