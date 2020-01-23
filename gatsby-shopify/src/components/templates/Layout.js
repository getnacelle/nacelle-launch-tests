import React from 'react';
import styled from 'styled-components';
import Header from '../Header';
import '../../styles/layout.css';

const Container = styled.div`
  position: relative;
  min-height: 100vh;
`;

const Layout = ({ children }) => (
  <Container>
    <Header />
    <main>{children}</main>
  </Container>
);

export default Layout;
