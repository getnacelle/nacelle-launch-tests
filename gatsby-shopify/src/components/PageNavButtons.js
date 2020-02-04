import React from 'react';
import { Link } from 'gatsby';
import styled from 'styled-components';

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 2em;
`;

const LoadButton = styled.button`
  border: 1px solid rgba(0, 0, 0, 10%);
  width: 14em;
  height: 3em;
  border-radius: 5px;
  padding: 0.25em 2em;
  background-color: #0a2a7b;
  cursor: pointer;
  color: white;
  text-decoration: none;
`;

const PageNavButtons = ({ handle, currentPage, numPages, path }) => {
  const isPaginated = currentPage && numPages;
  const isPageForward = isPaginated && currentPage < numPages;
  const isPageBack = isPaginated && currentPage > 1;
  const [pathPrefix] = path.split(handle);
  const packBackPath =
    isPaginated && currentPage === 2
      ? `${pathPrefix}${handle}`
      : `${pathPrefix}${handle}/${currentPage - 1}`;
  const pageForwardPath = `${pathPrefix}${handle}/${currentPage + 1}`;
  return (
    <ButtonsContainer>
      {isPageBack && handle && (
        <Link to={packBackPath}>
          <LoadButton type="button">Previous</LoadButton>
        </Link>
      )}
      {isPageForward && handle && (
        <Link to={pageForwardPath}>
          <LoadButton type="button">Next</LoadButton>
        </Link>
      )}
    </ButtonsContainer>
  );
};

PageNavButtons.defaultProps = {
  currentPage: null,
  numPages: null,
  handle: '',
  path: ''
};

export default PageNavButtons;
