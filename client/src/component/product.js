import React from 'react';
import Image from 'react-bootstrap/Image'
import { useQuery } from '@apollo/react-hooks';
import { GET_PRODUCT, GET_PRODUCT_PRICES } from "../query/graph";
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { VictoryLine, VictoryChart, VictoryAxis } from 'victory';


const Product = ({ match }) => {
  const { params: { id } } = match;
  // const { loading, error, data } = useQuery(GET_PRODUCT, { variables: { id: id}});
  const product = useQuery(GET_PRODUCT, { variables: { id: id}});
  const productPrices = useQuery(GET_PRODUCT_PRICES, { variables: { id: id}});

  if (product.loading || productPrices.loading) return 'Loading...';
  if (product.error || productPrices.error) return `Error!`;

  const prices = productPrices.data.getProductPrices.map(product => {
    const p = {}
    const d = product.date.split('T')[0].split('-')
    p.x = new Date(d[0], d[1], d[2]);
    p.y = Number(product.price.substr(1));
    return p;
  });

  return (
    <Container>
      <Row>
        <Col><Image src={product.data.getProductInfo.img}></Image></Col>
        <Col>
          <p>{product.data.getProductInfo.brand}</p>
          <p>{product.data.getProductInfo.name}</p>
          <p>{product.data.getProductInfo.price}</p>
        </Col>
      </Row>
      <Row>

      </Row>
      <Row>
      <VictoryChart
            width={550}
            height={300}
            scale={{x: "time"}}
          >
            <VictoryLine
              style={{
                data: {stroke: "tomato"}
              }}
              data={prices}
            />

          </VictoryChart>
      </Row>
    </Container>
  );
}

export default Product;