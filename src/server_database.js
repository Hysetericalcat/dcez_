const { MongoClient, ObjectId  } = require('mongodb');



async function createCollection() {
    try {
        await client.connect();
        const db = client.db(dbName);
        await db.createCollection("Disposable_Forms");
        console.log(`Collection '${"User_Data"}' created successfully.`);
    } catch (err) {
        console.error('Error occurred:', err);
    } finally {
        await client.close();
    }
}
async function print_Deletevalue(){
   Socket.on("object_id",(objectData)=>{
    async function deleteDocumentById(objectData) {
        try {
            await client.connect();
            const db = client.db(dbName);
            const collection = db.collection(collectionName);
            const result = await collection.deleteOne({ _id: ObjectId(id) });
    
            if (result.deletedCount === 1) {
                console.log('Document deleted successfully.');
            } else {
                console.log('Document not found or already deleted.');
            }
        } catch (err) {
            console.error('Error occurred:', err);
        } finally {
            await client.close();
        }
    }
   })
}