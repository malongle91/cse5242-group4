CREATE TABLE IF NOT EXISTS Student (
    student_id text PRIMARY KEY NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    seat_group_no INTEGER NOT NULL,
    num_answered INTEGER DEFAULT 0 NOT NULL,
    num_correct INTEGER DEFAULT 0 NOT NULL,
);

CREATE TABLE IF NOT EXISTS Question ( 
    question_id INTEGER PRIMARY KEY NOT NULL, 
    correct_answer CHAR NOT NULL CHECK (correct_answer IN ('A', 'B', 'C', 'D'))
);

CREATE TABLE IF NOT EXISTS Student_Answer (
    question_id INTEGER NOT NULL,
    student_id text NOT NULL,
    student_answer CHAR NOT NULL CHECK (student_answer IN ('A', 'B', 'C', 'D', 'X')),
    answer_time INTEGER DEFAULT 0 NOT NULL,
    PRIMARY KEY (question_id, student_id),
    FOREIGN KEY(question_id) REFERENCES Question(question_id),
    FOREIGN KEY(student_id) REFERENCES Student(student_id)
);

CREATE TABLE IF NOT EXISTS Hotspot (
    seat_group_no INTEGER NOT NULL,
    question_id INTEGER NOT NULL,
    student_id text NOT NULL,
    incorrect_answer CHAR NOT NULL CHECK (incorrect_answer IN ('A', 'B', 'C', 'D')),
    hotspot_time text default '1970-01-01 00:00:00' NOT NULL,
    PRIMARY KEY(seat_group_no, question_id, student_id),
    FOREIGN KEY(seat_group_no) REFERENCES Student(seat_group_no),
    FOREIGN KEY (question_id) REFERENCES Question(question_id),
    FOREIGN KEY(student_id) REFERENCES Student(student_id)
);