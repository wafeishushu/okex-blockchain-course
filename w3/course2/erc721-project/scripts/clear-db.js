const hre = require("hardhat");
const { MongoClient } = require("mongodb");

// Connection URI
const uri = "mongodb://localhost:27017";
// Create a new MongoClient
const client = new MongoClient(uri);

const main = async () => {
  try {
    // Connect the client to the server
    await client.connect();
    // Establish and verify connection
    const db = await client.db("okex-course-db");
    const query = { logIndex: { $gt: -1 } }
    await db.collection("nft_logs").deleteMany(query);
  } finally {
    await client.close();
  }
  console.log("Clear collection.");
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });