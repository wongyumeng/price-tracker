import React from 'react';
import Image from 'react-bootstrap/Image'
import { useQuery } from '@apollo/react-hooks';
import { GET_PRODUCT } from "../query/graph";
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'


const Product = ({ match, location }) => {
  const { params: { id } } = match;
  console.log(id);
  const { loading, error, data } = useQuery(GET_PRODUCT, { variables: { id: id}});

  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;

  return (
    <Container>
      <Row>
        <Col><Image src={data.getProductInfo.img}></Image></Col>
        <Col>
          <p>{data.getProductInfo.brand}</p>
          <p>{data.getProductInfo.name}</p>
          <p>{data.getProductInfo.price}</p>
        </Col>
      </Row>
    </Container>
  );
}

export default Product;