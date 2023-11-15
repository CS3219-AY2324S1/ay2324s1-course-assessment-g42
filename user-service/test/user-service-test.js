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
    before("Create user for test cases", done => {
        let existingUser = {
            username: "existingUser",
            email: "existingUser@gmail.com",
            password: "existinguser",
            password2: "existinguser",
            role: "user"
        }

        chai
            .request(index)
            .post("/user/register")
            .send(existingUser)
            .end((err, res) => {
                expect(res.status).to.equal(200);
                done();
            })
    });

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
            username: "testUser1",
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

    it("Should not register user with same username", done => {
        let registerUser = {
            username: "testUser",
            email: "testUser1@gmail.com",
            password: "testUser123",
            password2: "testUser123",
            role: "user"
        }

        chai
            .request(index)
            .post("/user/register")
            .send(registerUser)
            .end((err, res) => {
                expect(res.status).to.equal(422);
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
    });

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

    it("Should not login user with incorrect password", done => {
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
    });

    it("Should update user with new username", done => {
        let updateUsername = {
            newUsername: "testUserNew",
            email: "testUser@gmail.com"
        }

        if (!agent) {
            return done(new Error("Agent not available. Please run 'Login testUser' first."));
        }

        agent
            .post("/user/updateUsername")
            .send(updateUsername)
            .end((err, res) => {
                expect(res.status).to.equal(200);
                done();
            })
    });

    it("Should update user with new password", done => {
        let updatePassword = {
            newPassword: "testUserNewPassword",
            email: "testUser@gmail.com"
        }

        if (!agent) {
            return done(new Error("Agent not available. Please run 'Login testUser' first."));
        }

        agent
            .post("/user/updatePassword")
            .send(updatePassword)
            .end((err, res) => {
                expect(res.status).to.equal(200);
                done();
            })
    })

    it("Should not update user with existing username", done => {
        let existingUsername = {
            newUsername: "existingUser",
            email: "testUser@gmail.com"
        }

        if (!agent) {
            return done(new Error("Agent not available. Please run 'Login testUser' first."));
        }

        agent
            .post("/user/updateUsername")
            .send(existingUsername)
            .end((err, res) => {
                expect(res.status).to.equal(422)
                done();
            })
    });

    it("Should not update username with empty fields", done => {
        let emptyUpdate = {  

        };

        if (!agent) {
            return done(new Error("Agent not available. Please run 'Login testUser' first."));
        }

        agent
            .post("/user/updateUsername")
            .send(emptyUpdate)
            .end((err, res) => {
                expect(res.status).to.equal(423)
                done();
            })
    })

    it("Should not update username if not authenticated", done => {
        let dummyUpdate = {
            newUsername: "dummyUsername",
            emai: "testUser@gmail.com"
        };

        chai
            .request(index)
            .post("/user/updateUsername")
            .send(dummyUpdate)
            .end((err, res) => {
                expect(res.status).to.equal(401);
                done();
            })
    })
    
    it("Should not update user with password less than 8 characters", done => {
        let shortPassword = {
            newPassword: "short",
            email: "testUser@gmail.com"
        }

        if (!agent) {
            return done(new Error("Agent not available. Please run 'Login testUser' first."));
        }

        agent   
            .post("/user/updatePassword")
            .send(shortPassword)
            .end((err, res) => {
                expect(res.status).to.equal(403);
                done();
            })
    });

    it("Should not update password with empty fields", done => {
        let emptyPasswordUser = {

        };

        agent
            .post("/user/updatePassword")
            .send(emptyPasswordUser)
            .end((err, res) => {
                expect(res.status).to.equal(402);
                done();
            });
    });

    it("Should not update password if not authenticated", done => {
        let dummyPasswordUpdate = {
            newPassword: "dummyPassword",
            email: "testUser@gmail.com"
        };

        chai
            .request(index)
            .post("/user/updatePassword")
            .send(dummyPasswordUpdate)
            .end((err, res) => {
                expect(res.status).to.equal(401);
                done();
            });
    })

    it("Should get users", async () => {
        if (!agent) {
            return done(new Error("Agent not available. Please run 'Login testUser' first."));
        }

        const response = await agent
            .post("/user/getUsers")
        
        expect(response.status).to.equal(200);
    });

    it("Should not get users if not authenticated", async ()=> {
        const response = await chai
            .request(index)
            .post("/user/getUsers");

        expect(response.status).to.equal(401);
    })

    it("Should update user role to moderator", done => {
        let updateRoleMod = {
            username: "existingUser",
            newRole: "moderator"
        };

        if (!agent) {
            return done(new Error("Agent not available. Please run 'Login testUser' first."));
        }

        agent
            .post("/user/updateRole")
            .send(updateRoleMod)
            .end((err, res) => {
                expect(res.status).to.equal(200);
                done();
            });
    });

    it("Should update user role to admin", done => {
        let updateRoleAdmin = {
            username: "existingUser",
            newRole: "admin"
        };

        if (!agent) {
            return done(new Error("Agent not available. Please run 'Login testUser' first."));
        }

        agent
            .post("/user/updateRole")
            .send(updateRoleAdmin)
            .end((err, res) => {
                expect(res.status).to.equal(200);
                done();
            });
    });

    it("Should find user existingUser by email", done => {
        let findUser = {
            email: "existingUser@gmail.com"
        }

        agent
            .post("/user/findByEmail")
            .send(findUser)
            .end((err, res) => {
                expect(res.status).to.equal(200);
                done();
            });
    });

    it("Should not find user if email not given", done => {
        let emptyEmail = {

        };

        agent
            .post("/user/findByEmail")
            .send(emptyEmail)
            .end((err, res) => {
                expect(res.status).to.equal(403);
                done();
            });
    });

    it("Should delete testUser", done => {
        let deleteUser = {
            email: "testUser@gmail.com"
        }

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
    
    after("Log into existing user", done => {
        let loginUser = {
            email: "existingUser@gmail.com",
            password: "existinguser",
        }

        agent = chai.request.agent(index); // Create an agent to maintain the session
    
        agent
            .post("/user/login")
            .send(loginUser)
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            })
    })
    after("Delete existing user", done => {
        let deleteUser = {
            email: "existingUser@gmail.com"
        }

        agent  
            .post("/user/delete")
            .send(deleteUser)

            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            })
    })
})