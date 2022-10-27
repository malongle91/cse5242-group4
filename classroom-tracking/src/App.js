import React, { useState } from "react";
import "./App.css";

function App() {

// const Stomp = require("stomp-client");

// const stompClient = new Stomp("127.0.0.1", 61613);

// stompClient.connect(function () {
//     console.log("Producer connected.");

//     const notification = {
//         label: "You have a new notification!",
//         name: "Bob Dylan",
//     };

//     const notificationJSON = JSON.stringify(notification);

//     stompClient.publish("/queue/notifications", notificationJSON);

//     stompClient.disconnect();
// });
  // Properties
  const [showResults, setShowResults] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [startQuiz, setStartQuiz] = useState(true)
  const [userProperties, setUserProperties] = useState({
    fname: '',
    lname: '',
    studentID: '',
    seatGroup: ''
  });

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

  
  const handleChange = event => {
    const value = event.target.value;
    setUserProperties({
      ...userProperties,
      [event.target.name]:value,
    })
  }
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
    setShowResults(false);
  };

  return (
    <div className="App">

      { startQuiz ? ( 
        <div className="form">
          <form>
            <br/>
            <label for="fname">First name:</label>
            <input type="text" id="fname" name="fname" onChange={handleChange}/>
            <label for="lname">Last name:</label>            
            <input type="text" id="lname" name="lname" onChange={handleChange}/>
            <label for="studentID">Student id:</label>
            <input type="text" id="studentID" name="studentID" onChange={handleChange}/>
            <label for="seatGroup">Seat group:</label>
            <input type="text" id="seatGroup" name="seatGroup" onChange={handleChange}/>
            <br/>
            <button onClick={()=>{setStartQuiz(false)}}>Submit</button>
          </form>
          {console.log(userProperties.fname)}
        </div>
        
      ):(
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
            onClick={() => optionClicked(option.isCorrect)}
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