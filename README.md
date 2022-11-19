# Classroom Tracking System (CSE 5242, Group 4)

Realtime classroom tracking system that feeds the live student results of an online quiz to a live instructor dashboard that measures the performance of the class.

Students are assumed to be in a physical classroom with groups of desks within close proximity of each other. Suspiciously similar answer markings among proximally close students are flagged as "Hotspots" to the teacher to be reviewed.

## Student View
Students open an online quiz form that first asks for their name and seat group number. Students are able to answer the quiz questions one-at-a-time and submit at the end.

## Instructor View
Instructors open an online dashboard that shows two measures:
1. **Correct Answer Percentage** for a given filter, including the whole class (Total), by individual students, by student group, and by question.
2. **Hotspots** that were detected over the course of the quiz. These are events triggered by multiple students in the *same group* marking the *same incorrect answer* within a *small timeframe*.

# Installation and Use
The follow section describes the process of running this application on a Windows device.

## Prerequisites
Before running anything, ensure that the following technologies are all installed and available to use on the command line:
+ [Node.js](https://nodejs.org/en/)
+ [ActiveMQ](https://activemq.apache.org) (The "Classic" version)
+ [SQLite](https://www.sqlite.org/index.html)

## Node Package Installations
The following directories are Node.js projects and need package installations underneath accordingly. Simply run `npm install` under each of these directories:
+ `broker-to-db/`
+ `classroom-tracking/`
+ `instructor-dashboard/`

### Dependencies
See the `package.json` file under each of these directories for their package dependencies, which include the following but are not limited to:
+ [react](https://reactjs.org/)
+ [stomp-client](https://github.com/easternbloc/node-stomp-client#readme)
+ [stompjs](https://github.com/stomp-js/stompjs)
+ [sqlite3](https://github.com/TryGhost/node-sqlite3)

## Running the System
To run the entire system, each of the following components need to be started in the correct order:
1. ActiveMQ Broker
   - Open a command window under the directory that contains the ActiveMQ binary (should be under the `bin/` subdirectory of the ActiveMQ directory).
   - Run `activemq start` in the command line to start the local broker server.
   - This local server can be monitored by navigating to `http://localhost:8161/admin/` on your web browser.

2. Broker to DB Mapper
   - Open a command window under the directory, `broker-to-db`.
   - Run `node mapper.js` to start the mapper script.
   - The console will issue a message stating whether it has connected successfully both to the local ActiveMQ server and the SQLite database.

3. Student Quiz Instance
   - Open a command window under the directory, `student-quiz`.
   - Run `npm start` to run the React student quiz app.
   - The console will issue a message stating whether it has connected successfully to the local ActiveMQ server.

4. Instructor Dashboard
   - Open a command window under the directory, `instructor-dashboard/src`.
   - Run the API for communicating the the database using `node server.js`.
   - Open the `index.html` file in your web browser.


# Project Structure
This system is divided into the following components:
+ **Student Quiz Form** - The student quiz (written in React) takes in the student's id, name, and seating group assigned before entering the user into a multiple-choice quiz. The student's answers are forwarded through the system in realtime, eventually making their way to the instructor dashboard.

+ **Message Broker** - This project uses ActiveMQ to a message broker on the local machine. The purpose of this broker is to handle the stream of data coming from the student quiz instances at a resonable capacity, receiving the data and forwarding it to eventually be stored by the database.

+ **Broker-to-Database Mapper** - This script is to be run in a Node.js environment as a single instance. The purpose of this script is to receive the forwarded data from the message broker (which includes student information and student answers to individual questions), and map the data into the appropriate fields to be inserted into the database.

+ **Quiz Results Database** - An SQLite database stores student information and their progress on the quiz, which is to be queried by the instructor dashboard in realtime for analytical information. The database stores information such as the student's name and id, the correct answers to the quiz, the students' answers to each question, and potential hotspots found for detecting cheating.

+ **Instructor Dashboard** - Finally, the instructor dashboard queries the database and displays the realtime results (refreshed within short time intervals) of the students taking the quiz, including correct answer percentages by various filters and detected hotspots.

The diagram below summarizes the high-level architecture created by these components:

![System High-Level Architecture](/images/project-architecture.jpg)

# Testing and Evaluation
The system is tested for correctness and performance using the following:

+ **Database Test Cases** - The `db/test` directory contains some manual test cases that are used to check for
correct trigger behavior.

+ **Capacity Test Script** - Located under `capacity-test` is a Node.js script, `producer_runner.js`, for load testing that
simulates a specified number of students all connecting to the ActiveMQ broker and taking a quiz.