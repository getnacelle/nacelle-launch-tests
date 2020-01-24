import React from 'react';
import styled from 'styled-components';
import { HeroImage } from 'src/components';
import Layout from 'src/components/Layout';

const Container = styled.div`
  margin: 0 auto;
  padding: 0 2rem;
  div {
    margin: 2em auto;
  }
  h1 {
    text-align: center;
  }
`;

const ContentPage = ({ pageContext }) => {
  const { title, content, imageSrc } = pageContext;
  return (
    <Layout>
      <Container>
        <h1>{title}</h1>
        {imageSrc && <HeroImage src={imageSrc} alt={title} />}
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </Container>
    </Layout>
  );
};

export default ContentPage;
