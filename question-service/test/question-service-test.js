const chai = require("chai");
const chaiHttp = require("chai-http");
const index = require("../index.js");
const expect = chai.expect;
const db = require("../mongo-db.js");

chai.use(chaiHttp);
chai.should();

// Mock user and token for testing
const testUser = {
    username: "testuser",
};

const jwt = require('jsonwebtoken');
const jwtSecretKey = process.env.JWT_SECRET_KEY;

const generateAuthToken = (user) => {
    return jwt.sign({ user }, jwtSecretKey);
};

describe("Test Question Service", function () {
    let addQuestion = {
        id: 999,
        title: 'Test Question',
        description: 'Test Description',
        categories: 'Data Structures',
        complexity: 'Hard'
    };

    let deleteQuestion = {
        id: 999
    };

    it("Should get questions", done => {
        // Generate an authentication token for the test user
        const authToken = generateAuthToken(testUser);

        chai
            .request(index)
            .get("/question/getQuestions")
            .set('Cookie', `token=${authToken}`) 
            .end((err, res) => {
                expect(res.status).to.equal(200); 
                done();
            });
    });

    it("Should add question", done => {
        // Generate an authentication token for the test user
        const authToken = generateAuthToken(testUser);

        chai
            .request(index)
            .post("/question/addQuestion")
            .set('Cookie', `token=${authToken}`) 
            .send(addQuestion)
            .end((err, res) => {
                expect(res.status).to.equal(201);
                done();
            });
    });

    it("Should delete question", done => {
        // Generate an authentication token for the test user
        const authToken = generateAuthToken(testUser);

        chai
            .request(index)
            .post("/question/deleteQuestion")
            .set('Cookie', `token=${authToken}`) 
            .send(deleteQuestion)
            .end((err, res) => {
                expect(res.status).to.equal(201); 
                done();
            });
    });
});
