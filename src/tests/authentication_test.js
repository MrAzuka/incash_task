process.env.NODE_ENV = "test"
const chai = require('chai')
const chaiHttp = require('chai-http')
const {
    describe
} = require('mocha')

const server = require('../app')
const User = require('../models/user_model')

const expect = chai.expect

chai.use(chaiHttp)

const testUser = {
    username: "MrAzuka",
    email: "mrazuka@gmail.com",
    password: "testpassword1234"
}

const noEmailUser = {
    username: "noEmail",
    password: "testpassword1234"
}

const noUsernameUser = {
    email: "noUsername@gmail.com",
    password: "testpassword1234"
}

const noPasswordUser = {
    username: "noPassword",
    email: "noPassword@gmail.com"
}

describe("Test Authentication Routes", () => {

    // before(async () => {
    //     //delete all occurences of the test user from the db
    //     await User.deleteMany({
    //         email: testUser.email
    //     });
    //     done()
    // })
    // Testing the registration route
    describe("Test Registration Route", () => {

        it("Register User", (done) => {
            chai.request(server)
                .post("/register")
                .send(testUser)
                .end((err, res) => {
                    expect(err).to.be.null
                    expect(res).to.have.status(201)
                    expect(res.body).to.be.a('object')
                    expect(res.body).to.have.property('message')
                    expect(res.body.message).to.be.string
                    expect(res.body.message).to.deep.equal("User Registered Successfully")
                    done()
                })
        })

        it("Check if User has Username", (done) => {
            chai.request(server)
                .post('/register')
                .send(noUsernameUser)
                .end((err, res) => {
                    expect(err).to.be.null
                    expect(res).to.have.status(500)
                    expect(res.body).to.be.an('object')
                    expect(res.body).to.have.property('message')
                    done()
                })
        })

        it("Check if User has Email", (done) => {
            chai.request(server)
                .post('/register')
                .send(noEmailUser)
                .end((err, res) => {
                    expect(err).to.be.null
                    expect(res).to.have.status(500)
                    expect(res.body).to.be.an('object')
                    expect(res.body).to.have.property('message')
                    done()
                })
        })

        it("Check if User has Password", (done) => {
            chai.request(server)
                .post('/register')
                .send(noPasswordUser)
                .end((err, res) => {
                    expect(err).to.be.null
                    expect(res).to.have.status(500)
                    expect(res.body).to.be.an('object')
                    expect(res.body).to.have.property('message')
                    done()
                })
        })
    })

    // Testing the Login route
    describe("Test Login Route", () => {
        it("Login User", (done) => {
            chai.request(server)
                .post('/login')
                .send(testUser)
                .end((err, res) => {
                    expect(err).to.be.null
                    expect(res).to.have.status(200)
                    expect(res.body).to.have.property('message')
                    expect(res.body.message).to.be.string
                    expect(res.body.message).to.deep.equal("User is logged in")
                    done()
                })
        })

        it("check if email is provided for login exists", (done) => {
            chai.request(server)
                .post('/login')
                .send({
                    email: " ",
                    password: testUser.password
                })
                .end((err, res) => {
                    expect(err).to.be.null
                    expect(res).to.have.status(404)
                    expect(res.body).to.have.property('message')
                    expect(res.body.message).to.be.string
                    expect(res.body.message).to.deep.equal("User not found")
                    done()
                })
        })

        it("check if email or password is provided for login", (done) => {
            chai.request(server)
                .post('/login')
                .send({
                    email: testUser.email,
                    password: ""
                })
                .end((err, res) => {
                    expect(err).to.be.null
                    expect(res).to.have.status(400)
                    expect(res.body).to.have.property('message')
                    expect(res.body.message).to.be.string
                    expect(res.body.message).to.deep.equal("login details are required")
                    done()
                })
        })
    })
})