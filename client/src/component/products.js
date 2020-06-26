import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { GET_PRODUCTS } from "../query/graph";
import CardDeck from 'react-bootstrap/CardDeck'
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card'


const wrapCards = (cards) => {
  const deck = [];
  cards.forEach((card, i) => {
    const index = Math.floor(i/5);
    if (deck.length === index) {
      deck.push([]);
    }
    deck[index].push(card);
  })
  return deck.map((cards, index) => 
    <CardDeck key={index}>
      {cards}
    </CardDeck>
  );
}

const Products = ({ match }) => {
  const productCount = 30;
  const { params: { pageCount } } = match;
  if (pageCount == undefined || pageCount <= 1) {
    const page = 1;
  } else {
    const page = pageCount;
  }
  const { loading, error, data } = useQuery(GET_PRODUCTS);

  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;

  const cards = data.getProducts.map(product => 
    <Card key={product.id}>
      <Card.Img src={product.img} />
      <Card.Body>
        <Card.Title>{product.brand}</Card.Title>
        <Card.Text>
          {product.name}
        </Card.Text>
        <Card.Text>
          {product.price}
        </Card.Text>
        <Link className=" stretched-link" to={`/product/${product.id}`}></Link>
      </Card.Body>
    </Card>
  );
  return (
    <>
    {wrapCards(cards)}
    </>
  );
}

export default Products;