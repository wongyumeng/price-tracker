import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { GET_PRODUCTS, GET_COUNT } from "../query/graph";
import CardDeck from 'react-bootstrap/CardDeck'
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card'
import Pagination from 'react-bootstrap/Pagination'
import PageItem from 'react-bootstrap/PageItem'
import Nav from 'react-bootstrap/Nav'

const BACKARROW = "<"

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
    <>
      <CardDeck key={index}>
        {cards}
      </CardDeck>
      <br></br>
    </>
  );
}

const setUpPages = (currentPage, totalRecords) => {
  const pageLimit = 30;
  const items = [];
  const initialPage = currentPage - 3 <= 1 ? 1 : currentPage;
  const totalPages = Math.ceil(totalRecords/pageLimit);
  if (currentPage <= 1) {
    items.push(
      <Pagination.Prev active="false" ></Pagination.Prev>
    );
  }
  else {
    items.push(
      <li className="page-item">
        <span className="page-link">
          {BACKARROW}
          <Link className="stretched-link" to={`/products/${currentPage - 1}`}></Link>
        </span>
      </li>
    );
  }
  for (let number = initialPage; number <= currentPage + 2; number++) {
    if (number <= totalPages) {
      if (number === currentPage) {
        items.push(
          <li className="page-item active">
            <span className="page-link">
              {number}
              <Link className="stretched-link" to={`/products/${number}`}></Link>
            </span>
          </li>
        )
      }
      else {
        items.push(
          <li className="page-item">
            <span className="page-link">
              {number}
              <Link className="stretched-link" to={`/products/${number}`}></Link>
            </span>
          </li>
        )
      }
    }
    else {
      break;
    }
  }
  if (currentPage >= totalPages) {
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

const Products = ({ match, location }) => {
  let pageNumber;
  const pageLimit = 30;
  const { params: { page } } = match;
  const params = new URLSearchParams(location.search);
  console.log(page);
  console.log(location);
  console.log(match);
  for (let p of params) {
    console.log(p);
  }
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
      <Nav defaultActiveKey="/home" className="col-md-2 d-none d-md-block bg-light sidebar">
        <Nav.Link href="/home">Active</Nav.Link>
        <Nav.Link eventKey="link-1">Link</Nav.Link>
        <Nav.Link eventKey="link-2">Link</Nav.Link>
        <Nav.Link eventKey="disabled" disabled>
          Disabled
        </Nav.Link>
      </Nav>
      <>
        <p>Found {dataC.getCount} products</p>
        {wrapCards(cards)}
      </>
      <br></br>
      <Pagination>{pages}</Pagination>
    </>
  );
}

export default Products;