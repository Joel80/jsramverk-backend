/**
 * Connect to db and setup with default data
 */
require('dotenv').config();
const name = process.env.NAME;
const localhost = name + '.local';

console.log(localhost);

const mongo = require("mongodb").MongoClient;
const dsn = `mongodb+srv://${process.env.ATLAS_USERNAME}:${process.env.ATLAS_PASSWORD}`
+ `@cluster0.5vdprdp.mongodb.net/?retryWrites=true&w=majority`;
/* `mongodb://${localhost}:27017/docs` || `mongodb://localhost:27017/docs`; */

const fs = require("fs");
const path = require("path");
const docs = JSON.parse(fs.readFileSync(
    path.resolve(__dirname, "setup.json"),
    "utf-8"
));

resetCollection(dsn, "documents", docs)
    .catch(err => console.log(err));

async function resetCollection(dsn, colName, docs) {
    const client = await mongo.connect(dsn);
    const db = await client.db();
    const collection = await db.collection(colName);

    await collection.deleteMany();
    await collection.insertMany(docs);
    await client.close();
}
