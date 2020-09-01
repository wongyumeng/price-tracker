import { MongoClient, Db, Collection } from "mongodb";

const mongoURL = "mongodb://localhost:27017/"
const dbName = "test";
const ProductCollection = "product";
const ProductPriceCollection = "product_price";

type SearchParams = {
  [key: string]: string[]
}

type MongoFilterQuery = {
  $and: string[]
}

function combine(A: string[], B: string[]): SearchParams  {
  const params: SearchParams = {};
  A.map((item, index) => [item, B[index]]).forEach(param => {
    const [a, b] = param;
    params[a] == undefined ? params[a] = [b] : params[a].push(b);
  });
return params; 
}

function mongoFilter(params: SearchParams) {
  const findQuery: MongoFilterQuery = {
    $and: []
  };
  Object.entries(params).forEach(param => {
    const query = {};
    if (param[1].length == 1) {

    }
  })
  return 
}

async function getCount(): Promise<number> {
  let client: MongoClient;
  try {
    client = await MongoClient.connect(mongoURL, {useUnifiedTopology: true});
    const db: Db = client.db(dbName);
    const collection: Collection = db.collection(ProductCollection);
    const result: number = await collection.countDocuments({});
    return result;
  } catch(e) {
    console.error(e);
  } finally {
    client.close();
  }
}

async function getAllProducts(count, page, paramA, paramB) {
  let client: MongoClient;
  try {
    const currentPageNumber = page - 1;
    const skipped = count * currentPageNumber;
    console.log(skipped);
    client = await MongoClient.connect(mongoURL, {useUnifiedTopology: true});
    const db = client.db(dbName);
    const collection = db.collection(ProductCollection);
    const result = await collection.find({}).skip(skipped).limit(count).toArray();
    return result;
  } catch(e) {
    console.error(e);
  } finally {
    client.close();
  }
}

async function getProductById(id_) {
  let client: MongoClient;
  try {
    client = await MongoClient.connect(mongoURL, {useUnifiedTopology: true});
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
  let client: MongoClient;
  try {
    client = await MongoClient.connect(mongoURL, {useUnifiedTopology: true});
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
  getCount
};