#!/usr/bin/env node
require('dotenv').config();
var amqp = require('amqplib/callback_api');

function createUserReq(username, complexity, timeOfReq, replyTo) {
    const newCorrelationId = generateUuid();
    const userReq = {
        username : username,
        complexity : complexity,
        timeOfReq : timeOfReq,
        correlationId : newCorrelationId,
        replyTo : replyTo,
        isValid : true
    };
    return userReq;
}

async function sendMatchingRequest(username, complexity, timeOfReq) {
    return new Promise((resolve, reject) => {
        amqp.connect(process.env.CLOUDAMQP_URL + "?heartbeat=60", function(error0, connection) {
            if (error0) {
                console.error('Error connecting to AMQP:', error0);
                reject(error0);
                return;
            }
            console.log('Client connected to Cloud AMQP');
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

                    const userReq = createUserReq(username, complexity, timeOfReq, q.queue);
                    console.log(' [client] Requesting user: %s, complexity: %s, time of request: %s', username.toString(), complexity, timeOfReq.toString());

                    // listen for responses from the server
                    channel.consume(q.queue, function(msg) {
                        if (msg.properties.correlationId === userReq.correlationId) {
                            response = JSON.parse(msg.content);
                    
                            console.log(' [client %s] Server response: %s', username, response.message);

                            resolve(msg.content);
                            connection.close();
                        }
                    }, {
                        noAck: true
                    });
                    
                    channel.sendToQueue('rpc_queue',
                        Buffer.from(JSON.stringify(userReq)), {
                            correlationId: userReq.correlationId,
                            replyTo: userReq.replyTo
                        });
                    console.log(' [client %s] Sent request to rpc_queue', username);
                });
            });
        });
    });
}


function generateUuid() {
    return Math.random().toString() +
        Math.random().toString() +
        Math.random().toString();
}

module.exports = { sendMatchingRequest }