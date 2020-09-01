import React from 'react';
import Container from 'react-bootstrap/Container';
import Header from './header';

const Layout = (props) => {
  return (
    <Container fluid>
      <Header/>
      {props.children}
    </Container>
  );
}

export default Layout;