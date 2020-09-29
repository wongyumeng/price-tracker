import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { GET_PRODUCTS, GET_COUNT } from "../query/graph";
import CardDeck from 'react-bootstrap/CardDeck'
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Pagination from 'react-bootstrap/Pagination';
import { useHistory } from "react-router-dom";

const BACKARROW = "<";

const SortBy = (props) => {
  return (
    <select value={props.sorting} onChange={props.handleChange}>
        <option value="priceAsc">Price Low to High</option>
        <option value="priceDsc">Price High to Low</option>
        <option value="brand">Brand</option>
        <option value="shop">Shop</option>
    </select>
  );
}

const InputFilter = (props) => {
  const formList = Object.entries(props.obj.list).map(el => {
    return (
      <>
        <label className="label-filter"> {el[0]} </label>
        <input type="checkbox" checked={el[1]} onChange={(e) => props.handleChange(e, props.useSet)} value={el[0]}/>
        <br/>
      </>
    )
    })
  return (
    <fieldset>
      <legend>{props.obj.category}</legend>
        {formList}
    </fieldset>
  );
}

const SideBarFilter = (props) => {
  const brands = { category: "Brand", list: {} };
  const shops = { category: "Shop", list: {} };
  const [sorting, setSorting] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  props.items.forEach(item => {
    if (!(item.shops in shops.list)) {
      shops.list[item.shop] = false
    }
    if (!(item.brand in brands.list)) {
      brands.list[item.brand] = false
    }
  });

  const [b, setB] = useState(brands);
  const [s, setS] = useState(shops);


  const handleSubmit = (e) => {
    alert("submitted");
    e.preventDefault();
  }

  const handleChange = (e) => {
    if (e.target.name === "MinPrice") {
      setMinPrice(e.target.value);
    }
    if (e.target.name === "MaxPrice") {
      setMaxPrice(e.target.value);
    }
  }

  const handleCheckboxChange = (e, setFunc) => {
    let myValue = e.target.value;
    setFunc(prevState => {
      const newState = { 
        category: prevState.category,
        list: {
          ...prevState.list
        }
      };
      newState.list[myValue] = !newState.list[myValue];
      return newState;
    });
  }

  const handleSortChange = (e) => {
    console.log(e.target.value, sorting, 12)
    setSorting(e.target.value);
    console.log(e.target.value, sorting, 12)
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <SortBy sorting={sorting} handleChange={handleSortChange} pathName={props.pathName} searchQuery={props.searchQuery}/>
        <InputFilter obj={s} handleChange={handleCheckboxChange} useSet={setS}/>
        <InputFilter obj={b} handleChange={handleCheckboxChange} useSet={setB}/>
        <label>
          Minimum Price: 
          <input name="MinPrice" value={minPrice} onChange={handleChange}/>
        </label>
        <br></br>
        <label>
          Maximum Price: 
          <input name="MaxPrice" value={maxPrice} onChange={handleChange}/>
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

const setUpPages = (currentPage, totalRecords, searchQuery) => {
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
          <Link className="stretched-link" to={`/products/${currentPage - 1}` + searchQuery}></Link>
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
              <Link className="stretched-link" to={`/products/${number}` + searchQuery}></Link>
            </span>
          </li>
        )
      }
      else {
        items.push(
          <li className="page-item" key={items.length}>
            <span className="page-link">
              {number}
              <Link className="stretched-link" to={`/products/${number}` + searchQuery}></Link>
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
        <Link className=" stretched-link" to={`/products/${currentPage + 1}` + searchQuery}></Link>
      </Pagination.Next>
    );
  }
  return items;
}

const Products = ({ match, location }) => {
  console.log(location);
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

  const pages = setUpPages(pageNumber, dataC.getCount, location.search);
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
        <Link className="stretched-link" to={`/product/${product.id}`}></Link>
      </Card.Body>
    </Card>
  );

  
  return (
    <>
      <p>Found {dataC.getCount} products</p>
        <div className="container-random">
          <div className="sidebar">
            <SideBarFilter className="sidebar" items={data.getProducts} pathName={location.pathname} searchQuery={location.search}/>
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