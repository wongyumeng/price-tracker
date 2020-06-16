const mongoClient = require("mongodb").MongoClient;
const mongoURL = "mongodb://localhost:27017/"
const dbName = "test";
const collectionName = "product";

async function getAllProduct() {
  let client;
  try {
    client = await mongoClient.connect(mongoURL, {useUnifiedTopology: true});
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const result = await collection.find({}).toArray();
    return result;
  } catch(e) {
    console.error(e);
  } finally {
    client.close();
  }
}

async function getProduct(req) {
  let client;
  try {
    client = await mongoClient.connect(mongoURL, {useUnifiedTopology: true});
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const result = await collection.findOne({ id: String(req.id) });
    return result;
  } catch(e) {
    console.error(e);
  } finally {
    client.close();
  }
}

module.exports = {
  getProduct,
  getAllProduct,
};