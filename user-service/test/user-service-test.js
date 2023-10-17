// Import the dependencies for testing
import chai from 'chai';
import chaiHttp from 'chai-http';
import index from '../index.js';

const expect = chai.expect;
let should = chai.should();

chat.use(chaiHttp);
chai.should();

describe("Test User Service", function () {
    let registerUser = {
        username: "testUser",
        email: "testUser@gmail.com",
        password: "testUser123",
        password2: "testUser123",
        role: "user"
    }

    let loginUser = {
        email: "testUser@gmail.com",
        password: "testUser123",
    }

    let deleteUser = {
        email: "testUser@gmail.com"
    }

    before("Register testUser", (done) => {
        chai
            .request(index)
            .post("/user/register")
            .set("Accept", "application/json")
            .send(registerUser)
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
    });

    before("Login testUser", (done) => {
        chai
            .request(index)
            .post("/user/login")
            .set("Accept", "application/json")
            .send(loginUser)
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            }); 
    })

    before("Delete testUser", (done) => {
        chai    
            .request(index)
            .post("/user/delete")
            .set("Accept", "application/json")
            .send(deleteUser)
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            })
    })

    describe("Test createUser function /user/register", function () {
        it("should return error 400 for invalid password", (done) => {
          chai
            .request(index)
            .post("/api/user/register")
            .send({
                username: "admin123",
                password: "",
            })
            .end((err, res) => {
                expect(res).to.have.status(403);
                expect(res.body).to.be.a("object");
                expect(res.body.message).to.equal(
                    "Password not long enough"
                );
                done();
            });
        })
    })
})