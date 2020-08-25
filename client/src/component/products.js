import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { GET_PRODUCTS, GET_COUNT } from "../query/graph";
import CardDeck from 'react-bootstrap/CardDeck'
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card'
import Pagination from 'react-bootstrap/Pagination'
import PageItem from 'react-bootstrap/PageItem'


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

const setUpPages = (currentPage, totalRecords) => {
  const pageLimit = 30;
  const items = [];
  const initialPage = currentPage - 3 <= 1 ? 1 : currentPage;
  const totalPages = Math.ceil(totalRecords/pageLimit);
  if (currentPage <= 1) {
    items.push(
      <Pagination.Prev></Pagination.Prev>
    );
  }
  else {
    items.push(
      <Pagination.Prev>
        <Link className=" stretched-link" to={`/products/${currentPage - 1}`}></Link>
      </Pagination.Prev>
    );
  }
  for (let number = initialPage; number <= currentPage + 2; number++) {
    if (number <= totalPages) {
      items.push(
        <Pagination.Item key={number} active={number === currentPage}>
          {number}
          <Link className=" stretched-link" to={`/products/${number}`}></Link>
        </Pagination.Item>
      );
    }
    else {
      break;
    }
  }
  if (currentPage >= totalRecords) {
    items.push(
      <Pagination.Next></Pagination.Next>
    );
  }
  else {
    items.push(
      <Pagination.Next>
        <Link className=" stretched-link" to={`/products/${currentPage + 1}`}></Link>
      </Pagination.Next>
    );
  }
  return items;
}

const Products = ({ match }) => {
  let pageNumber;
  const pageLimit = 30;
  const { params: { page } } = match;
  if (page == undefined || page <= 1) {
    pageNumber = 1;
  } else {
    pageNumber = Number(page);
  }
  const { loading: loadingC, error: errorC, data: dataC } = useQuery(GET_COUNT);
  const { loading, error, data } = useQuery(GET_PRODUCTS, { variables: { count: pageLimit, page: pageNumber }});

  if (loading || loadingC) return 'Loading...';
  if (error || errorC) return `Error! ${error.message} ${errorC.message}`;

  if (pageNumber > Math.ceil(dataC.getCount/pageLimit)) {
    return `Error! Page not found`;
  }


  const pages = setUpPages(pageNumber, dataC.getCount);
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
    <p>Found {dataC.getCount} products</p>
    {wrapCards(cards)}
    <br></br>
    <Pagination>{pages}</Pagination>
    </>
  );
}

export default Products;