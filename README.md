# Classroom Tracking System (CSE 5242, Group 4)

Realtime classroom tracking system that feeds the live student results of an
online quiz to a live instructor dashboard that measures the performance of the class.

Students are assumed to be in a physical classroom with groups of desks within
close proximity of each other. Suspiciously similar answer markings among proximally
close students are flagged as "Hotspots" to the teacher to be reviewed.

## Student View
Students open an online quiz form that first asks for their name and seat group number.
Students are able to answer the quiz questions one-at-a-time until the end.

## Instructor View
Instructors open an online dashboard that shows two key measures of student
progress and activity: **(1) Correctness Percentage** and **(2) Hotspots** under
different filters, which are selectable by a dropdown menu:

+ **The Whole Class** - Under this filter, instructors will see a table of all
students taking the quiz, each row including the student id, first and last name,
number of questions answered, number of correct answers, and correctness percentage.
Instructors can also see a list of all hotspot entries over the course of the quiz.
+ **By Student Id** - Under this filter, instructors can filter the above information
by a particular student, including any hotspots the student is associated with.
+ **By Question** - Under this filter, instructors will see a list of students
who have answered the specified question correctly, as well as a list of hotspots
associated with that question.
+ **Seating Group** - Under this filter, instructors will see a list of students
within the specified seat group, excluding each student's quiz progress. Instructors
will also see the hotspots associated with this group.

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
+ `instructor-dashboard/`
+ `student-quiz/`

### Dependencies
See the `package.json` file under each of these directories for their package dependencies, which include the following but are not limited to:
+ [react](https://reactjs.org/)
+ [stomp-client](https://github.com/easternbloc/node-stomp-client#readme)
+ [stompjs](https://github.com/stomp-js/stompjs)
+ [sqlite3](https://github.com/TryGhost/node-sqlite3)
+ [express](https://expressjs.com/)
+ [response-time](https://www.npmjs.com/package/response-time)

## Running the System
To run the entire system, each of the following components need to be started in the correct order:
1. ActiveMQ Broker
   - Open a command window under the directory that contains the ActiveMQ binary (should be under the `bin/` subdirectory of the ActiveMQ directory).
   - Run `activemq start` in the command line to start the local broker server.
   - This local server can be monitored by navigating to `http://localhost:8161/admin/` on your web browser.
   - Note: Ensure that this broker can be connected to via.
   the STOMP protocol and web sockets (this should be enabled by default).

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
   - Run the API for communicating with the database using `node server.js`.
   - Open the `index.html` file in your web browser.


# Project Structure
This system is divided into the following components:
+ **Student Quiz Form** - The student quiz (written in React) takes in the student's id, name, and seating group assigned before entering the user into a multiple-choice quiz. The student's answers are forwarded through the system in realtime, eventually making their way to the instructor dashboard.

    + Note that the **quiz questions** and correct answers are manually defined here, under `student-quiz/src/questions.json`.
    It is up to the user to enter the correct answer info consistently between this quiz definition and the questions
    table of the results database.

+ **Message Broker** - This project uses ActiveMQ to a message broker on the local machine. The purpose of this broker is to handle the stream of data coming from the student quiz instances at a resonable capacity, receiving the data and forwarding it to eventually be stored by the database.

+ **Broker-to-Database Mapper** - This script is to be run in a Node.js environment as a single instance. The purpose of this script is to receive the forwarded data from the message broker (which includes student information and student answers to individual questions), and map the data into the appropriate fields to be inserted into the database.

+ **Quiz Results Database** - An SQLite database stores student information and their progress on the quiz, which is to be queried by the instructor dashboard in realtime for analytical information. The database stores information such as the student's name and id, the correct answers to the quiz, the students' answers to each question, and potential hotspots found for detecting cheating.
  + Note: For testing purposes, the Database on this repository includes some **seed data** with it that reflects a 10-question quiz, a handful of students and student answers, and some hotspots.

+ **Instructor Dashboard** - Finally, the instructor dashboard queries the database and displays the realtime results
of the students taking the quiz, including correct answer percentages by various filters and detected hotspots.
To run the script, make sure you are in the `/instructor-dashboard/src` folder and run `node server.js`. This will
connect an Express API to the database, which the dashboard relies on to retrieve data from OLAP queries.
Once this is done, you can open the `instructor-dashboard/src/index.html` page in a web browser. This will open the
dashboard for the instructors.
  + You will have to refresh the dashboard using the refresh button to update results
  when students submit their questions and the quiz. The dashboard has a filter where you can view the data of the whole
  class, each student's performance, seat group performance, and based on each question. The hotspot will also be display
  on each view which is a display of which students we think are cheating.  

The diagram below summarizes the high-level architecture created by these components:

![System High-Level Architecture](/images/project-architecture.png)

# Testing and Evaluation
The system is tested for correctness, latency, and capacity using the following:

+ **Database Test Cases** - The `db/test` directory contains some manual test cases that are used to check for
correct trigger behavior. The CSV data located under `db/seed-data` reflects the result of running these test cases
starting with the given questions and students.

+ **Latency Measures** - Unix millisecond timestamps are placed in the Student Quiz and Mapper to measure the latency of
a student submitting their information or answer to a question. Similarly, a response-time middleware is used
in the instructor-dashboard API to measure the latency of each OLAP query endpoint.

+ **Capacity Test Script** - Located under `capacity-test` is a Node.js script, `producer_runner.js`, for load testing, that
simulates a specified number of students all connecting to the ActiveMQ broker and taking a quiz.