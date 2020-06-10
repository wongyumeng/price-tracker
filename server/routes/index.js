var express = require('express');
var router = express.Router();
const mongoClient = require("mongodb");

const mongoURL = "mongodb://localhost:27017/"
mongoClient.connect(mongoURL, async function(err, client) {
  if (!err) {
    console.log("Connected");
  }
  const db = client.db("test");
  const collection = db.collection("product");

  const products = await collection.find({}).toArray();
  router.get('/', function(req, res, next) {
    console.log(products);
    res.render("index", { item : products});
  });
  client.close();
})
// newProducts.forEach(e => console.log(e));


/* GET home page. */

module.exports = router;
