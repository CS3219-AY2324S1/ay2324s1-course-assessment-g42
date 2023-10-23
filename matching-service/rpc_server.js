#!/usr/bin/env node
require('dotenv').config();
var amqp = require('amqplib/callback_api');

const MAX_TIME = 29800;
const queue = 'rpc_queue';
var consumerMap = new Map(); // track the consumers and first user request received

function calculateTimeLeft(timeOfReq) {
    const currTime = new Date().getTime();
    return MAX_TIME - (currTime - timeOfReq);
}

function isReqTimeValid(timeOfReq) {
    const currTime = new Date().getTime();
    return (currTime - timeOfReq) < MAX_TIME;
}

function isValidMatch(userReq, consumerTag) {
    return !isFirstUserReq(consumerTag) && !isDuplicateUser(userReq);
}

function isFirstUserReq(consumerTag) {
    return !consumerMap.has(consumerTag) || consumerMap.get(consumerTag) == null;
}

function isDuplicateUser(userReq) {
    const consumerArray = [...consumerMap.keys()];
    for (const consumer of consumerArray) {
        if (consumerMap.get(consumer) != null && consumerMap.get(consumer).username == userReq.username) {
            return true;
        }
    }
    return false;
}

function findDuplicateUser(userReq) {
    const consumerArray = [...consumerMap.keys()];
    for (const consumerTag of consumerArray) {
        if (consumerMap.get(consumerTag) != null && consumerMap.get(consumerTag).username == userReq.username) {
            return consumerTag;
        }
    }
}

function handleMatchFound(firstUserReq, secondUserReq, channel, consumerTag) {
    console.log(` [consumer ${consumerTag}] matched ${firstUserReq.username} and ${secondUserReq.username}`);
    const roomId = generateUuid();
    const firstUserRes = {
        isMatchFound : true,
        username : secondUserReq.username,
        roomId : roomId,
        message : 'Matched with ' + secondUserReq.username + '!'
    }
    const secondUserRes = {
        isMatchFound : true,
        username : firstUserReq.username,
        roomId : roomId,
        message :'Matched with ' + firstUserReq.username + '!'
    }
    // send match to second user
    channel.sendToQueue(secondUserReq.replyTo,
        Buffer.from(JSON.stringify(secondUserRes)), {
            correlationId: secondUserReq.correlationId
        });
    // send match to first user
    channel.sendToQueue(firstUserReq.replyTo,
        Buffer.from(JSON.stringify(firstUserRes)), {
            correlationId: firstUserReq.correlationId
        });
    consumerMap.set(consumerTag, null);
}

function handleIsFirstUserReq(userReq, channel, consumerTag) {
    consumerMap.set(consumerTag, userReq);
    setTimeout(() => {
        const response = {
            isMatchFound : false,
            username : '',
            roomId : null,
            message : 'No match found. Try again in a while!'
        }
        if (consumerMap.get(consumerTag) == userReq) {
            channel.sendToQueue(userReq.replyTo,
                Buffer.from(JSON.stringify(response)), {
                    correlationId: userReq.correlationId
                });
            console.log(` [consumer ${consumerTag}] No match found. Deleting ${consumerTag}.`);
            channel.cancel(consumerTag);
            consumerMap.delete(consumerTag);
        }
    }
    , calculateTimeLeft(userReq.timeOfReq));
}

function handleDuplicateRequest(firstUserReq, secondUserReq, channel, consumerTag1, consumerTag2) {
    console.log(` [consumer ${consumerTag2}] Duplicate user request found, terminating first request.`);
    consumerMap.set(consumerTag1, null);
    consumerMap.set(consumerTag2, secondUserReq);
    const response = {
        isMatchFound : false,
        username : '',
        roomId : null,
        message : 'You are waiting in another tab! We will take your latest request.'
    };
    channel.sendToQueue(firstUserReq.replyTo,
        Buffer.from(JSON.stringify(response)), {
            correlationId: firstUserReq.correlationId
        });
}

