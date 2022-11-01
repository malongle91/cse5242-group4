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

const db = new sqlite3.Database(DB_PATH, sqlite3.OPEN_READONLY, (err) => {
    if (err) { console.error(err.message); return; }
    console.log('Connected to SQLite db.');
});

/**
 * ENDPOINTS
 */
app.get('/student_ids', (req, res) => {
    res.set(LOCAL_OPTIONS);

    db.all(STUDENT_IDS_SQL, [], (err, rows) => {
        if (err) { return console.error(err.message); }

        const response = { student_ids: rows.map((x) => { return x.student_id }) }
        res.json(response);
    });
});

app.get('/student_percentage', (req, res) => {
    res.set(LOCAL_OPTIONS);

    db.get(STUDENT_PERCENTAGE_SQL, [req.query.student_id], (err, row) => {
        if (err) { return console.error(err.message); }

        const response = row;
        res.json(response);
    });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
