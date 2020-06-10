var express = require('express');
const cors = require('cors');
var graphqlHTTP = require('express-graphql');
var mongoClient = require("mongodb").MongoClient;
var { buildSchema } = require('graphql');

var schema = buildSchema(`
  type Product {
    id: String
    shop: String
    brand: String
    name: String
    link: String
    price: String
  }
  type Query {
    getProducts: [Product],
    getProductInfo(id: Int): Product
  }
  type Mutation {
    updateProductInfo(id: String, shop: String, brand: String, name: String, url: String, price: String): Boolean
    createProduct(id: String, shop: String, brand: String, name: String, url: String, price: String): Boolean
    deleteUser(id: Int): Boolean

  }
`);

var root = {
  getProducts: () => queryDB()
};

var app = express();
app.use(cors());
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));


app.listen(4000, () => console.log('Now browse to localhost:4000/graphql'));


async function queryDB() {
  const mongoURL = "mongodb://localhost:27017/"
  const dbName = "test";
  const collectionName = "product";
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