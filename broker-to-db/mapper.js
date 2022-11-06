/**
 * Script that consumes ActiveMQ JSON messages and maps them to insertions
 * into the given SQLite database.
 */

// Dependencies
const Stomp = require("stomp-client");
const sqlite3 = require("sqlite3");

/*************
 * Constants *
 *************/

// List of columns that go into the student and answer queries.
const STUDENT_FIELDS = ["student_id", "first_name", "last_name", "seat_group_no"];
const ANSWER_FIELDS = ["question_id", "student_id", "student_answer"];

// SQL for inserting info for a student taking the quiz.
const STUDENT_QUERY = `INSERT INTO Student(${STUDENT_FIELDS.toString()})` +
                      `VALUES(${STUDENT_FIELDS.map((x) => "?").join(",")})`;

// SQL for inserting info for a student answer to a question.
const ANSWER_QUERY = `INSERT INTO Student_Answer(${ANSWER_FIELDS.toString()})` +
                     `VALUES(${ANSWER_FIELDS.map((x) => "?").join(",")})`;

const DB_PATH = "../db/quiz.db";
const TOPIC_PATH = "/queue/quiz_results";


/****************
 * Main Program *
 ****************/

// Connect to the SQLite databse.
const db = new sqlite3.Database(DB_PATH, sqlite3.OPEN_READWRITE, (err) => {
    if (err) {console.error(err.message); return; }
    console.log('Connected to SQLite db.');
});

// Connect to the broker and retrieve JSON messages.
const stompClient = new Stomp();
stompClient.connect((sessionId) => {
    console.log(`Consumer connected, at sesssion ${sessionId}.`);

    /**
     * Callback function that runs for each JSON message consumed by the
     * ActiveMQ broker. Parses the message body and runs the corresponding
     * INSERT query into the DB.
     * @param {string} body
     */
    function insertPayloadIntoDB(body) {
        const bodyParsed = JSON.parse(body);
        const queryToRun = "first_name" in bodyParsed ? STUDENT_QUERY : ANSWER_QUERY;
        const fieldsToCheck = "first_name" in bodyParsed ? STUDENT_FIELDS : ANSWER_FIELDS;

        // Check that the JSON has every field required before running a query.
        fieldsToCheck.forEach((field) => {
            if (!(field in bodyParsed)) {
                console.error(`Missing field ${field} in JSON Payload. Insertion denied.`);
                return;
            };
        });

        // If all fields exist, run the insertion query.
        db.run(queryToRun, Object.values(bodyParsed));
    }

    stompClient.subscribe(TOPIC_PATH, insertPayloadIntoDB);
});