function handleExpiredRequest(userReq, channel) {
    console.log(' [server] User request expired.');
    const response = {
        isMatchFound : false,
        username : '',
        roomId : null,
        message : 'Your request expired before reaching our server!'
    };
    channel.sendToQueue(userReq.replyTo,
        Buffer.from(JSON.stringify(response)), {
            correlationId: userReq.correlationId
        });
}

function generateUuid() {
    return Math.random().toString() +
        Math.random().toString() +
        Math.random().toString();
}

function createConsumer(queue, channel) {
    const consumerTag = `${queue}_consumer`;
    channel.consume(queue, function reply(msg) {
        const userReq = JSON.parse(msg.content);
        console.log(`  [Consumer ${consumerTag}] Got username:${userReq.username}, complexity:${userReq.complexity}, time of request:${userReq.timeOfReq}`);
        
        const isNotTimeOut = isReqTimeValid(userReq.timeOfReq);
        const isDuplicate = isDuplicateUser(userReq);
        if (isDuplicate) {
            const consumerTag1 = findDuplicateUser(userReq)
            handleDuplicateRequest(consumerMap.get(consumerTag1), userReq, channel, consumerTag1, consumerTag);
        }

        if (isNotTimeOut && isValidMatch(userReq, consumerTag)) {
            handleMatchFound(consumerMap.get(consumerTag), userReq, channel, consumerTag);
        } else if ((isDuplicate || isFirstUserReq(consumerTag)) && isNotTimeOut) {
            handleIsFirstUserReq(userReq, channel, consumerTag);
        } else if (!isNotTimeOut) {
            handleExpiredRequest(userReq, channel);
        } else {
            console.log('Unknown error');
        }
    }, {
        consumerTag: consumerTag,
        noAck: true
    });

}

function runServer() {
    console.log('Starting matching server');
    amqp.connect(process.env.CLOUDAMQP_URL + "?heartbeat=60", function(error0, connection) {
        if (error0) {
            throw error0;
        }
        console.log('Server Connected to CloudAMQP');
        connection.createChannel(function(error1, channel) {
            if (error1) {
                throw error1;
            }
            
            channel.assertQueue(queue, {
                durable: true
            }, function(err, q) {
                console.log(' [server] Number of messages in queue: ' + q.messageCount);
            });
            channel.prefetch(1);
            
            console.log(' [server] Awaiting RPC requests');
            
            channel.consume(queue, function reply(msg) {
                console.log(' [server] Consumer map: ');
                console.log(consumerMap)
                const userReq = JSON.parse(msg.content);
                console.log(" [server] Got username:%s, complexity:%s, time of request: %s", userReq.username.toString(), userReq.complexity, userReq.timeOfReq.toString());
                
                channel.assertQueue(queue, {
                    durable: true
                }, function(err, q) {
                    if (err) {
                        throw err;
                    }
                    console.log(' [server] Number of messages left in queue: ' + q.messageCount);
                });
                const isNotTimeOut = isReqTimeValid(userReq.timeOfReq); // checl if request expired before reaching server
                
                if (isNotTimeOut) {
                    // create queue for matchCriteria
                    const matchCriteria = userReq.complexity;
                    channel.assertQueue(matchCriteria, {
                        autoDelete: true
                    }, function (err, q) {
                        channel.sendToQueue(matchCriteria, Buffer.from(JSON.stringify(userReq)));
                        const consumerTag = `${matchCriteria}_consumer`;
                        if (!consumerMap.has(consumerTag)) {
                            console.log(' [server] Creating a new consumer ', consumerTag);
                            createConsumer(matchCriteria, channel);
                        }
                    });
                } else {
                    handleExpiredRequest(userReq, channel);
                }
                channel.ack(msg);
            }, {
                consumerTag: 'main-server'
            });
        });
    });
}

module.exports = { runServer }