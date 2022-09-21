/**
 * Model for docs
 */

const database = require('../db/database');
const ObjectId = require("mongodb").ObjectId;

const docs = {
    getAllDocs: async function getAllDocs() {
        let db;

        try {
            db = await database.getDb();
            //console.log(db);
            const allDocs = await db.collection.find({}).toArray();

            //console.log(resultset);

            return allDocs;
        } catch (error) {
            return {
                errors: {
                    status: 500,
                    title: "Database error",
                    message: error.message
                }
                
            };
        } finally {
            await db.client.close();
        }
    },

    getOneDocById: async function getOneDocById(_id) {
        console.log("Get one");
        let db;
        //console.log(id);
        const query = {_id: ObjectId(_id) };
        //console.log(query);

        try {
            db = await database.getDb();
            const doc = await db.collection.findOne(query);
            //console.log(doc);

            return doc;
        } catch (error) {
            return {
                errors: {
                    status: 500,
                    title: "Database error",
                    message: error.message
                }
            };
        } finally {
            await db.client.close();
        }
    },

    saveDoc: async function saveDoc(req, res) {
        let db;
        let doc = {};

        if (req.body.name && req.body.html) {
            let name = req.body.name;
            let html = req.body.html;

            doc.name = name;
            doc.html = html;

            try {
                db = await database.getDb();
                const result = await db.collection.insertOne(doc);

                // If there is a result return status 201 and inserted id
                if (result) {
                    return res.status(201).json({id: result.insertedId });
                }
            } catch (error) {
                return res.status(500).json({
                    status: 500,
                    title: "Database error",
                    message: error.message
                });
            } finally {
                await db.client.close();
            }
        } else {
            return res.status(400).json({errors: {
                message: "name and html needed to save document"
            }});
        }
    },

    updateDoc: async function updateDoc(req, res) {
        let db;

        if (req.body._id) {
            const filter = { _id: ObjectId(req.body._id) };

            const updateDoc = { $set: {name: req.body.name, html: req.body.html}, };

            try {
                db = await database.getDb();
                await db.collection.updateOne(filter, updateDoc);

                //res.send("Ok");
                res.status(200).json({message: "Successfully updated"});
            } catch (error) {
                return res.status(500).json({
                    status: 500,
                    title: "Database error",
                    message: error.message
                });
            } finally {
                await db.client.close();
            }
        } else {
            return res.status(400).json({errors: {
                message: "_id needed to update document"
            }});
        }
    },
};

module.exports = docs;
