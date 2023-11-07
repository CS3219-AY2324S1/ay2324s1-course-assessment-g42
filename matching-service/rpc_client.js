#!/usr/bin/env node
require('dotenv').config();
var amqp = require('amqplib/callback_api');

function createUserReq(username, matchCriteria, timeOfReq) {
    const userReq = {
        username : username,
        matchCriteria : matchCriteria,
        timeOfReq : timeOfReq,
    };
    return userReq;
}

function sendMatchingRequest(username, complexity, language, timeOfReq) {
    amqp.connect(process.env.LOCALAMQP_URL, function(error0, connection) {
        if (error0) {
            console.error('Error connecting to AMQP:', error0);
            reject(error0);
            return;
        }
        console.log(` [client ${username}] Connected to AMQP`);
        connection.createChannel(function(error1, channel) {
            if (error1) {
                console.error('Error creating channel:', error1);
                reject(error1);
                connection.close();
                return;
            }
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
        });
    });
}

module.exports = { sendMatchingRequest }