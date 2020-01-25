import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, useStaticQuery, graphql } from 'gatsby';
import { useSelector } from 'react-redux';
import { HamburgerSpring } from 'react-animated-burgers';
import Cart from './Cart';
import Logo from './Logo';

const NavElementStyle = {
  textDecoration: 'none',
  fontSize: '16px'
};

const HeaderStyle = styled.header`
  position: sticky;
  background: white;
  top: 0;
  height: 100px;
  padding: 0 4vw;
  z-index: 1;
  border: 1px solid hsla(0, 0%, 0%, 0.1);
  img {
    margin-bottom: 0;
  }
  a {
    display: flex;
    align-items: center;
    color: black;
  }
`;

const Inner = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: 100px;
  max-width: ${props => props.theme.maxWidth};
  margin: 0 auto;
  padding: 1.45rem 0;
`;

const NavBar = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const LinkBar = styled.span`
  display: flex;
  justify-content: space-between;
  @media screen and (min-width: 1200px) {
    min-width: 45em;
  }
  @media screen and (min-width: 768px) and (max-width: 1199px) {
    min-width: 25em;
  }
  @media screen and (max-width: 767px) {
    flex-direction: column;
    align-items: center;
  }
`;

const MobileMenuContainer = styled.div`
  position: fixed;
  top: 100px;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  border: 1px solid slategray;
  background-color: white;
  padding: 2em;
  line-height: 3;
  p {
    text-align: center;
  }
`;

const ActiveStyle = {
  color: 'rgb(181, 38, 123)'
};

const Links = () => {
  const linkListsQuery = useStaticQuery(graphql`
    {
      nacelle {
        getSpace {
          linklists {
            handle
            links {
              to
              title
            }
          }
        }
      }
    }
  `);
  const links = linkListsQuery.nacelle.getSpace.linklists
    .find(linkList => linkList.handle === 'main-menu')
    .links.map(link => ({ address: link.to, title: link.title }));
  return (
    <>
      {links.map(el => (
        <Link
          to={el.address}
          style={NavElementStyle}
          activeStyle={ActiveStyle}
          key={el.title}
        >
          {el.title}
        </Link>
      ))}
    </>
  );
};

const Header = () => {
  const isMobile = useSelector(state => state.user.isMobile);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const toggleNav = () => setIsNavOpen(!isNavOpen);
  return (
    <HeaderStyle>
      <Inner>
        <NavBar aria-label="Main Navigation" right>
          {isMobile && isNavOpen && (
            <MobileMenuContainer>
              <LinkBar>
                <Logo />
                <Links />
              </LinkBar>
            </MobileMenuContainer>
          )}
          {isMobile && (
            <HamburgerSpring isActive={isNavOpen} toggleButton={toggleNav} />
          )}
          {!isMobile && (
            <>
              <Logo />
              <LinkBar>
                <Links />
              </LinkBar>
            </>
          )}
          <Cart />
        </NavBar>
      </Inner>
    </HeaderStyle>
  );
};

export default Header;
