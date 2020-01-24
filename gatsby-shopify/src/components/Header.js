import React from 'react';
import styled from 'styled-components';
import { Link, useStaticQuery, graphql } from 'gatsby';
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
  @media screen and (max-width: 1199px) {
    min-width: 30em;
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

const Header = () => (
  <HeaderStyle>
    <Inner>
      <NavBar aria-label="Main Navigation" right>
        <Logo />
        <LinkBar>
          <Links />
        </LinkBar>
        <Cart />
      </NavBar>
    </Inner>
  </HeaderStyle>
);

export default Header;
