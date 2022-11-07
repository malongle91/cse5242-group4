import React, { useState } from "react";
import "./App.css";
const Stomp = require('stompjs');

const STOMP_URL = 'ws://127.0.0.1:61614';
const TOPIC_PATH = '/queue/quiz_results';

const LOCAL_HEADERS = {
  "Access-Control-Allow-Origin": "*",
};

const client = Stomp.client(STOMP_URL);
client.connect(LOCAL_HEADERS, () => { console.log("Connected to ActiveMQ.") });

function App() {
  // Properties
  const [showResults, setShowResults] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [startQuiz, setStartQuiz] = useState(true);
  const [studentId, setStudentId] = useState('');

  const questions = [
    {
      text: "What is the capital of America?",
      options: [
        { id: 0, text: "New York City", isCorrect: false },
        { id: 1, text: "Boston", isCorrect: false },
        { id: 2, text: "Santa Fe", isCorrect: false },
        { id: 3, text: "Washington DC", isCorrect: true },
      ],
    },
    {
      text: "What year was the Constitution of America written?",
      options: [
        { id: 0, text: "1787", isCorrect: true },
        { id: 1, text: "1776", isCorrect: false },
        { id: 2, text: "1774", isCorrect: false },
        { id: 3, text: "1826", isCorrect: false },
      ],
    },
    {
      text: "Who was the second president of the US?",
      options: [
        { id: 0, text: "John Adams", isCorrect: true },
        { id: 1, text: "Paul Revere", isCorrect: false },
        { id: 2, text: "Thomas Jefferson", isCorrect: false },
        { id: 3, text: "Benjamin Franklin", isCorrect: false },
      ],
    },
    {
      text: "What is the largest state in the US?",
      options: [
        { id: 0, text: "California", isCorrect: false },
        { id: 1, text: "Alaska", isCorrect: true },
        { id: 2, text: "Texas", isCorrect: false },
        { id: 3, text: "Montana", isCorrect: false },
      ],
    },
    {
      text: "Which of the following countries DO NOT border the US?",
      options: [
        { id: 0, text: "Canada", isCorrect: false },
        { id: 1, text: "Russia", isCorrect: true },
        { id: 2, text: "Cuba", isCorrect: true },
        { id: 3, text: "Mexico", isCorrect: false },
      ],
    },
  ];

  // Helper Functions

  /* A possible answer was clicked */
  const optionClicked = (isCorrect) => {
    // Increment the score
    if (isCorrect) {
      setScore(score + 1);
    }

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  /* Resets the game back to default */
  const restartGame = () => {
    setScore(0);
    setCurrentQuestion(0);
    setStartQuiz(true);
    setShowResults(false);
  };

  const sendStudent = (msg) => {
    client.send(TOPIC_PATH, LOCAL_HEADERS, JSON.stringify(msg));
  }

  const sendStudentAnswer = (msg) => {
    var message = {
      "question_id": (currentQuestion + 1),
      "student_id": studentId,
      "student_answer": String.fromCharCode(65 + msg.id) // Ranges from 'A' to 'D'.
    };
    client.send(TOPIC_PATH, LOCAL_HEADERS, JSON.stringify(message));
  }

  return (
    <div className="App">
      {startQuiz ? (
        <div className="form">
          <form onSubmit={() => {
            setStudentId(document.getElementById("studentID").value);
            setStartQuiz(false);
            sendStudent({
              "student_id": document.getElementById("studentID").value,
              "first_name": document.getElementById("fname").value,
              "last_name": document.getElementById("lname").value,
              "seat_group_no": parseInt(document.getElementById("seatGroup").value),
            });
          }}>
            <br />
            <label htmlFor="fname">First Name: </label>
            <input type="text" id="fname" name="fname" required/>
            <br />
            <label htmlFor="lname">Last Name: </label>
            <input type="text" id="lname" name="lname" required/>
            <br />
            <label htmlFor="studentID">Student Id: </label>
            <input type="text" id="studentID" name="studentID" required/>
            <br />
            <label htmlFor="seatGroup">Seat Group: </label>
            <input type="number" id="seatGroup" name="seatGroup" required/>
            <br />
            <input type="submit" value="Submit"/>
          </form>
        </div>

      ) : (
        <div>
          {/* 1. Header  */}
          <h1>USA Quiz 🇺🇸</h1>

          {/* 2. Current Score  */}
          <h2>Score: {score}</h2>

          {/* 3. Show results or show the question game  */}
          {showResults ? (
            /* 4. Final Results */
            <div className="final-results">
              <h1>Final Results</h1>
              <h2>
                {score} out of {questions.length} correct - (
                {(score / questions.length) * 100}%)
              </h2>
              <button onClick={() => restartGame()}>Restart game</button>
            </div>
          ) : (
            /* 5. Question Card  */
            <div className="question-card">
              {/* Current Question  */}
              <h2>
                Question: {currentQuestion + 1} out of {questions.length}
              </h2>
              <h3 className="question-text">{questions[currentQuestion].text}</h3>

              {/* List of possible answers  */}
              <ul>
                {questions[currentQuestion].options.map((option) => {
                  return (
                    <li
                      key={option.id}
                      onClick={() => {
                        optionClicked(option.isCorrect);
                        sendStudentAnswer(option);
                      }}
                    >
                      {option.text}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      )}

    </div>
  );
}

export default App;