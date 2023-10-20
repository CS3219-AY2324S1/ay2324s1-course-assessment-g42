const chai = require("chai");
const chaiHttp = require("chai-http");
const index = require("../index.js");
const expect = chai.expect;
let should = chai.should();
const db = require("../psql-db.js");

chai.use(chaiHttp);
chai.should();

describe("Test User Service", function () {
    let agent; //session preservation

    it("Should register testUser", done => {
        let registerUser = {
            username: "testUser",
            email: "testUser@gmail.com",
            password: "testUser123",
            password2: "testUser123",
            role: "user"
        }

        chai
            .request(index)
            .post("/user/register")
            .send(registerUser)
            .end((err, res) => {
                expect(res.status).to.equal(200); // Assert the status code
                done();
            });
    });

    it("Should not register user with same email", done => {
        let registerUser = {
            username: "testUser",
            email: "testUser@gmail.com",
            password: "testUser123",
            password2: "testUser123",
            role: "user"
        }

        chai
            .request(index)
            .post("/user/register")
            .send(registerUser)
            .end((err, res) => {
                expect(res.status).to.equal(409);
                done();
            });
    });

    it("Should not register user with password too short", done => {
        let registerUserBlankPassword = {
            username: "testUser2",
            email: "testUser2@gmail.com",
            password: "",
            password2: "",
            role: "user"
        }

        chai
            .request(index)
            .post("/user/register")
            .send(registerUserBlankPassword)
            .end((err, res) => {
                expect(res.status).to.equal(403);
                done();
            })
    })

    it("Should not register user with passwords not matching", done => {
        let registerUserMismatchedPassword = {
            username: "testUser2",
            email: "testUser2@gmail.com",
            password: "testUser2",
            password2: "testUser123",
            role: "user"
        }

        chai
            .request(index)
            .post("/user/register")
            .send(registerUserMismatchedPassword)
            .end((err, res) => {
                expect(res.status).to.equal(400);
                done();
            })
    })

    it("Should login testUser", done => {
        let loginUser = {
            email: "testUser@gmail.com",
            password: "testUser123",
        }

        agent = chai.request.agent(index); // Create an agent to maintain the session
    
        agent
            .post("/user/login")
            .send(loginUser)
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            })
    });

    it("Should not login user does not exist", done => {
        let loginUser2 = {
            email: "testUser2@gmail.com",
            password: "testUser123",
        }

        chai
            .request(index)
            .post("/user/login")
            .send(loginUser2)
            .end((err, res) => {
                expect(res.status).to.equal(404);
                done();
            })
    });

    it("Should not login user incorrect password", done => {
        let loginUserIncorrectPassword = {
            email: "testUser@gmail.com",
            password: "incorrectPassword",
        }

        chai
            .request(index)
            .post("/user/login")
            .send(loginUserIncorrectPassword)
            .end((err, res) => {
                expect(res.status).to.equal(422);
                done();
            })
    })

    it("Should delete testUser", done => {
        let deleteUser = {
            email: "testUser@gmail.com"
        }

        // Ensure that the 'agent' from the "Login testUser" is available
        if (!agent) {
            return done(new Error("Agent not available. Please run 'Login testUser' first."));
        }
    
        agent
            .post("/user/delete")
            .send(deleteUser)
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
    });
})