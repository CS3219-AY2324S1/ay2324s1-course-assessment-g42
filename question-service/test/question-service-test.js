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

    it("Should not get Max Question Id if not authenticated", async () => {
        const response = await chai
            .request(index)
            .get("/question/getMaxQuestionId");

        expect(response.status).to.equal(401);
    });

    it("Should get Max Question Id", async () => {
        const response = await chai
            .request(index)
            .get("/question/getMaxQuestionId")
            .set('Cookie', `token=${authToken}`);

        expect(response.status).to.equal(200);
        nextQuestionId = response.body.maxQuestionId + 1;
    });

    it("Should not add questions if not authenticated", async () => {
        const dummyAdd = {
            id: nextQuestionId,
            title: 'Dummy Test Question',
            description: 'Other Test Description',
            categories: ['Data Structures', 'Array'],
            complexity: 'Hard'
        };

        const response = await chai
            .request(index)
            .post("/question/addQuestion")
            .send(dummyAdd);
        
        expect(response.status).to.equal(401);
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

    it("Should not add question with duplicate title", async () => {
        const addQuestion = {
            id: nextQuestionId,
            title: 'Test Question',
            description: 'Other Test Description',
            categories: ['Data Structures', 'Array'],
            complexity: 'Hard'
        };
  
        const response = await chai
            .request(index)
            .post("/question/addQuestion")
            .set('Cookie', `token=${authToken}`)
            .send(addQuestion);
  
        expect(response.status).to.equal(409);
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
    });

    it("Should not delete question if not authenticated", async () => {
        const dummyDelete = {
            id: nextQuestionId
        }

        const response = await chai
            .request(index)
            .post("/question/deleteQuestion")
            .send(dummyDelete);
        
        expect(response.status).to.equal(401);
    });

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
    });

    it("Should not get questions if not authenticated", async () => {
        const getQuestions = {
            page: 1,
            pageSize: 10
        }

        const response = await chai
            .request(index)
            .get("/question/getQuestions")
            .send(getQuestions);

        expect(response.status).to.equal(401);
    });

    it("Should get questions", async () => {
        const getQuestions = {
            page: 1,
            pageSize: 10
        }

        const response = await chai
            .request(index)
            .get("/question/getQuestions")
            .set('Cookie', `token=${authToken}`)
            .send(getQuestions);
            
        expect(response.status).to.equal(200);
    });

    it("Should not get questions if invalid page or page size", async() => {
        const invalidGet = {

        }

        const response = await chai
            .request(index)
            .get("/question/getQuestions")
            .set('Cookie', `token=${authToken}`)
            .send(invalidGet);

        expect(response.status).to.equal(400);
    });

    it("Should not get a random question of given difficulty if not authenticated", async() => {
        const dummyGet = {

        }

        const response = await chai
            .request(index)
            .get("/question/getQuestions")
            .send(dummyGet);

        expect(response.status).to.equal(401);
    })

    it("Should get a random question of easy difficulty", async() => {
        const getEasyComplexity = {
            complexity: 'Easy'
        }

        const response = await chai
            .request(index)
            .post("/question/getQuestionByComplexity")
            .set('Cookie', `token=${authToken}`)
            .send(getEasyComplexity);

        expect(response.status).to.equal(200);
    });

    it("Should get a random question of medium difficulty", async() => {
        const getMediumComplexity = {
            complexity: 'Medium'
        }

        const response = await chai
            .request(index)
            .post("/question/getQuestionByComplexity")
            .set('Cookie', `token=${authToken}`)
            .send(getMediumComplexity)
        
        expect(response.status).to.equal(200);
    });

    it("Should get a random question of hard difficulty", async() => {
        const getHardComplexity = {
            complexity: 'Hard'
        }

        const response = await chai
            .request(index)
            .post("/question/getQuestionByComplexity")
            .set('Cookie', `token=${authToken}`)
            .send(getHardComplexity)
        
        expect(response.status).to.equal(200);
    });

    it("Should not get a random question of invalid difficutly", async() => {
        const getInvalidComplexity = {
            complexity: 'Invalid'
        }

        const response = await chai
            .request(index)
            .post("/question/getQuestionByComplexity")
            .set('Cookie', `token=${authToken}`)
            .send(getInvalidComplexity)
    
        expect(response.status).to.equal(402);
    });
});
