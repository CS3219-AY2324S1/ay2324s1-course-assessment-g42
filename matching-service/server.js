#!/usr/bin/env node
require('dotenv').config();
const { io } = require("socket.io-client");

const MAX_TIME = 30000; 
const matchCriteriaList = ['Easy-JavaScript', 'Easy-Python', 'Easy-C', 'Medium-JavaScript', 'Medium-Python', 'Medium-C', 'Hard-JavaScript', 'Hard-Python', 'Hard-C'];
var consumerMap = new Map(); // track the consumers and first user request received
var socket = null;

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

function handleMatchFound(firstUserReq, secondUserReq, consumerTag) {
    console.log(` [consumer ${consumerTag}] matched ${firstUserReq.username} and ${secondUserReq.username}`);
    const roomId = generateUuid();
    const message1 = 'Matched with ' + secondUserReq.username + '!';
    const message2 = 'Matched with ' + firstUserReq.username + '!';

    // send match to socket
    socket.emit('match-found', firstUserReq.username, secondUserReq.username, roomId, message1, message2);
    
    consumerMap.set(consumerTag, null);  // update first userReq received to null
    console.log(` [consumer ${consumerTag}] Matched ${firstUserReq.username} and ${secondUserReq.username}`);
    console.log(` [consumer ${consumerTag}] Removed first user request from consumerMap:`);
    console.log(consumerMap);
}

function handleIsFirstUserReq(userReq, consumerTag) {
    consumerMap.set(consumerTag, userReq);  // set first userReq received
    console.log(` [consumer ${consumerTag}] First user request is waiting for match, updated in consumerMap`);
    console.log(consumerMap);

    // wait until timeout for match
    setTimeout(() => {
        if (consumerMap.get(consumerTag) == userReq) {
            console.log(` [consumer ${consumerTag}] No match found. Deleting ${consumerTag}.`);
            consumerMap.set(consumerTag, null);
            console.log(consumerMap);
        }
    }
    , calculateTimeLeft(userReq.timeOfReq));
}

function handleExpiredRequest(userReq) {
    console.log(` [server] User request from ${userReq.username} expired.`);
}

function generateUuid() {
    return Math.random().toString() +
        Math.random().toString() +
        Math.random().toString();
}

function createConsumer(queue, channel) {
    const consumerTag = `${queue}-consumer`;

    channel.consume(queue, function reply(msg) {
        const userReq = JSON.parse(msg.content);
        console.log(` [consumer ${consumerTag}] Got username:${userReq.username}, matchCriteria:${userReq.matchCriteria}, time of request:${userReq.timeOfReq}`);
        
        const isNotTimeOut = isReqTimeValid(userReq.timeOfReq);   // check if the request expired before reaching the server

        if (isNotTimeOut && isValidMatch(userReq, consumerTag)) {
            handleMatchFound(consumerMap.get(consumerTag), userReq, consumerTag);
        } else if (isFirstUserReq(consumerTag) && isNotTimeOut) {
            handleIsFirstUserReq(userReq, consumerTag);
        } else if (!isNotTimeOut) {
            handleExpiredRequest(userReq);
        } else {
            console.log('Unknown error');
        }
    }, {
        consumerTag: consumerTag,
        noAck: true
    });

}

function runServer(channel) {
    console.log('Starting matching server');
    
    channel.prefetch(1);
    
    console.log(' [server] Consumer map: ');
    console.log(consumerMap)

    // create queues for matchCriterias
    for (const matchCriteria of matchCriteriaList) {
        channel.assertQueue(matchCriteria, {
            autoDelete: true
        }, function (err, q) {
            if (err) {
                throw err;
            }

            const numOfMessages = q.messageCount;
            console.log(` [server] Number of messages in ${matchCriteria} queue: ${numOfMessages}`);

            // send match request to the specific queue based on matchCriteria
            const consumerTag = `${matchCriteria}_consumer`;
            // each queue should only have one consumer, check no consumer exists for that queue before creating
            if (!consumerMap.has(consumerTag)) {
                console.log(' [server] Creating a new consumer ', consumerTag);
                createConsumer(matchCriteria, channel);
            }
        });
    }

    // connect to socket
    socket = io('http://34.117.214.12/match',  { transports : ['websocket'] });
    console.log(' [server] Connected to socket');
}

module.exports = { runServer }