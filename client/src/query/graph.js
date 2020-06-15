import { gql } from 'apollo-boost';

export const GET_PRODUCTS = gql`
{
  getProducts {
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