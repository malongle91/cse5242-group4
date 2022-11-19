const Stomp = require("stomp-client");
const process = require("process");

const STOMP_URL = '127.0.0.1';
const PORT = 61613;
const TOPIC = "/queue/quiz_results";

const ANSWERS = ["A", "B", "C", "D"];
const NUM_QUESTIONS = 10;

/**
 * A Producer object simulates a student taking a quiz that
 * submits answers every second.
 */
class Producer {
    constructor(studentId, fname, lname, seatGroupNo) {
        this.studentId = studentId;
        this.fname = fname;
        this.lname = lname;
        this.seatGroupNo = seatGroupNo;
        this.stompClient = new Stomp(STOMP_URL, PORT);
    }

    async connectAndStartQuiz() {
        this.stompClient.connect(await this.simulateQuiz.bind(this));
    }

    async simulateQuiz() {
        console.log(`Producer ${this.studentId} connected`);
        const student = {
            "student_id": this.studentId,
            "first_name": this.fname,
            "last_name": this.lname,
            "seat_group_no": this.seatGroupNo
        };

        this.stompClient.publish(TOPIC, JSON.stringify(student));

        var student_answer = {
            "question_id": 0,
            "student_id": this.studentId,
            "student_answer": "",
            "answer_time": 0
        };

        for (let i = 1; i <= NUM_QUESTIONS; i++) {
            student_answer["question_id"] = i;
            student_answer["student_answer"] = ANSWERS[Math.floor(Math.random() * 4)];
            student_answer["answer_time"] = Math.floor(Date.now() / 1000);

            await new Promise(resolve => setTimeout(resolve, 1000));
            this.stompClient.publish(TOPIC, JSON.stringify(student_answer));
        }

        console.log(`Quiz complete, Producer ${this.studentId}`);
        this.stompClient.disconnect();
        process.kill(process.pid);
    }
}

module.exports = Producer;