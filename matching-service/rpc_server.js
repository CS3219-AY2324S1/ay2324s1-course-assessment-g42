#!/usr/bin/env node
require('dotenv').config();
var amqp = require('amqplib/callback_api');

const COMPLEXITY_LIST = ['Easy', 'Medium', 'Hard'];
const MAX_TIME = 29900;
const queue = 'rpc_queue';

function calculateTimeLeft(timeOfReq) {
    const currTime = new Date().getTime();
    return MAX_TIME - (currTime - timeOfReq);
}

function isReqTimeValid(timeOfReq) {
    const currTime = new Date().getTime();
    return (currTime - timeOfReq) < MAX_TIME;
}

function isValidMatch(matchReqDict, userReq) {
    return !isFirstUserReq(matchReqDict, userReq.complexity) && !isDuplicateUser(matchReqDict, userReq.username);
}

function isFirstUserReq(matchReqDict, complexity) {
    return matchReqDict[complexity] == null;
}

function isDuplicateUser(matchReqDict, username) {
    for (i in COMPLEXITY_LIST) {
        const complexity = COMPLEXITY_LIST[i];
        if (matchReqDict[complexity] != null && matchReqDict[complexity].username == username) {
            return true;
        }
    }
    return false;
}

function findDuplicateUserInDict(matchReqDict, username) {
    for (i in COMPLEXITY_LIST) {
        const complexity = COMPLEXITY_LIST[i];
        if (matchReqDict[complexity] != null && matchReqDict[complexity].username == username) {
            return matchReqDict[complexity];
        }
    }
    return null;
}

function handleMatchFound(matchReqDict, firstUserReq, secondUserReq, channel) {
    console.log(' [.] matched ' + firstUserReq.username + ' and ' + secondUserReq.username);
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
    
    matchReqDict[firstUserReq.complexity] = null;
    console.log(' [.] dict after process');
    console.log(matchReqDict);
}

function handleIsFirstUserReq(matchReqDict, userReq, channel) {
    matchReqDict[userReq.complexity] = userReq;
    setTimeout(() => {
        if (userReq.isValid) {
            matchReqDict[userReq.complexity] = null;
            console.log(' [server] no match found, removed user from dict');
            console.log(matchReqDict);

            const response = {
                isMatchFound : false,
                username : '',
                roomId : null,
                message : 'No match found. Try again in a while!'
            }
            channel.sendToQueue(userReq.replyTo,
                Buffer.from(JSON.stringify(response)), {
                    correlationId: userReq.correlationId
                });
        }
    }, calculateTimeLeft(userReq.timeOfReq));
}

function handleDuplicateRequest(matchReqDict, firstUserReq, secondUserReq, channel) {
    console.log(' [server] Duplicate user request found, terminating first request.');
    matchReqDict[firstUserReq.complexity].isValid = false;
    matchReqDict[firstUserReq.complexity] = null;
    matchReqDict[secondUserReq.complexity] = secondUserReq;
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
                durable: false
            }, function(err, q) {
                console.log(' [server] Number of messages in queue: ' + q.messageCount);
            });
            channel.prefetch(1);
            
            console.log(' [server] Awaiting RPC requests');

            var matchReqDict = {
                Easy: null,
                Medium: null,
                Hard: null
            };

            channel.consume(queue, function reply(msg) {
                console.log(' [server] dict before matching process');
                console.log(matchReqDict);
                const userReq = JSON.parse(msg.content);
                console.log(" [server] Got message from queue - username:%s, complexity:%s, time of request: %s", userReq.username.toString(), userReq.complexity, userReq.timeOfReq.toString());
                channel.assertQueue(queue, {
                    durable: false
                }, function(err, q) {
                    console.log(' [server] Number of messages left in queue: ' + q.messageCount);
                });
        
                const isNotTimeOut = isReqTimeValid(userReq.timeOfReq);

                const isDuplicate = isDuplicateUser(matchReqDict, userReq.username);
                if (isDuplicate) {
                    handleDuplicateRequest(matchReqDict, findDuplicateUserInDict(matchReqDict, userReq.username), userReq, channel);
                }

                if (isNotTimeOut && isValidMatch(matchReqDict, userReq)) {
                    const firstUserReq = matchReqDict[userReq.complexity];
                    handleMatchFound(matchReqDict, firstUserReq, userReq, channel);
                } else if ((isDuplicate || isFirstUserReq(matchReqDict, userReq.complexity)) && isNotTimeOut) {
                    handleIsFirstUserReq(matchReqDict, userReq, channel);
                } else if (!isNotTimeOut) {
                    handleExpiredRequest(userReq, channel);
                } else {
                    console.log('Unknown error');
                }
    
                channel.ack(msg);
            });
        });
    });
}

module.exports = { runServer }