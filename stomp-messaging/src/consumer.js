const Stomp = require("stomp-client");

const stompClient = new Stomp("127.0.0.1", 61613);

stompClient.connect(function(sessionId) {
    console.log("Consumer connected.");

    const extractMessageParams = function (body, headers) {
        console.log(body);
        console.log(headers);

        const bodyParsed = JSON.parse(body);
        console.log(bodyParsed);

        const label = bodyParsed.label;
        console.log(label);

        const name = "name" in bodyParsed ? bodyParsed.name : "Name missing.";
        console.log(name);
    };

    stompClient.subscribe("/queue/notifications", extractMessageParams);
})