import React, { useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { setUserDevice } from 'src/state/user-actions';
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

const Layout = ({ children }) => {
  const dispatch = useDispatch();
  const isMobileScreen = useMediaQuery({ maxWidth: 768 });
  const isNotMobileScreen = useMediaQuery({ minWidth: 769 });
  const isMobile =
    // return undefined during SSR, return true / false in the browser
    isMobileScreen === true || isNotMobileScreen === true
      ? isMobileScreen
      : undefined;
  useEffect(() => {
    dispatch(setUserDevice({ isMobile }));
  }, [dispatch, isMobile]);
  return (
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
};

export default Layout;
