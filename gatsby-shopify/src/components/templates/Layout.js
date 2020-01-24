import React from 'react';
import styled from 'styled-components';
import Header from '../Header';
import '../../styles/layout.css';

const Container = styled.div`
  position: relative;
  min-height: 100vh;
`;

const Main = styled.main`
  display: flex;
  flex-direction: column;
  justify-content: center;
  h1 {
    margin-top: 1em;
  }
`;

const Layout = ({ children }) => (
  <Container>
    <Header />
    <Main>{children}</Main>
  </Container>
);

export default Layout;
