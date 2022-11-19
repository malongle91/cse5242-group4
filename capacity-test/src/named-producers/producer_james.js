const Stomp = require("stomp-client");

const stompClient = new Stomp("127.0.0.1", 61613);

const ANSWERS = ["A", "B", "C", "D"]

stompClient.connect(async function () {
    console.log("James client connected.");

    const student = {
        "student_id": "james.1",
        "first_name": "Lebron",
        "last_name": "James",
        "seat_group_no": 2
    }

    const student_answer = {
        "question_id": 1,
        "student_id": "james.1",
        "student_answer": "B",
        "answer_time": Math.floor(Date.now() / 1000)
    }
    
    await stompClient.publish("/queue/quiz_results", JSON.stringify(student));
    
    for(let i = 1; i <= 10; i++) {
        student_answer["question_id"] = i;
        student_answer["student_answer"] = ANSWERS[Math.floor(Math.random() * 4)];
        student_answer["answer_time"] = Math.floor(Date.now() / 1000);

        //console.log("waiting");

        await new Promise(resolve => setTimeout(resolve, 1000));

        //console.log("done waiting");

        await stompClient.publish("/queue/quiz_results", JSON.stringify(student_answer));
    } 
    console.log("Quiz complete")

    stompClient.disconnect();
});
