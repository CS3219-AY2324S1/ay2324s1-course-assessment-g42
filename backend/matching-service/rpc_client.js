#!/usr/bin/env node
function main(username, complexity) {
    return new Promise((resolve, reject) => {
        var amqp = require('amqplib/callback_api');

        var ans = 'none';
        amqp.connect(process.env.COULDAMQP_URL, function(error0, connection) {
            if (error0) {
                throw error0;
            }
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

                    console.log(' [x] Requesting user(%s)', username);
                    
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
                    const message = JSON.stringify({ username, complexity });
                    channel.sendToQueue('rpc_queue',
                        Buffer.from(message), {
                            correlationId: correlationId,
                            replyTo: q.queue
                        });
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