async function getStudentIds() {
    const response = await fetch('http://127.0.0.1:3000/student_ids'); //, { mode: 'no-cors' });
    const responseJson = await response.json();
    return 'student_ids' in responseJson ? responseJson.student_ids : [];
}

var optionsByFilter = {
    // student: ["Bob", "Jane", "Aaron"],
    question: [1, 2, 3, 4, 5],
    seat_group: ["Teacher's Pets", "Kids in the Back", "Quiet Kids"]
}

getStudentIds().then((result) => {optionsByFilter.student_id = result;});

function changeFilter(value) {
    const filterByElement = document.getElementById("filter_by");
    if (value.length == 0 || value === "total") {
        filterByElement.innerHTML = "<option></option>";
        filterByElement.hidden = true;
    }
    else {
        var optionsHTML = "";
        const options = optionsByFilter[value];
        for (var optionId in options) {
            optionsHTML += `<option>${options[optionId]}</option>`;
        }
        filterByElement.innerHTML = optionsHTML;
        filterByElement.hidden = false;
    }
}