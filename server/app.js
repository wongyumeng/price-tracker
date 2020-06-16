var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var graphqlHTTP = require('express-graphql');
var mongoClient = require("mongodb").MongoClient;
var { buildSchema } = require('graphql');
const mongoURL = "mongodb://localhost:27017/"
const dbName = "test";
const collectionName = "product";

var schema = buildSchema(`
  type Product {
    id: String
    shop: String
    brand: String
    name: String
    link: String
    price: String
    img: String
  }
  type ProductPrice {
    id: String
    price: String
    date: String
  }
  type Query {
    getProducts: [Product],
    getProductInfo(id: String): Product
    getProductPrice(id: String): ProductPrice
  }
`);

var root = {
  getProducts: () => getAllProduct(),
  getProductInfo: (req) => getProduct(req)
};

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

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
  console.log(req.id);
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



module.exports = app;
