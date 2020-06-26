const mongoClient = require("mongodb").MongoClient;
const mongoURL = "mongodb://localhost:27017/"
const dbName = "test";
const ProductCollection = "product";
const ProductPriceCollection = "product_price";

async function getCount() {
  let client;
  try {
    client = await mongoClient.connect(mongoURL, {useUnifiedTopology: true});
    const db = client.db(dbName);
    const collection = db.collection(ProductCollection);
    const result = await collection.countDocuments({});
    return result;
  } catch(e) {
    console.error(e);
  } finally {
    client.close();
  }
}

async function getAllProducts() {
  let client;
  try {
    client = await mongoClient.connect(mongoURL, {useUnifiedTopology: true});
    const db = client.db(dbName);
    const collection = db.collection(ProductCollection);
    const result = await collection.find({}).toArray();
    return result;
  } catch(e) {
    console.error(e);
  } finally {
    client.close();
  }
}

async function getProductById(id_) {
  let client;
  try {
    client = await mongoClient.connect(mongoURL, {useUnifiedTopology: true});
    const db = client.db(dbName);
    const collection = db.collection(ProductCollection);
    const result = await collection.findOne({ id: String(id_) });
    return result;
  } catch(e) {
    console.error(e);
  } finally {
    client.close();
  }
}

async function getProductPricesById(id_) {
  let client;
  try {
    client = await mongoClient.connect(mongoURL, {useUnifiedTopology: true});
    const db = client.db(dbName);
    const collection = db.collection(ProductPriceCollection);
    const result = await collection.find({ id: String(id_) }).toArray();
    console.log(result);
    return result;
  } catch(e) {
    console.error(e);
  } finally {
    client.close();
  }
}

module.exports = {
  getProductById,
  getAllProducts,
  getProductPricesById,
};