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

const authToken = generateAuthToken(testUser);

describe("Test Question Service", function () {
    let nextQuestionId;

    before(async () => {
        const response = await chai
            .request(index)
            .get("/question/getMaxQuestionId")
            .set('Cookie', `token=${authToken}`);

        expect(response.status).to.equal(200);
        nextQuestionId = response.body.maxQuestionId + 1;
    });

    it("Should add a new question", async () => {
        const addQuestion = {
            id: nextQuestionId,
            title: 'Test Question',
            description: 'Test Description',
            categories: ['Data Structures'],
            complexity: 'Hard'
        };

        const response = await chai
            .request(index)
            .post("/question/addQuestion")
            .set('Cookie', `token=${authToken}`)
            .send(addQuestion);

        expect(response.status).to.equal(201);
    });

    it("Should not add questions with empty parameters", async () => {
        const emptyParamQuestion = {
            
        }

        const response = await chai
            .request(index)
            .post("/question/addQuestion")
            .set('Cookie', `token=${authToken}`)
            .send(emptyParamQuestion)
        expect(response.status).to.equal(401);
    })

    it("Should delete question with id", async () => {
        const deleteQuestion = {
            id: nextQuestionId,
        };

        const response = await chai
            .request(index)
            .post("/question/deleteQuestion")
            .set('Cookie', `token=${authToken}`)
            .send(deleteQuestion);

        expect(response.status).to.equal(201)
    });

    it("Should not delete question that doesn't exist", async () => {
        const deletedQuestion = {
            id: nextQuestionId
        }

        const response = await chai
            .request(index)
            .post("/question/deleteQuestion")
            .set('Cookie', `token=${authToken}`)
            .send(deletedQuestion);

        expect(response.status).to.equal(404);

    })

    it("Should get questions", async () => {
        const getQuestions = {
            page: 1,
            pageSize: 10
        }

        const response = await chai
            .request(index)
            .post("/question/getQuestions")
            .set('Cookie', `token=${authToken}`)
            .send(getQuestions);

        expect(response.status).to.equal(200);
    })

});
