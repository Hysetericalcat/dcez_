const { MongoClient, ObjectId } = require('mongodb');
const uri = "mongodb+srv://akshat124b:Akshat%403624@cluster0.klwjwuh.mongodb.net/?retryWrites=true&w=majority";
const dbName = "Disposable_Forms";
const collectionName = "User_Data";

async function connectAndPrintData(io) {
  const client = new MongoClient(uri);
  const uri = "mongodb+srv://akshat124b:Akshat%403624@cluster0.klwjwuh.mongodb.net/?retryWrites=true&w=majority";
  const dbName = "Disposable_Forms";
  const collectionName = "User_Data";


  try {
    await client.connect();
    console.log('Connected successfully to MongoDB');
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const cursor = collection.find();
    await cursor.forEach(document => {
      io.emit("dataBase", document);
      console.log('Emitted document:', document);
    });
  } catch (error) {
    console.error('Error occurred:', error);
  } finally {
    await client.close();
    console.log('MongoDB connection closed.');
  }
}

async function deleteDocumentById(documentId) {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected successfully to MongoDB');

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const result = await collection.deleteOne({ _id: ObjectId(documentId) });

    if (result.deletedCount === 1) {
      console.log('Document deleted successfully.');
    } else {
      console.log('Document not found or already deleted.');
    }
  } catch (error) {
    console.error('Error occurred:', error);
  } finally {
    await client.close();
    console.log('MongoDB connection closed.');
  }
}

function printObjectIds() {
  MongoClient.connect('mongodb://localhost:27017', function(err, client) {
      if (err) throw err;
      const db = client.db('yourDatabaseName');
      
      // Replace 'yourCollectionName' with the name of your collection
      db.collection('yourCollectionName').find({}, { _id: 1 }).toArray(function(err, result) {
          if (err) throw err;
          result.forEach(doc => {
              console.log(doc._id); // Print the ObjectId of each document
          });
          client.close();
      });
  });
}

// Call the function
printObjectIds();

module.exports = { connectAndPrintData, deleteDocumentById };
