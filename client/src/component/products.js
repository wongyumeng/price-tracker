import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { GET_PRODUCTS, GET_COUNT } from "../query/graph";
import CardDeck from 'react-bootstrap/CardDeck'
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Pagination from 'react-bootstrap/Pagination';

const BACKARROW = "<";

const SortBy = () => {
  return (
    <form className="fixed">
      <select name="sort">
          <option value="">Sort By</option>
          <option value="priceAsc">Price Low to High</option>
          <option value="priceDsc">Price High to Low</option>
          <option value="brand">Brand</option>
          <option value="shop">Shop</option>
      </select>
    </form>
  );
}

const SideBarFilter = (props) => {
  const brands = [];
  const shops = [];
  const items = props.items;
  items.forEach(item => {
    brands.push(item.brand);
    shops.push(item.shop);
  });

  const InputFilter = (category, list) => {
    const formList = list.map(el => {
      return (
        <>
          <label className="label-filter"> {el} </label>
          <input name={category.toLowerCase()} type="checkbox" value={el}/>
          <br/>
        </>
      );
    })
    return (
      <fieldset>
        <legend>{category}</legend>
        {formList}
      </fieldset>
    );
  }

  const handleSubmit = (e) => {
    alert("submitted");
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        {InputFilter("Brand", [...new Set(brands)])}
        {InputFilter("Shop", [...new Set(shops)])}
        <label>
          Minimum Price: 
          <input name="MinPrice" value="123"/>
        </label>
        <br></br>
        <label>
          Maximum Price: 
          <input name="MaxPrice" type="number"/>
        </label>
        <input type="submit" value="Submit"/>
      </form>
    </>
  );
}

const WrapCards = (props) => {
  const cards = props.cards;
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
      <Pagination.Prev active="false" key={items.length}></Pagination.Prev>
    );
  }
  else {
    items.push(
      <li className="page-item" key={items.length}>
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
          <li className="page-item active" key={items.length}>
            <span className="page-link">
              {number}
              <Link className="stretched-link" to={`/products/${number}`}></Link>
            </span>
          </li>
        )
      }
      else {
        items.push(
          <li className="page-item" key={items.length}>
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
      <Pagination.Next key={items.length}></Pagination.Next>
    );
  }
  else {
    items.push(
      <Pagination.Next key={items.length}>
        <Link className=" stretched-link" to={`/products/${currentPage + 1}`}></Link>
      </Pagination.Next>
    );
  }
  return items;
}

const Products = ({ match, location }) => {
  let pageNumber;
  const pA = [];
  const pB = [];
  const pageLimit = 30;
  const { params: { page } } = match;
  const searchParams = new URLSearchParams(location.search);

  for (let p of searchParams) {
    pA.push(p[0]);
    pB.push(p[1]);
  }
  if (page == undefined || page <= 1) {
    pageNumber = 1;
  } else {
    pageNumber = Number(page);
  }
  const { loading: loadingC, error: errorC, data: dataC } = useQuery(GET_COUNT, { variables: { paramA: pA, paramB: pB }});
  const { loading, error, data } = useQuery(GET_PRODUCTS, { variables: { count: pageLimit, page: pageNumber, paramA: pA, paramB: pB }});

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
      <SortBy/>
      <p>Found {dataC.getCount} products</p>
        <div class="container-random">
          <div className="sidebar">
            <SideBarFilter className="sidebar" items={data.getProducts}/>
          </div>
          <div className="fixed">
            <WrapCards className="fixed" cards={cards}/>
          </div>
        </div>
      <br></br>
      <Pagination>{pages}</Pagination>
    </>
  );
}

export default Products;