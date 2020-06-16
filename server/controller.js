const { buildSchema } = require('graphql');
const repository = require('./repository')
const graphqlHTTP = require('express-graphql');

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
  getProducts: [Product],
  getProductInfo(id: String): Product
  getProductPrice(id: String): [ProductPrice]
}
`);

const root = {
  getProducts: () => repository.getAllProducts(),
  getProductInfo: (req) => repository.getProductById(req.id),
  getProductPricesById: (req) => repository.getProductPricesById(req.id)
};

const graphql = graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
});

module.exports = graphql;