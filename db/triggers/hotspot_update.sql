/*
 * Trigger to create a hotspot upon insertion of a new student answer
 * if the trigger finds a student of the same group who has gotten
 * the same wrong answer on the same question.
 */
CREATE TRIGGER hotspot_update
    BEFORE INSERT
    ON Student_Answer
    -- Condition 1: Student's answer to given question is wrong.
    -- Condition 2: There exists another student answer in the same group with the same wrong answer.
    WHEN (new.student_answer != (SELECT correct_answer
                                 FROM Question q
                                 WHERE q.question_id = new.question_id))
        AND EXISTS(
                 SELECT *
                 FROM (SELECT seat_group_no AS no FROM Student WHERE student_id = new.student_id) AS target_group,
                      (Student_Answer sa NATURAL JOIN Student s)
                 WHERE sa.question_id = new.question_id
                   AND sa.student_answer = new.student_answer
                   AND s.seat_group_no = target_group.no
                   AND (new.answer_time - sa.answer_time) < 30
             )
BEGIN
    -- Insert into Hotspot the names of the students in the same group who have the
    -- same wrong answer to the given question.
    INSERT OR IGNORE INTO Hotspot (seat_group_no, question_id, student_id, incorrect_answer, hotspot_time)
    SELECT no, new.question_id, student_id, new.student_answer, datetime(new.answer_time, 'unixepoch')
    FROM (SELECT seat_group_no AS no FROM Student WHERE student_id = new.student_id) AS target_group,
         (Student s NATURAL JOIN Student_Answer sa)
    WHERE sa.question_id = new.question_id
      AND sa.student_answer = new.student_answer
      AND s.seat_group_no = target_group.no;

    -- Include the student who triggered the hotspot.
    INSERT INTO Hotspot (seat_group_no, question_id, student_id, incorrect_answer, hotspot_time)
    VALUES ((SELECT seat_group_no AS no FROM Student WHERE student_id = new.student_id), new.question_id,
            new.student_id, new.student_answer, datetime(new.answer_time, 'unixepoch'));
end;