/**
 * Connect to the database
 */
"use strict";

// To get the localhost from WSL2
const name = process.env.NAME;
const localhost = name + '.local';

// Mongo db
const mongo = require("mongodb").MongoClient;
const dsn =
  `mongodb://${localhost}:27017/mumin` || `mongodb://localhost:27017/mumin`;

// Express server
const port = 1337;
const express = require("express");
const app = express();

// Test server
app.get("/", (req, res) => {
    res.send("Hello world");
});


// Return a JSON object with list of all documnets within the collection
app.get("/list", async (request, response) => {
    try {
        let res = await findInCollection(dsn, "crowd", {}, {}, 0);

        console.log(res);
        response.json(res);
    } catch (err) {
        console.log(err);
        response.json(err);
    }

});


app.listen(port, () => {
    console.log(`Server is listening on ${port}`);
    console.log(`DSN is: ${dsn}`);
});

/**
 * Find documents in an collection by matching search criteria.
 *
 * @async
 *
 * @param {string} dsn        DSN to connect to database.
 * @param {string} colName    Name of collection.
 * @param {object} criteria   Search criteria.
 * @param {object} projection What to project in results.
 * @param {number} limit      Limit the number of documents to retrieve.
 *
 * @throws Error when database operation fails.
 *
 * @return {Promise<array>} The resultset as an array.
 */
 async function findInCollection(dsn, colName, criteria, projection, limit) {
    const client  = await mongo.connect(dsn);
    const db = await client.db();
    const col = await db.collection(colName);
    const res = await col.find(criteria, projection).limit(limit).toArray();

    await client.close();

    return res;
}

async function addOneToCollection(dsn, colName, doc) {
    const client = await mongo.connect(dsn);
    const db = await client.db();
    const col = await db.collection(colName);
    const res = await col.insertOne(doc);

    return res;
}

// Find documents where name starts with a string
const criteria2 = {
    name: /^Sn/
};

const projection2 = {
    _id: 1,
    name: 1
};

const doc = {
    name: "body.name",
    html: "body.html"
}

const limit2 = 5;

(async () => {
    // Find using await
    try {
        let res = await findInCollection(
            dsn, "crowd", criteria2, projection2, limit2
        );
        console.log(res);
    } catch(err) {
        console.log(err);
    }

    try {
        let res = await addOneToCollection(
            dsn, "crowd", doc
        );
        console.log(res);
    } catch(err) {
        console.log(err);
    }

})();
