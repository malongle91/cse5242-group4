-- Non-Hotspot Case, Single-Person Group, Incorrect Answer.
-- Expected: No new hotspots.
INSERT INTO Student_Answer (question_id, student_id, student_answer, answer_time)
VALUES (5, 'loner.1', 'C', unixepoch());

-- Non-Hotspot Case, Single-Person Group, Correct Answer.
-- Expected: No new hotspots.
INSERT INTO Student_Answer (question_id, student_id, student_answer, answer_time)
VALUES (6, 'loner.1', 'C', unixepoch());

-- Non-Hotspot Case, Two-Person Group, Both Correct in Separate Timeframes.
-- Expected: No new hotspots.
INSERT INTO Student_Answer (question_id, student_id, student_answer, answer_time)
VALUES (1, 'clinton.1', 'C', 20),
       (1, 'clinton.2', 'C', 55);

-- Non-Hotspot Case, Two-Person Group, Both Correct in Close Timeframes.
-- Expected: No new hotspots.
INSERT INTO Student_Answer (question_id, student_id, student_answer, answer_time)
VALUES (2, 'clinton.1', 'C', 20),
       (2, 'clinton.2', 'C', 25);

-- Non-Hotspot Case, Two-Person Group, Both Incorrect in Close Timeframes with different answers.
-- Expected: No new hotspots.
INSERT INTO Student_Answer (question_id, student_id, student_answer, answer_time)
VALUES (3, 'clinton.1', 'A', 20),
       (3, 'clinton.2', 'B', 25);

-- Non-Hotspot Case, Two-Person Group, One Incorrect in Close Timeframes with different answers.
-- Expected: No new hotspots.
INSERT INTO Student_Answer (question_id, student_id, student_answer, answer_time)
VALUES (4, 'clinton.1', 'A', 20),
       (4, 'clinton.2', 'B', 25);

-- Non-Hotspot Case, Two-Person Group, Both Incorrect in Separate Timeframes with same answer.
-- Expected: No new hotspots.
INSERT INTO Student_Answer (question_id, student_id, student_answer, answer_time)
VALUES (5, 'clinton.1', 'A', 20),
       (5, 'clinton.2', 'A', 55);

-- Hotspot Case, Two-Person Group, Both Incorrect in Close Timeframes with same answer.
-- Expected: New hotspot with two entries for two students.
INSERT INTO Student_Answer (question_id, student_id, student_answer, answer_time)
VALUES (6, 'clinton.1', 'A', 20),
       (6, 'clinton.2', 'A', 25);

-- Non-hotspot Case, Separate Groups, Both Incorrect in Close Timeframes with same answer.
-- Expected: No new hotspots.
INSERT INTO Student_Answer (question_id, student_id, student_answer, answer_time)
VALUES (7, 'clinton.1', 'A', 20),
       (7, 'loner.1', 'A', 25);

-- Hotspot Case, Three-Person Group, Two Incorrect (same answer) and One Correct in Close Timeframes.
-- Expected: New hotspot with only two entries for two students.
INSERT INTO Student_Answer (question_id, student_id, student_answer, answer_time)
VALUES (1, 'dylan.1', 'A', 20),
       (1, 'simon.2', 'A', 25),
       (1, 'garfunkel.3', 'B', 30);

-- Hotspot Case, Three-Person Group, Three Incorrect (same answer) in Close Timeframes.
-- Expected: New hotspot with three entries for three students.
INSERT INTO Student_Answer (question_id, student_id, student_answer, answer_time)
VALUES (2, 'dylan.1', 'A', 20),
       (2, 'simon.2', 'A', 25),
       (2, 'garfunkel.3', 'A', 30);

-- Hotspot Case, Three-Person Group, Three Incorrect (same answer), but One in Separate Timeframe.
-- Expected: New hotspot with only two entries for two students.
INSERT INTO Student_Answer (question_id, student_id, student_answer, answer_time)
VALUES (3, 'dylan.1', 'A', 20),
       (3, 'simon.2', 'A', 25),
       (3, 'garfunkel.3', 'A', 60);

-- Non-hotspot Case, Three-Person Group, Two correct, One incorrect in Close Timeframes.
-- Expected: No new hotspots.
INSERT INTO Student_Answer (question_id, student_id, student_answer, answer_time)
VALUES (4, 'dylan.1', 'A', 20),
       (4, 'simon.2', 'A', 25),
       (4, 'garfunkel.3', 'B', 30);