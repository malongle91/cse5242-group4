const express = require('express');
const https = require('https');
const { nextTick } = require('process');
const app = express();
const sqlite3 = require('sqlite3');
const port = 3000;

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

STUDENT_NAME_SQL = `select first_name from Student;`

QUESTION_IDS_SQL = `select question_id from Question;`

// return student id who answered correctly given question
QUESTION_PERFORMANCE_SQL = `select SA.student_id
from Student_Answer as SA, Question as Q
where (Q.question_id = ?) and (Q.correct_answer = SA.student_answer);`

// want to select student based on the student group number and print out all the students that are in that group
GROUP_STUDENT_SQL = `select student_id from Student SA where SA.seat_group_no = ?;`

STUDENT_GROUP_WRONG = `select distinct (SA.student_id)
from Student_Answer as SA, Question as Q, Student S
where (S.seat_group_no=?) AND (Q.correct_answer!=SA.student_answer)
AND SA.student_id = S.student_id;`

const db = new sqlite3.Database(DB_PATH, sqlite3.OPEN_READONLY, (err) => {
    if (err) { console.error(err.message); return; }
    console.log('Connected to SQLite db.');
});

/**
 * ENDPOINTS
 */
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

//print all the student groups
app.get('/student_groups', (req, res) => {
    res.set(LOCAL_OPTIONS);

    db.all(GROUP_STUDENT_SQL, [req.query.seat_group_no], (err, rows) => {
        if (err) { return console.error(err.message); }

        const response =  { student_ids: rows.map((x) => { return x.student_id }) } ;
        res.json(response);
    });
});

//end point for student group correct answer percentage

//end point to show which students got certain questions right
app.get('/question_performance', (req, res) => {
    res.set(LOCAL_OPTIONS);

    // line below in the second parameter corresponds with the ?
    db.all(QUESTION_PERFORMANCE_SQL, [req.query.question_id], (err, row) => {
        if (err) { return console.error(err.message); }

        const response = { student_ids: row.map((x) => { return x.student_id }) } ;
        res.json(response);
    });
});

//print all the student id who answred wrong based on student group
app.get('/hotspot', (req, res) => {
    res.set(LOCAL_OPTIONS);

    db.all(STUDENT_GROUP_WRONG, [req.query.seat_group_no], (err, rows) => {
        if (err) { return console.error(err.message); }

        const response =  { student_ids: rows.map((x) => { return x.student_id }) } ;
        res.json(response);
    });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
