const { MongoClient } = require('mongodb');
const fs = require('fs');

// Connection URI
const uri = 'mongodb+srv://nduluechinedu:1234@testcluster.9slnzsa.mongodb.net/?retryWrites=true&w=majority';

// Database Name
const dbName = 'flashcards';

// Collection Name
const collectionName = 'cards';

// Path to store the JSON file
const jsonFilePath = 'data.json';

// Create a MongoClient
const client = new MongoClient(uri);

async function run() {
  try {
    // Connect to the MongoDB server
    await client.connect();

    // Get the database
    const database = client.db(dbName);

    // Create the collection if it doesn't exist
    const collection = database.collection(collectionName);

    // Fetch data from the collection
    const data = await collection.find({}).toArray();

    // Store the data in a JSON file
    fs.writeFileSync(jsonFilePath, JSON.stringify(data, null, 2));

    console.log('Data fetched and stored in data.json');
  } finally {
    // Close the connection
    await client.close();
  }
}

run().catch(console.error);
