import { gql } from 'apollo-boost';

export const GET_PRODUCTS = gql`
query($page: Int, $count: Int)    {
  getProducts(page: $page, count: $count) {
    id
    name
    shop
    brand
    link
    price
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

export const GET_COUNT_AND_PRODUCTS = gql`
query($page: Int, $count: Int)    {
  getCount
  getProducts(page: $page, count: $count) {
    id
    name
    shop
    brand
    link
    price
    img
  }
}`