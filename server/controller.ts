export {};

const { buildSchema } = require('graphql');
const repository = require('./repository')
const { graphqlHTTP } = require('express-graphql');

const schema = buildSchema(`
type Product {
  id: String
  shop: String
  brand: String
  name: String
  link: String
  price: String
  priceValue: Float
  currency: String
  img: String
}
type ProductPrice {
  id: String
  price: String
  priceValue: Float
  date: String
}
type Query {
  getProducts(count: Int, page: Int, paramA: [String], paramB: [String]): [Product],
  getProductInfo(id: String): Product
  getProductPrices(id: String): [ProductPrice]
  getCount(paramA: [String], paramB: [String]): Int
}
`);

const root = {
  getCount: (req) => repository.getCount(req.paramA, req.paramB),
  getProducts: (req) => repository.getAllProducts(req.count, req.page, req.paramA, req.paramB),
  getProductInfo: (req) => repository.getProductById(req.id),
  getProductPrices: (req) => repository.getProductPricesById(req.id)
};

const graphql = graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
});

module.exports = graphql;