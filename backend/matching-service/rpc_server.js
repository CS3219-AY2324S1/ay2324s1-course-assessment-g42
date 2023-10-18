#!/usr/bin/env node
require('dotenv').config();
var amqp = require('amqplib/callback_api');

var matchReqDict = {
    Easy: null,
    Medium: null,
    Hard: null
};
var firstCorrId = null;
var firstReplyTo = null;

amqp.connect(process.env.CLOUDAMQP_URL + "?heartbeat=60", function(error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }
        var queue = 'rpc_queue';
        var qObj = null;
        channel.assertQueue(queue, {
            durable: false
        }, function(err, q) {
            qObj = q;
            console.log(' [x] Number of messages in queue: ' + q.messageCount);
        });
        channel.prefetch(1);
        
        console.log(' [x] Awaiting RPC requests');
        channel.consume(queue, function reply(msg) {
            console.log(' [.] dict before matching process');
            console.log(matchReqDict);
            const { userObj, complexity, timeOfReq } = JSON.parse(msg.content);
            console.log(" [.] Got message from queue - username:%s, complexity:%s, time of request: %s", userObj.username.toString(), complexity, timeOfReq.toString());
            channel.assertQueue(queue, {
                durable: false
            }, function(err, q) {
                qObj = q;
                console.log(' [.] Number of messages left in queue: ' + q.messageCount);
            });
    
            const currTime = new Date().getTime();
            const timeDiff = currTime - timeOfReq;
            const isValidReq = timeDiff < 29500;

            if (isValidReq && (matchReqDict[complexity] != null && matchReqDict[complexity] != userObj)) {
                // send to second client
                channel.sendToQueue(msg.properties.replyTo,
                    Buffer.from(matchReqDict[complexity].username.toString()), {
                        correlationId: msg.properties.correlationId
                    });
                // send to first client
                channel.sendToQueue(firstReplyTo,
                    Buffer.from(userObj.username.toString()), {
                        correlationId: firstCorrId
                    });
                matchReqDict[complexity] = null;
                firstCorrId = null;
                firstReplyTo = null;
                
            } else if (matchReqDict[complexity] == null && isValidReq) {
                matchReqDict[complexity] = userObj;
                firstCorrId = msg.properties.correlationId;
                firstReplyTo = msg.properties.replyTo;
                setTimeout(() => {
                    matchReqDict[complexity] = null;
                    console.log(' [.] no match found, removed user from dict');
                    console.log(matchReqDict);
                    channel.sendToQueue(msg.properties.replyTo,
                        Buffer.from('no match'), {
                            correlationId: msg.properties.correlationId
                        });
                }, 29900 - timeDiff);
            }
            console.log(' [.] dict after matching process');
            console.log(matchReqDict);

            channel.ack(msg);
        });
    });
});
