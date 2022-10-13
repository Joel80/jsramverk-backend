/**
 * Model for docs
 */

const database = require('../db/database');
const ObjectId = require("mongodb").ObjectId;


const docs = {
    getAllDocs: async function getAllDocs(email) {
        let db;

        //console.log(`Email: ${email}`);

        try {
            db = await database.getDb();
            //console.log(db);
            const allDocs = await db.collection.find({}).toArray();

            //console.log(allDocs);

            let returnArray = [];

            returnArray = allDocs.filter((doc) => doc.allowed_users?.includes(email)); 

            //console.log(returnArray);

            return returnArray;

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
        //console.log("Get one");
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

    saveDoc: async function saveDoc(doc) {
        let db;

        try {
            db = await database.getDb();
            const result = await db.collection.insertOne(doc);

            return result;
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

    updateDoc: async function updateDoc(doc) {
        let db;

        const filter = { _id: ObjectId(doc._id) };

        const updateDoc = { $set: {name: doc.name, html: doc.html, allowed_users: doc.allowed_users, code: doc.code}, };

        try {
            db = await database.getDb();
            await db.collection.updateOne(filter, updateDoc);

            return {message: "Successfully updated"};
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
};

module.exports = docs;
