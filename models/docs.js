/**
 * Model for docs
 */

const database = require('../db/database');
const ObjectId = require("mongodb").ObjectId;

const docs = {
    getAllDocs: async function getAllDocs(res) {
        let db;

        try {
            db = await database.getDb();
            //console.log(db);
            const resultset = await db.collection.find({}).toArray();
            console.log(resultset);

            return res.status(200).json({data: resultset});

        } catch (error) {
            return res.status(500).json({
                status: 500,
                title: "Database error",
                message: error.message
            });
        } finally {
            await db.client.close();
        }
    },

    getOneDocById: async function getOneDocById(req, res) {
        console.log("Get one");
        let db;
        const id = req.params.id;
        console.log(id);
        const query = {_id: ObjectId(id) }
        console.log(query);

        try {
            db = await database.getDb();
            const doc = await db.collection.findOne(query);
            console.log(doc);

            return res.status(200).json({data: doc});

        } catch (error) {
            return res.status(500).json({
                status: 500,
                title: "Database error",
                message: error.message
            });
        } finally {
            await db.client.close();
        }
    },

    saveDoc: async function saveDoc(req, res) {
        let db;
        let doc = {};
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
    },

    updateDoc: async function updateDoc(req, res) {
        let db;

        console.log(req.body._id);
        const filter = { _id: ObjectId(req.body._id) };

        const updateDoc = { $set: {name: req.body.name, html: req.body.html}, };

        try {
            db = await database.getDb();
            const result = await db.collection.updateOne(filter, updateDoc);
            
            //res.send("Ok");
            res.status(204).json({message:"Successfully updated"});

        } catch (error) {
            return res.status(500).json({
                status: 500,
                title: "Database error",
                message: error.message
            });
        } finally {
            await db.client.close();
        }
    },
}

module.exports = docs;