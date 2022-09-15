//process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app.js');

chai.should();

chai.use(chaiHttp);

console.log(process.env.NODE_ENV);

const database = require("../db/database.js");
const collectionName = "documents";

let _id = "";


describe('Documents', () => { // eslint-disable-line
    before(() => {            // eslint-disable-line
        return new Promise(async (resolve) => { // eslint-disable-line
            const db = await database.getDb();

            db.db.listCollections(
                { name: collectionName }
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
                    resolve();
                });
        });
    });

    describe('GET /docs', () => { // eslint-disable-line
        it('200 HAPPY PATH', (done) => { // eslint-disable-line
            chai.request(server)
                .get("/docs")
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

    describe('POST /docs', () => { // eslint-disable-line
        it('Should create new doc', (done) => { // eslint-disable-line
            let doc = {
                name: "A name",
                html: "Some html</br>"
            };

            chai.request(server)
                .post("/docs")
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

    describe('POST /docs', () => { // eslint-disable-line
        it('Should fail to create new doc', (done) => { // eslint-disable-line
            let doc = {};

            chai.request(server)
                .post("/docs")
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
                html: "Some html updated"
            };

            chai.request(server)
                .put("/docs")
                .send(doc)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    console.log(res.body);
                    res.body.should.have.property("message");
                    done();
                }
                );
        });
    });

    describe('PUT /docs', () => { // eslint-disable-line
        it('Should fail to update doc', (done) => { // eslint-disable-line
            let doc = {
                name: "A doc",
                html: "Some html updated"
            };

            chai.request(server)
                .put("/docs")
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
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    res.body.should.have.property("data");
                    /* res.body.should.have.property("name");
                    res.body.should.have.property("html"); */
                    done();
                }
                );
        });
    });
});
