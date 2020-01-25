import React from 'react';
import styled from 'styled-components';
import Header from './Header';
import '../styles/layout.css';

const CenteredText = styled.div`
  text-align: center;
  a {
    text-decoration: none;
  }
`;

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
  <>
    <Container>
      <Header />
      <Main>{children}</Main>
    </Container>
    <footer>
      <CenteredText>
        © {new Date().getFullYear()}, Built with
        {` `}
        <a
          href="https://www.getnacelle.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Nacelle
        </a>
        {` and `}
        <a
          href="https://www.gatsbyjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Gatsby
        </a>
      </CenteredText>
    </footer>
  </>
);

export default Layout;
