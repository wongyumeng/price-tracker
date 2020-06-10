import React from 'react';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Layout from './component/layout';
import Home from './component/home';
import Products from './component/products';
import Calculator from './component/calculator';

function App() {
  // const getAllProducts = useQuery(GET_PRODUCTS);
  // console.log(getAllProducts);
  // if (getAllProducts.loading) return <p>Hello</p>
  // if (getAllProducts.error) return <React.Fragment>Error :(</React.Fragment>;

  return (
    <Router>
      <Layout>
          <Route path='/home' component={Home} />
          <Route path='/products' component={Products} />
          <Route path='/calculator' component={Calculator} />
      </Layout>
    </Router>
  )
}

export default App;