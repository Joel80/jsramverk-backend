"use strict";
const mongo = require("mongodb").MongoClient;
// const config = require('./config.json);
const collectionName = "documents";

const name = process.env.NAME;
const localhost = name + '.local';

const database = {
    getDb: async function getDb() {
        let dsn =
        `mongodb+srv://${process.env.ATLAS_USERNAME}:${process.env.ATLAS_PASSWORD}@`
        + `cluster0.5vdprdp.mongodb.net/?retryWrites=true&w=majority`;
        /* `mongodb://${localhost}:27017/docs` || `mongodb://localhost:27017/docs`; */

        if (process.env.NODE_ENV === 'test') {
            //dsn = `mongodb://${localhost}:27017/test` //|| `mongodb://localhost:27017/test`;
            dsn = `mongodb://localhost:27017/test`;
        }

        if (process.env.NODE_ENV === 'local-test') {
            dsn = `mongodb://${localhost}:27017/test`;
        }

        if (process.env.NODE_ENV === 'local-run') {
            dsn = `mongodb://${localhost}:27017/docs`;
        }

        const client = await mongo.connect(dsn, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        const db = await client.db();
        const collection = await db.collection(collectionName);

        return {
            db: db,
            collection: collection,
            client: client,
        };
    }
};

module.exports = database;
