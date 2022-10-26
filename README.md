# Classroom Tracking System (CSE 5242, Group 4)

Realtime classroom tracking system that feeds the live student results of an online quiz to a live instructor dashboard that measures the performance of the class.

Students are assumed to be in a physical classroom with groups of desks within close proximity of each other. Suspiciously similar answer markings among proximally close students are flagged as "Hotspots" to the teacher to be reviewed.

## Student View
Students open an online quiz form that first asks for their name and seat group number. Students are able to answer the quiz questions one-at-a-time and submit at the end.

## Instructor View
Instructors open an online dashboard that shows two measures:
1. **Correct Answer Percentage** for a given filter, including the whole class (Total), by individual students, by student group, and by question.
2. **Hotspots** that were detected over the course of the quiz. These are events triggered by multiple students in the *same group* marking the *same incorrect answer* within a *small timeframe*.

# Installation

## Prerequisites
Before running anything, ensure that the following technologies are all installed and available to use on the command line:
+ Node.js
+ ActiveMQ
+ SQLite

## Node Package Installations
The following directories are Node.js projects and need package installations underneath accordingly. Simply run `npm install` under each of these directories:
+ `broker-to-db/`
+ `classroom-tracking`

## Running the System
To run the entire system, each of the following components need to be started in the correct order:
1. ActiveMQ Broker
2. Broker to DB Mapper
3. Student Quiz and Instructor Dashboard

# Project Structure
This system is divided into the following components:
+ Student Quiz Form
+ Message Broker
+ Broker-to-Database Mapper
+ Quiz Results Database
+ Instructor Dashboard

The diagram below summarizes the high-level architecture created by these components:

![System High-Level Architecture](/images/project-architecture.jpg)
