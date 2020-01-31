import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import Layout from 'src/components/Layout';
import { Product, SEO } from 'src/components';

const Container = styled.div`
  margin: 0 auto;
  width: ${({ isMobile }) => (isMobile ? '80%' : 'auto')};
  max-width: 50em;
`;

const SideBySidePanel = styled.div`
  display: grid;
  grid-template-columns: ${({ isMobile }) => (isMobile ? '1fr' : '1fr 1fr')};
  text-align: center;
  div {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 2em;
    margin-bottom: 2em;
    article {
      padding-left: 0;
      padding-right: 0;
    }
    p {
      max-width: 30em;
      padding: 0 2em;
    }
  }
`;

const ProductDetail = ({ pageContext }) => {
  const { title, handle, description, imageSrc, variants } = pageContext;
  const isMobile = useSelector(state => state.user.isMobile);
  return (
    <Layout>
      <SEO title={title} />
      <Container isMobile={isMobile}>
        <SideBySidePanel isMobile={isMobile}>
          <div>
            <Product
              handle={handle}
              src={imageSrc}
              variants={variants}
              link={false}
            />
          </div>
          <div>
            <h3>{title}</h3>
            <p>{description}</p>
          </div>
        </SideBySidePanel>
      </Container>
    </Layout>
  );
};

export default ProductDetail;
