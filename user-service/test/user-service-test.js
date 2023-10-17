const chai = require("chai");
const chaiHttp = require("chai-http");
const index = require("../index.js");
const expect = chai.expect;
let should = chai.should();
const db = require("../psql-db.js");

chai.use(chaiHttp);
chai.should();

describe("Test User Service", function () {
    let registerUser = {
        username: "testUser",
        email: "testUser@gmail.com",
        password: "testUser123",
        password2: "testUser123",
        role: "user"
    }

    let registerUserBlankPassword = {
        username: "testUser2",
        email: "testUser2@gmail.com",
        password: "",
        password2: "",
        role: "user"
    }

    let registerUserMismatchedPassword = {
        username: "testUser2",
        email: "testUser2@gmail.com",
        password: "testUser2",
        password2: "testUser123",
        role: "user"
    }

    let loginUser = {
        email: "testUser@gmail.com",
        password: "testUser123",
    }

    let loginUserIncorrectPassword = {
        email: "testUser@gmail.com",
        password: "incorrectPassword",
    }

    let loginUser2 = {
        email: "testUser2@gmail.com",
        password: "testUser123",
    }

    let deleteUser = {
        email: "testUser@gmail.com"
    }

    let deleteUserIncorrectEmail = {
        email: "incorrectEmail@gmail.com"
    }

    let agent; //session preservation


    it("Register testUser", done => {
        chai
            .request(index)
            .post("/user/register")
            .send(registerUser)
            .end((err, res) => {
                expect(res.status).to.equal(200); // Assert the status code
                done();
            });
    });

    it("Register user with same email", done => {
        chai
            .request(index)
            .post("/user/register")
            .send(registerUser)
            .end((err, res) => {
                expect(res.status).to.equal(409);
                done();
            });
    });

    it("Register user with password too short", done => {
        chai
            .request(index)
            .post("/user/register")
            .send(registerUserBlankPassword)
            .end((err, res) => {
                expect(res.status).to.equal(403);
                done();
            })
    })

    it("Register user with passwords not matching", done => {
        chai
            .request(index)
            .post("/user/register")
            .send(registerUserMismatchedPassword)
            .end((err, res) => {
                expect(res.status).to.equal(400);
                done();
            })
    })

    it("Login testUser", done => {
        agent = chai.request.agent(index); // Create an agent to maintain the session
    
        agent
            .post("/user/login")
            .send(loginUser)
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            })
    });

    it("Login user does not exist", done => {
        chai
            .request(index)
            .post("/user/login")
            .send(loginUser2)
            .end((err, res) => {
                expect(res.status).to.equal(404);
                done();
            })
    });

    it("Login user incorrect password", done => {
        chai
            .request(index)
            .post("/user/login")
            .send(loginUserIncorrectPassword)
            .end((err, res) => {
                expect(res.status).to.equal(422);
                done();
            })
    })

    it("Delete testUser", done => {
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