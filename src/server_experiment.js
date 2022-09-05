const { MongoClient } = require("mongodb");

// To get the localhost from WSL2
const name = process.env.NAME;
const localhost = name + '.local';

// Connection URI
const dsn =
  `mongodb://${localhost}:27017/mumin` || `mongodb://localhost:27017/mumin`;

  // Create a new MongoClient
const client = new MongoClient(dsn);

async function run() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();
    // Establish and verify connection
    await client.db("admin").command({ ping: 1 });
    console.log("Connected successfully to server");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

run().catch(console.dir);
