#!/usr/bin/env node
require('dotenv').config();

function createUserReq(username, matchCriteria, timeOfReq) {
    const userReq = {
        username : username,
        matchCriteria : matchCriteria,
        timeOfReq : timeOfReq,
    };
    return userReq;
}

function sendMatchingRequest(username, complexity, language, timeOfReq, channel) {
    channel.assertQueue('', {
        exclusive: true
    }, async function(error2, q) {
        if (error2) {
            throw error2;
        }

        const matchCriteria = complexity + '-' + language;
        const userReq = createUserReq(username, matchCriteria, timeOfReq);
        console.log(` [client ${username}] Requesting user:${username}, matchCriteria:${matchCriteria}, time of request:${timeOfReq}`);

        // send match request to the server
        channel.sendToQueue(matchCriteria,
            Buffer.from(JSON.stringify(userReq)));
        console.log(` [client ${username}] Sent request to ${matchCriteria} queue`);
    });
}

module.exports = { sendMatchingRequest }