#!/usr/bin/env node

var amqp = require('amqplib/callback_api');

var matchReqDict = {
    Easy: null,
    Medium: null,
    Hard: null
};
var firstCorrId = null;
var firstReplyTo = null;

amqp.connect(process.env.CLOUDAMQP_URL, function(error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }
        var queue = 'rpc_queue';

        channel.assertQueue(queue, {
            durable: false
        });
        channel.prefetch(1);
        console.log(' [x] Awaiting RPC requests');
        channel.consume(queue, function reply(msg) {
            const { username, complexity } = JSON.parse(msg.content);

            console.log(" [.] username:%s, complexity:%s", username, complexity);

            if (matchReqDict[complexity] != null & matchReqDict[complexity] != username) {
                // send to second client
                channel.sendToQueue(msg.properties.replyTo,
                    Buffer.from(matchReqDict[complexity]), {
                        correlationId: msg.properties.correlationId
                    });
                // send to first client
                channel.sendToQueue(firstReplyTo,
                    Buffer.from(username), {
                        correlationId: firstCorrId
                    });
                matchReqDict[complexity] = null;
                firstCorrId = null;
                firstReplyTo = null;
                
            } else if (matchReqDict[complexity] == null) {
                matchReqDict[complexity] = username;
                firstCorrId = msg.properties.correlationId;
                firstReplyTo = msg.properties.replyTo;
                setTimeout(() => {
                    matchReqDict[complexity] = null;
                    
                    channel.sendToQueue(msg.properties.replyTo,
                        Buffer.from('no match'), {
                            correlationId: msg.properties.correlationId
                        });
                }, 30000)
            }

            channel.ack(msg);
        });
    });
});
