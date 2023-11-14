const chai = require("chai");
const chaiHttp = require("chai-http");
const index = require("../index.js");
const expect = chai.expect;
let should = chai.should();
const db = require("../psql-db.js");

chai.use(chaiHttp);
chai.should();

const testUser = {
    username: "admin",
};

const jwt = require('jsonwebtoken');
const jwtSecretKey = process.env.JWT_SECRET_KEY;

const generateAuthToken = (user) => {
    return jwt.sign({ user }, jwtSecretKey);
};

const authToken = generateAuthToken(testUser);

describe("Test History Service", function () {

    it("Should save attempt into history", async() => {
        const saveAttempt = {
            username: 'admin',
            collaborated: 'historyTestUser',
            title: 'test',
            qnId: 1,
            difficulty: 'Hard',
            language: 'JavaScript',
            attempt: 'testing123',
            date: '11/14/2023'
        }
        const response = await chai
            .request(index)
            .post("/history/saveAttempt")
            .set('Cookie', `token=${authToken}`)
            .send(saveAttempt);
        
        expect(response.status).to.equal(200);
    });

    it("Should not save attempt if not authenticated", async() => {
        const saveAttempt = {
            username: 'admin',
            collaborated: 'historyTestUser',
            title: 'test',
            qnId: 1,
            difficulty: 'Hard',
            language: 'JavaScript',
            attempt: 'testing123'
        }
        const response = await chai
            .request(index)
            .post("/history/saveAttempt")
            .send(saveAttempt);
        
        expect(response.status).to.equal(401);
    });

    it("Should get question history", async() => {
        const testUser = {
            username: 'admin'
        }

        const response = await chai
            .request(index)
            .post("/history/getHistory")
            .set('Cookie', `token=${authToken}`)
            .send(testUser);
    
        expect(response.status).to.equal(200);
    });

    it("Should not get question history if not authenticated", async() => {
        const testUser = {
            username: 'admin'
        }
        
        const response = await chai
            .request(index)
            .post("/history/getHistory")
            .send(testUser);
    
        expect(response.status).to.equal(401);
    });

    after("Delete saved attempt", async() => {
        let deleteAttempt = {
            username: 'admin',
            collaborated: 'historyTestUser',
            title: 'test'
        };

        const response = await chai
            .request(index)
            .post("/history/deleteHistory")
            .set('Cookie', `token=${authToken}`)
            .send(deleteAttempt);
        
        expect(response.status).to.equal(200);
        
    });
})