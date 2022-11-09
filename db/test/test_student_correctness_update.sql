-- Correct Answer Case.
-- Expected: num_answered == 1, num_correct == 1.
INSERT INTO Student_Answer (question_id, student_id, student_answer, answer_time)
VALUES (1, 'loner.1', 'C', unixepoch());

-- Incorrect Answer Case.
-- Expected: num_answered == 2, num_correct == 1
INSERT INTO Student_Answer (question_id, student_id, student_answer, answer_time)
VALUES (2, 'loner.1', 'A', unixepoch());

-- Correct Answer Case.
-- Expected: num_answered == 3, num_correct = 2.
INSERT INTO Student_Answer (question_id, student_id, student_answer, answer_time)
VALUES (3, 'loner.1', 'C', unixepoch());

-- Incorrect Answer Case.
-- Expected: num_answered == 4, num_correct = 2.
INSERT INTO Student_Answer (question_id, student_id, student_answer, answer_time)
VALUES (4, 'loner.1', 'C', unixepoch());
