import React from 'react';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Layout from './component/layout';
import Home from './component/home';
import Products from './component/products';
import Calculator from './component/calculator';
import Product from './component/product';
import * as V from 'victory';
import './App.css'

function App() {

  return (
    <Router>
      <Layout>
          <Route path='/home' component={Home} />
          <Route path='/products' component={Products} />
          <Route path='/calculator' component={Calculator} />
          <Route path='/product/:id' component={Product}/>
      </Layout>
    </Router>
  )
}

export default App;