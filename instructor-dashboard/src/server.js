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

QUESTION_PERFORMANCE_SQL = `select question_id, student_id
                        from Student_Answer, Question
                        where Question.correct_answer = Student_Answer.student_answer;`
                        
                        // `select question_id from Question
                        // union
                        // select student_id from Student_Answer
                        // where correct_answer = student_answer
                        // `

// want to select student based on the student group number and print out all the students that are in that group
GROUP_STUDENT_SQL = `select student_id from Student s1, Student s2
                     where s1.seat_group_no = s2.seat_group_no    
                     and s1.student_id != s2.student_id;`

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

    db.get(GROUP_STUDENT_SQL, [req.query.student_id], (err, row) => {
        if (err) { return console.error(err.message); }

        const response = row;
        res.json(response);
    });
});

//end point for student group correct answer percentage

//end point to show which students got certain questions right
app.get('/question_performance', (req, res) => {
    res.set(LOCAL_OPTIONS);

    // line below in the second parameter corresponds with the ?
    db.get(QUESTION_PERFORMANCE_SQL, [req.query.question_id], (err, row) => {
        if (err) { return console.error(err.message); }

        const response = row;
        res.json(response);
    });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
