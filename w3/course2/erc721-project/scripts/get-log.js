const hre = require("hardhat");
const { MongoClient } = require("mongodb");

// Connection URI
const uri = "mongodb://localhost:27017";
// Create a new MongoClient
const client = new MongoClient(uri);

const main = async () => {
  // Get signers
  const [owner] = await ethers.getSigners();
  console.log("Owner address:", owner.address);
 
  const provider = new ethers.getDefaultProvider('goerli');
  const abi = [
    "function mintAllNFTs() public",
    "function approve(address to, uint256 tokenId) external",
    "function ownerOf(uint256 tokenId) external view returns (address owner)",
    "function balanceOf(address owner) external view returns (uint256 balance)",
    "function safeTransferFrom(address from, address to, uint256 tokenId) external",
    "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)"
  ];
  
  // Connect contract
  const contractAddress = "0x9200D2E565Ec7172a4eA50CAB329Ec3cf0DF55bf";
  const nftContract = new ethers.Contract(contractAddress, abi, provider);

  // get logs
  const filter = {
    address: contractAddress,
    topics: [
      ethers.utils.id("Transfer(address,address,uint256)"),
    ]
  };
  let logs = await nftContract.queryFilter(filter);
  console.log(JSON.stringify(logs, null, 2))

  // Connect the client to the server
  await client.connect();
  // Establish and verify connection
  await client.db("okex-course-db").command({ ping: 1 });
  const db = await client.db("okex-course-db");
  console.log("Connected successfully to mongodb server");

  for (let i = 0; i < logs.length; i++) {
    const logIndex = logs[i]["logIndex"];
    const fromAddr = logs[i]["args"][0];
    const toAddr = logs[i]["args"][1];
    const nftNumberHex = logs[i]["args"][2];
    const nftNumber = ethers.BigNumber.from(nftNumberHex).toNumber();

    // debug log
    // console.log({i}, ' logIndex is ', {logIndex})
    // console.log({i}, ' fromAddr is ', {fromAddr})
    // console.log({i}, ' toAddr is ', {toAddr})
    // console.log({i}, ' nftNumber is ', {nftNumber})

    // Write into mongodb
    const doc = {
      logIndex: logIndex,
      from: fromAddr,
      to: toAddr,
      nftNumber: nftNumber,
    };
    const result = await db.collection("nft_logs").insertOne(doc);
    console.log(
      `A document was inserted with the _id: ${result.insertedId}`,
    );
  }
  await client.close();
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });


// npx hardhat run scripts/get-log.js --network georli