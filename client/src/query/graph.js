import { gql } from 'apollo-boost';

export const GET_PRODUCTS = gql`
query($page: Int, $count: Int, $paramA: [String], $paramB: [String])    {
  getProducts(page: $page, count: $count, paramA: $paramA, paramB: $paramB) {
    id
    name
    shop
    brand
    link
    price
    priceValue
    img
  }
}`;

export const GET_PRODUCT = gql`
query($id: String) {
  getProductInfo(id: $id) {
    id
    name
    shop
    brand
    link
    price
    img
  }
}`;

export const GET_PRODUCT_PRICES = gql`
query($id: String) {
  getProductPrices(id: $id) {
    price
    date
  }
}`;

export const GET_COUNT = gql`
{
  getCount
}
`