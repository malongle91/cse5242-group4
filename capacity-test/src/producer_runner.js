const cluster = require('cluster');
const Producer = require('./producer.js');

const NUM_PROCESSES = 250;
const NUM_GROUPS = 50;
const GROUP_START = 1;
const LNAME = 'smith'

if (cluster.isMaster) {
    // Each worker process represents a student taking a quiz.
    for (var i = 0; i < NUM_PROCESSES; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.id} died.`);
    });

} else if (cluster.isWorker) {
    const workerid = cluster.worker.id;
    const studentGroupNo = workerid % NUM_GROUPS + GROUP_START;

    // For each worker process, create a new student that simulates taking a quiz.
    const producer = new Producer(`${LNAME}.${workerid}`, `${workerid}`, `${LNAME}`, studentGroupNo);
    producer.connectAndStartQuiz();
}
