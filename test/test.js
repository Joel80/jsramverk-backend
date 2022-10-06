//process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app.js');

chai.should();

chai.use(chaiHttp);

//console.log(process.env.NODE_ENV);

const database = require("../db/database.js");
const collection1Name = "documents";
const collection2Name = "users";

let _id = "";

let token = "";


describe('Documents', () => { // eslint-disable-line
    before( async () => {            // eslint-disable-line
        let db = await database.getDb(collection1Name);

        db.db.listCollections(
            { name: collection1Name }
        )
            .next()
            .then(async function (info) {
                if (info) {
                    await db.collection.drop();
                }
            })
            .catch(function (err) {
                console.error(err);
            })
            .finally(async function () {
                await db.client.close();
            });
    });

    before( async () => {            // eslint-disable-line
        let db = await database.getDb(collection2Name);

        db.db.listCollections(
            { name: collection2Name }
        )
            .next()
            .then(async function (info) {
                if (info) {
                    await db.collection.drop();
                }
            })
            .catch(function (err) {
                console.error(err);
            })
            .finally(async function () {
                await db.client.close();
            });
    });


    describe('POST /auth/register', () => { // eslint-disable-line
        it('201 HAPPY PATH', (done) => { // eslint-disable-line

            const body = {
                email: "test@test.se",
                password: "test"
            };

            chai.request(server)
                .post("/auth/register")
                .send(body)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.an("object");
                    res.body.data.should.be.an("object");
                    res.body.data.should.have.property("message");
                    res.body.data.message.should.be.equal("User created");
                    done();
                }
                );
        });
    });


    describe('POST /auth/login', () => { // eslint-disable-line
        it('201 HAPPY PATH', (done) => { // eslint-disable-line

            const body = {
                email: "test@test.se",
                password: "test"
            };

            chai.request(server)
                .post("/auth/login")
                .send(body)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.an("object");
                    res.body.data.should.be.an("object");
                    res.body.data.should.have.property("_id");
                    res.body.data.should.have.property("email");
                    res.body.data.should.have.property("token");
                    token = res.body.data.token;
                    done();
                }
                );
        });
    });

    describe('GET /docs', () => { // eslint-disable-line
        it('200 HAPPY PATH', (done) => { // eslint-disable-line
            chai.request(server)
                .get("/docs")
                .set('x-access-token', token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    res.body.data.should.be.an("array");
                    res.body.data.length.should.be.equal(0);
                    done();
                }
                );
        });
    });

    describe('GET /docs', () => { // eslint-disable-line
        it('Should get 401 token not valid', (done) => { // eslint-disable-line
            chai.request(server)
                .get("/docs")
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.be.an("object");
                    res.body.data.should.have.property("errors");
                    res.body.data.errors.message.should.equal("Token not valid");
                    done();
                }
                );
        });
    });

    describe('POST /docs', () => { // eslint-disable-line
        it('Should create new doc', (done) => { // eslint-disable-line
            let doc = {
                name: "A name",
                html: "Some html</br>",
                allowed_users: ["test@test.se"]
            };

            chai.request(server)
                .post("/docs")
                .set('x-access-token', token)
                .send(doc)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.an("object");
                    res.body.should.have.property("id");
                    //console.log(res.body.id);
                    _id = res.body.id;
                    //console.log(_id);
                    done();
                }
                );
        });
    });

    describe('GET /docs', () => { // eslint-disable-line
        it('200 HAPPY PATH', (done) => { // eslint-disable-line
            chai.request(server)
                .get("/docs")
                .set('x-access-token', token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    res.body.data.should.be.an("array");
                    res.body.data.length.should.be.equal(1);

                    done();
                }
                );
        });
    });

    describe('POST /docs', () => { // eslint-disable-line
        it('Should fail to create new doc', (done) => { // eslint-disable-line
            let doc = {};

            chai.request(server)
                .post("/docs")
                .set('x-access-token', token)
                .send(doc)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.an("object");
                    res.body.should.have.property("errors");
                    res.body.errors.message.should.equal("name and html needed to save document");
                    done();
                }
                );
        });
    });


    describe('PUT /docs', () => { // eslint-disable-line
        it('should update a doc with given id', (done) => { // eslint-disable-line
            let doc = {
                _id: _id,
                name: "A doc",
                html: "Some html updated",
                allowed_users: ["test@test.se"]
            };

            chai.request(server)
                .put("/docs")
                .set('x-access-token', token)
                .send(doc)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    console.log(res.body);
                    res.body.result.should.have.property("message");
                    done();
                }
                );
        });
    });

    describe('PUT /docs', () => { // eslint-disable-line
        it('Should fail to update doc', (done) => { // eslint-disable-line
            let doc = {
                name: "A doc",
                html: "Some html updated",
                allowed_users: ["test@test.se"]
            };

            chai.request(server)
                .put("/docs")
                .set('x-access-token', token)
                .send(doc)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.an("object");
                    res.body.should.have.property("errors");
                    res.body.errors.message.should.equal("_id needed to update document");
                    done();
                }
                );
        });
    });

    describe('GET /docs/:id', () => { // eslint-disable-line
        it('should get a doc with given id', (done) => { // eslint-disable-line
            chai.request(server)
                .get("/docs/" + _id)
                .set('x-access-token', token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    res.body.should.have.property("data");
                    res.body.data.should.have.property("_id");
                    res.body.data.should.have.property("name");
                    res.body.data.should.have.property("html");
                    res.body.data.should.have.property("allowed_users");
                    done();
                }
                );
        });
    });
});
