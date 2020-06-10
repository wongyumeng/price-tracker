import React from 'react';
import Container from 'react-bootstrap/Container';
import Header from './header';

const Layout = (props) => {
  return (
    <div>
    <Container flex>
      <Header/>
      {props.children}
    </Container>
    </div>
  );
}

export default Layout;