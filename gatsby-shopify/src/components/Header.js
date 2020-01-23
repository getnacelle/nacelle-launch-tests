import React from 'react';
import styled from 'styled-components';
import { Link, useStaticQuery, graphql } from 'gatsby';
import Cart from './Cart';

const NavElementStyle = {
  textDecoration: 'none',
  fontSize: '16px'
};

const HeaderStyle = styled.header`
  position: sticky;
  background: white;
  top: 0;
  padding: 0 4vw;
  z-index: 1;
  border: 1px solid hsla(0, 0%, 0%, 0.1);
  img {
    margin-bottom: 0;
  }
  a {
    color: black;
    display: flex;
    align-items: center;
  }
  button a {
    color: white;
    display: flex;
    justify-content: center;
  }
  .bm-item-list a {
    color: white;
  }
`;

const Inner = styled.div`
  height: 100px;
  margin: 0 auto;
  max-width: ${props => props.theme.maxWidth};
  padding: 1.45rem 0;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const NavBar = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const ActiveStyle = {
  color: 'rgb(181, 38, 123)'
};

const Links = () => {
  const linkListsQuery = useStaticQuery(graphql`
    {
      nacelle {
        getSpace {
          id
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
  const spaceId = linkListsQuery.nacelle.getSpace.id;
  const links = linkListsQuery.nacelle.getSpace.linklists
    .find(linkList => linkList.handle === 'main-menu')
    .links.map(link => ({ address: link.to, title: link.title }));
  return (
    <>
      <Link to="/">
        <img
          src={`https://d3ej2r3y1rjyfi.cloudfront.net/space/${spaceId}/logo.png`}
          alt="brand logo"
          width="150px"
        />
      </Link>
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
        <Links />
        <Cart />
      </NavBar>
    </Inner>
  </HeaderStyle>
);

export default Header;
