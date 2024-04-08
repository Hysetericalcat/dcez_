const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://akshat124b:Akshat%403624@cluster0.klwjwuh.mongodb.net/<your_database_name>?retryWrites=true&w=majority";
const client = new MongoClient(uri);
const data = [
  { Age: "age", Name: "name", Number: "number" }
];
async function insertData() {
  try {
    await client.connect();
    console.log("Connected successfully to MongoDB");
    const database = client.db("Disposable_Forms"); 
    const collection = database.collection("User_Data"); 
    const result = await collection.insertMany(data);
    console.log(`${result.insertedCount} documents inserted`);
  } catch (err) {
    console.error("Error inserting data:", err);
  } finally {

    await client.close();
  }
}
insertData().catch(console.error);
