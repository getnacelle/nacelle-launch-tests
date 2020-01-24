import React from 'react';
import { Link, useStaticQuery, graphql } from 'gatsby';

const Logo = () => {
  const spaceIdQuery = useStaticQuery(graphql`
    {
      nacelle {
        getSpace {
          id
        }
      }
    }
  `);
  const spaceId = spaceIdQuery.nacelle.getSpace.id;
  return (
    <Link to="/">
      <img
        src={`https://d3ej2r3y1rjyfi.cloudfront.net/space/${spaceId}/logo.png`}
        alt="brand logo"
        width="150px"
      />
    </Link>
  );
};

export default Logo;
