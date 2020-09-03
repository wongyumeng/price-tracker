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
  img: String
}
type ProductPrice {
  id: String
  price: String
  date: String
}
type Query {
  getProducts(count: Int, page: Int, paramA: [String], paramB: [String]): [Product],
  getProductInfo(id: String): Product
  getProductPrices(id: String): [ProductPrice]
  getCount: Int
}
`);

const root = {
  getProducts: (req) => repository.getAllProducts(req.count, req.page, req.paramA, req.paramB),
  getProductInfo: (req) => repository.getProductById(req.id),
  getProductPrices: (req) => repository.getProductPricesById(req.id),
  getCount: () => repository.getCount()
};

const graphql = graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
});

module.exports = graphql;