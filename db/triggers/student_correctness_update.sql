/*
 * Trigger to update the student's correct and total answered count
 * upon answering a new question.
 */
CREATE TRIGGER student_correctness_update
    AFTER INSERT ON Student_Answer
BEGIN
    UPDATE Student
    SET num_answered = num_answered + 1,
        num_correct =
        num_correct + IIF(
            new.student_answer =
                (SELECT correct_answer FROM Question q WHERE q.question_id = new.question_id),
            1, 0)
    WHERE Student.student_id = new.student_id;
end;