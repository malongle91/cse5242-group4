-- Creating triggers to updating their score, figuring out how many questions they have gotten right 

CREATE TRIGGER student_update
    AFTER INSERT ON Student_Answer
    -- WHEN student_answer == 'X'
BEGIN
    -- insert the value into the Student_Answer table based on the question_id
    SELECT NEW.student_id
        CASE 
            WHEN NEW.student_answer == (
                SELECT correct_answer
                FROM Question as Q, Student_Answer as S
                WHERE Q.question_id = S.question_id) THEN
                Select NEW.student_id
        END;
END;

-- testing which one is better
CREATE TRIGGER student_update
    AFTER INSERT ON Student_Answer
    WHEN NEW.student_answer == (
                SELECT correct_answer
                FROM Question as Q, Student_Answer as S
                WHERE Q.question_id = S.question_id) THEN
                Select NEW.student_id
BEGIN
    -- insert the value into the Student_Answer table based on the question_id
    UPDATE Student
    SET num_correct = num_correct + 1 
    -- WHERE NEW.student_answer = correct_answer   
    -- increment correct num
    
END;

-- create trigger hotspot
CREATE TRIGGER hotspot
    AFTER INSERT ON Student_Answer
BEGIN

    -- query on the group no and question 
    SELECT NEW.question_id
    FROM (
        SELECT question_id
        FROM Question
        WHERE 
    
    -- Get the question, find the question in the question table and get the answer.
    -- check to see if the student got the answer correct. 
    -- if wrong check if anyone in that group_no got the same answer as them 

END;