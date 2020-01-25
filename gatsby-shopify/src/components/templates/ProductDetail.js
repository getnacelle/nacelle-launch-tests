import React from 'react';
import styled from 'styled-components';
import Layout from 'src/components/Layout';
import { Product, SEO } from 'src/components';

const CenteredTextBlock = styled.div`
  text-align: center;
  padding-top: 2em;
`;

const SideBySidePanel = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  text-align: center;
  border: 1px solid rgba(0, 0, 0, 10%);
  div {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2em;
    p {
      max-width: 30em;
    }
  }
`;

const ProductDetail = ({ pageContext }) => {
  const { title, handle, description, imageSrc, variants } = pageContext;
  return (
    <Layout>
      <SEO title={title} />
      <SideBySidePanel>
        <div>
          <Product handle={handle} src={imageSrc} variants={variants} />
        </div>
        <div>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
      </SideBySidePanel>
    </Layout>
  );
};

export default ProductDetail;
