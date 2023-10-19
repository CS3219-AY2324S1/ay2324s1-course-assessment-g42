#!/usr/bin/env node
require('dotenv').config();
var amqp = require('amqplib/callback_api');

function main(userObj, complexity, timeOfReq) {
    return new Promise((resolve, reject) => {
        var ans = 'none';
        amqp.connect(process.env.CLOUDAMQP_URL + "?heartbeat=60", function(error0, connection) {
            if (error0) {
                throw error0;
            }
            console.log('Client connected to Cloud AMQP');
            connection.createChannel(function(error1, channel) {
                if (error1) {
                    throw error1;
                }
                channel.assertQueue('', {
                    exclusive: true
                }, function(error2, q) {
                    if (error2) {
                        throw error2;
                    }
                    var correlationId = generateUuid();

                    console.log(' [.] Requesting user: %s, complexity: %s, time of request: %s', userObj.username.toString(), complexity, timeOfReq.toString());
                    
                    channel.consume(q.queue, function(msg) {
                        if (msg.properties.correlationId === correlationId) {
                            ans = msg.content.toString();
                            console.log(' [.] Got %s', msg.content.toString());
                            setTimeout(function() {
                                connection.close();
                            }, 500);
                            resolve(ans);
                        }
                    }, {
                        noAck: true
                    });
                    const message = JSON.stringify({ userObj, complexity, timeOfReq });
                    
                    channel.sendToQueue('rpc_queue',
                        Buffer.from(message), {
                            correlationId: correlationId,
                            replyTo: q.queue
                        });
                    console.log(' [.] sent to rpc_queue');
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

module.exports = { main }