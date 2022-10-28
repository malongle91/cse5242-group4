const sqlite3 = require("sqlite3");

const HOTSPOT_QUERY = '';

const CORRECT_PERCENTAGE_QUERY = '';

const db = new sqlite3.Database(DB_PATH, sqlite3.OPEN_READONLY, (err) => {
    if (err) { console.error(err.message); return; }
    console.log("Connected to SQLite db.");
});

const optionsByFilter = {
    student: ["Bob", "Jane", "Aaron"],
    question: [1, 2, 3, 4, 5],
    seat_group: ["Teacher's Pets", "Kids in the Back", "Quiet Kids"]
}

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