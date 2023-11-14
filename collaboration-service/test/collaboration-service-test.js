const chai = require("chai");
const index = require("../index.js");
const expect = chai.expect;
var io = require('socket.io-client');
var socketURL = 'http://0.0.0.0:5002';

var options = {
  path: "/collaboration/socket.io",
  transports: ['websocket'],
  'force new connection': true
};

describe("Test Collaboration Service", function() {
  let roomName = "testRoom";
  let language = "JavaScript";
  let user1Str = "user1";
  let user2Str = "user2";
  let user1;
  let user2;

  before('Create room with two users', done => {
    user1 = io.connect(socketURL, options);
    
    user1.on('connect', () => {
      user1.emit('join-room', roomName, user1Str, language);
      user2 = io.connect(socketURL, options);

      user2.on('connect', () => {
        user2.emit('join-room', roomName, user2Str, language);
      })
    })

    user1.on('inform-connect', (username) => {
      expect(username).to.equal(user2Str);
      done();
    })
  });

  it('Should allow other users to connect to another room', done => {
    let otherRoom = "testRoom2";
    let otherUser1 = io.connect(socketURL, options);

    otherUser1.on('connect', () => {
      otherUser1.emit('join-room', otherRoom, 'other1', language);
      let otherUser2 = io.connect(socketURL, options);

      otherUser2.on('connect', () => {
        otherUser2.emit('join-room', otherRoom, 'other2', language);
      })
    })

    otherUser1.on('inform-connect', (username) => {
      expect(username).to.equal('other2');
      done();
    })    
  });

  it('Should not allow an invalid user', done => {
    let invalidUser = io.connect(socketURL, options);

    invalidUser.on('connect', () => {
      invalidUser.emit('join-room', roomName, 'invalidUser', language);
    });

    invalidUser.on('invalid-user', () => {
      invalidUser.disconnect();
      done();
    });

  });

  it('Should broadcast code to the other user', done => {
    let testCode = "this is a test code";

    user2.on('code-change', (code) => {
      expect(code).to.equal(testCode);
      done();
    });

    user1.emit('code-change', roomName, testCode);
  });

  it('Should store question from first user', done => {
    let questionId = 5;

    user2.on('generate-question', (id) => {
      expect(id).to.equal(questionId);
      done();
    });

    user1.emit('generate-question', roomName, questionId);
  });

  it('Should not store question from second user', done => {
    let questionId = 8;
    let storedId = 5;

    user1.on('generate-question', (id) => {
      expect(id).to.equal(storedId);
      done();
    })

    user2.emit('generate-question', roomName, questionId);
  });

  it('Should broadcast info to users', done => {
    let storedId = 5;

    user2.on('get-info', (room) => {
      expect(room.language).to.equal(language);
      expect(room.qnId).to.equal(storedId);
      expect(room.user1).to.equal(user1Str);
      expect(room.user2).to.equal(user2Str);
      expect(room.isUser1Present).to.equal(true);
      expect(room.isUser2Present).to.equal(true);
      done();
    })

    user1.emit('get-info', roomName);
  });

  it('Should inform other user of disconnect', done => {
    let disconnectedUser = user2Str;

    user1.on('inform-disconnect', (username) => {
      expect(username).to.equal(disconnectedUser);
      done();
    })

    user2.emit('disconnect-client', roomName, disconnectedUser);
  });

  it('Should change user state on disconnect', done => {
    let externalUser = io.connect(socketURL, options);

    user1.on('get-info', (room) => {
      expect(room.isUser2Present).to.equal(false);
      expect(room.user2).to.equal(user2Str);
      externalUser.disconnect();
      done();
    })

    externalUser.on('connect', () => {
      externalUser.emit('get-info', roomName);
    })   
  });

  after('Disconnect users', done => {
    user1.disconnect();
    user2.disconnect();
    done();
  });
})