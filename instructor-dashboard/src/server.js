const express = require('express');
const responseTime = require('response-time')
const app = express();
const sqlite3 = require('sqlite3');
const port = 3001;

DB_PATH = '../../db/quiz.db';

const LOCAL_OPTIONS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true
}

/**
 * QUERY LIST
 */
STUDENT_PERCENTAGE_SQL = `select student_id,
                          (IIF(num_answered > 0, CAST(num_correct AS FLOAT) / num_answered, 0)) as correct_percentage,
                          num_answered, num_correct from Student
                          where student_id = ?;`

STUDENT_IDS_SQL = `select student_id from Student;`

ALL_STUDENTS_SQL = `select student_id, (IIF(num_answered > 0, CAST(num_correct AS FLOAT) / num_answered, 0)) as correct_percentage,
num_answered, num_correct,first_name, last_name from Student;`

STUDENT_NAME_SQL = `select first_name from Student;`

QUESTION_IDS_SQL = `select question_id from Question;`

STUDENT_GROUP_SQL = `select distinct(seat_group_no) from Student`;

// create a percentage of how many students got a question right 


const db = new sqlite3.Database(DB_PATH, sqlite3.OPEN_READONLY, (err) => {
    if (err) { console.error(err.message); return; }
    console.log('Connected to SQLite db.');
});

app.use(responseTime((req, res, time) => {
    console.log(`Response returned in: ${time}`);
}));

/**
 * ENDPOINTS
 */

 app.get('/all_students', (req, res) => {
    res.set(LOCAL_OPTIONS);

    // json file
    db.all(ALL_STUDENTS_SQL, [], (err, rows) => {
        if (err) { return console.error(err.message); }

        const response = rows
        res.json(response);
    });
});

app.get('/student_ids', (req, res) => {
    res.set(LOCAL_OPTIONS);

    // json file
    db.all(STUDENT_IDS_SQL, [], (err, rows) => {
        if (err) { return console.error(err.message); }

        const response = { student_ids: rows.map((x) => { return x.student_id }) }  //mapping that array to get only the student ids
        res.json(response);
    });
});

app.get('/student_percentage', (req, res) => {
    res.set(LOCAL_OPTIONS);

    // line below in the second parameter corresponds with the ?
    db.get(STUDENT_PERCENTAGE_SQL, [req.query.student_id], (err, row) => {
        if (err) { return console.error(err.message); }

        const response = row;
        res.json(response);
    });
});

// printing the question ids
app.get('/question_ids', (req, res) => {
    res.set(LOCAL_OPTIONS);

    db.all(QUESTION_IDS_SQL, [], (err, rows) => {
        if (err) { return console.error(err.message); }

        const response = { question_ids: rows.map((x) => { return x.question_id }) }  //mapping that array to get only the student ids
        res.json(response);
    });

});

// want to select student based on the student group number and print out all the students that are in that group
GROUP_STUDENT_SQL = `select first_name, last_name, student_id from Student SA where SA.seat_group_no = ?;`

//print all the student groups
app.get('/student_groups_roster', (req, res) => {
    res.set(LOCAL_OPTIONS);

    db.all(GROUP_STUDENT_SQL, [req.query.seat_group_no], (err, rows) => {
        if (err) { return console.error(err.message); }

        const response = rows;
        res.json(response);
    });
});

//end point for student group correct answer percentage

// return student id who answered correctly given question
QUESTION_PERFORMANCE_SQL = `select distinct(SA.student_id), S.first_name, S.last_name, S.num_answered, S.num_correct
from Student_Answer as SA, Question as Q, Student as S
where (Q.question_id = ?) and (Q.correct_answer = SA.student_answer) and (SA.student_id = S.student_id) and (SA.question_id = Q.question_id);`

//end point to show which students got certain questions right
app.get('/question_performance', (req, res) => {
    res.set(LOCAL_OPTIONS);

    // line below in the second parameter corresponds with the ?
    db.all(QUESTION_PERFORMANCE_SQL, [req.query.question_id], (err, row) => {
        if (err) { return console.error(err.message); }

        const response = row ;
        res.json(response);
    });
});

//print all the student id who answred wrong based on student group
STUDENT_GROUP_WRONG = `select distinct (SA.student_id), S.first_name, S.last_name
from Student_Answer as SA, Question as Q, Student S
where (S.seat_group_no=?) AND (Q.correct_answer!=SA.student_answer)
AND SA.student_id = S.student_id;`

app.get('/hotspot', (req, res) => {
    res.set(LOCAL_OPTIONS);

    db.all(STUDENT_GROUP_WRONG, [req.query.seat_group_no], (err, rows) => {
        if (err) { return console.error(err.message); }

        const response =  { student_ids: rows.map((x) => { return x.student_id }) } ;
        res.json(response);
    });
});

app.get('/student_groups', (req, res) => {
    res.set(LOCAL_OPTIONS);

    db.all(STUDENT_GROUP_SQL, [], (err, rows) => {
        if (err) { return console.error(err.message); }

        const response = { seat_group_no: rows.map((x) => { return x.seat_group_no }) }  //mapping that array to get only the student ids
        res.json(response);
    });

});


HOTSPOT_LIST_SQL = 'select * from Hotspot;'

app.get('/hotspot_list', (req, res) => {
    res.set(LOCAL_OPTIONS);

    // json file
    db.all(HOTSPOT_LIST_SQL, [], (err, rows) => {
        if (err) { return console.error(err.message); }

        const response = rows
        res.json(response);
    });
});

HOTSPOT_BY_GROUP_SQL = 'select * from Hotspot as H where (seat_group_no=?);'
app.get('/group_hotspot', (req, res) => {
    res.set(LOCAL_OPTIONS);

    db.all(HOTSPOT_BY_GROUP_SQL, [req.query.seat_group_no], (err, rows) => {
        if (err) { return console.error(err.message); }

        const response = rows;
        res.json(response);
    });
});

HOTSPOT_BY_QUES = 'select * from Hotspot as H where (question_id = ?);'
app.get('/ques_hotspot', (req, res) => {
    res.set(LOCAL_OPTIONS);

    db.all(HOTSPOT_BY_QUES, [req.query.question_id], (err, rows) => {
        if (err) { return console.error(err.message); }

        const response = rows;
        res.json(response);
    });
});

HOTSPOT_BY_STUDENT_SQL = 'select * from Hotspot as H where (student_id = ?);'
app.get('/student_hotspot', (req, res) => {
    res.set(LOCAL_OPTIONS);

    db.all(HOTSPOT_BY_STUDENT_SQL, [req.query.student_id], (err, rows) => {
        if (err) { return console.error(err.message); }

        const response = rows;
        res.json(response);
    });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
