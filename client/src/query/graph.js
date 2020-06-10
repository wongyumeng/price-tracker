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
  }
}`