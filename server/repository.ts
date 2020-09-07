import { MongoClient, Db, Collection } from "mongodb";

const mongoURL = "mongodb://localhost:27017/"
const dbName = "test";
const ProductCollection = "product";
const ProductPriceCollection = "product_price";

type SearchParams = {
  [key: string]: string[]
}

type MongoFilterQuery = {
  $and?: FineQuery[] | FineQuery
  $or?: FineQuery[]
}

type FineQuery = string | field

type field = {
  [key: string]: string
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
  const findQuery = {
    $and: []
  };
  if ("MinPrice" in params || "MaxPrice" in params) {
    const priceQuery = { priceValue: {}};
    if ("MinPrice" in params) {
      priceQuery.priceValue["$gte"] = Number(params["MinPrice"]);
      delete params["MinPrice"];
    }
    if ("MaxPrice" in params) {
      priceQuery.priceValue["$lte"] = Number(params["MaxPrice"]);
      delete params["MaxPrice"];
    }
    findQuery.$and.push(priceQuery);
  }
  Object.entries(params).forEach(param => {
    const query = {}
    if (param[1].length == 1) {
      query[param[0]] = param[1][0];
      findQuery.$and.push(query);
    } else {
      query["$or"] = [];
      param[1].forEach(p => {
        const q = {};
        q[param[0]] = p;
        query["$or"].push(q);
      });
      findQuery.$and.push(query);
    }
  })
  return findQuery;
}

async function getCount(paramA: string[], paramB: string[]): Promise<number> {
  let client: MongoClient;
  try {
    client = await MongoClient.connect(mongoURL, {useUnifiedTopology: true});
    const params = paramA.length > 0 ? mongoFilter(combine(paramA, paramB)) : {};
    const db: Db = client.db(dbName);
    const collection: Collection = db.collection(ProductCollection);
    const result: number = await collection.countDocuments(params);
    console.log(result);
    return result;
  } catch(e) {
    console.error(e);
  } finally {
    client.close();
  }
}

async function getAllProducts(count: number, page: number, paramA: string[], paramB: string[]): Promise<any[]> {
  let client: MongoClient;
  try {
    const currentPageNumber = page - 1;
    const skipped = count * currentPageNumber;
    const params = paramA.length > 0 ? mongoFilter(combine(paramA, paramB)) : {};
    console.log(params)
    console.log(JSON.stringify(params));
    client = await MongoClient.connect(mongoURL, {useUnifiedTopology: true});
    const db = client.db(dbName);
    const collection = db.collection(ProductCollection);
    const result = await collection.find(params).skip(skipped).limit(count).toArray();
    return result;
  } catch(e) {
    console.error(e);
  } finally {
    client.close();
  }
}

async function getProductById(id_: string) {
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

async function getProductPricesById(id_: string) {
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