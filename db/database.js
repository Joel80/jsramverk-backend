"use strict";
const mongo = require("mongodb").MongoClient;
// const config = require('./config.json);
const collectionName = "docs";

const name = process.env.NAME;
const localhost = name + '.local';

const database = {
    getDb: async function getDb () {
        let dsn =
        `mongodb://${localhost}:27017/docs` || `mongodb://localhost:27017/docs`;

        if (process.env.NODE_ENV === 'test') {
            dsn = `mongodb://${localhost}:27017/test` || `mongodb://localhost:27017/test`;
        }

        const client = await mongo.connect(dsn, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        const db = await client.db();
        const collection = await db.collection(collectionName);

        return {
            collection: collection,
            client: client,
        };
    }
};

module.exports = database;
