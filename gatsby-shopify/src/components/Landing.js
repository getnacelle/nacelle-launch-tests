import React from 'react';
import styled from 'styled-components';
import HeroImage from './HeroImage';
import Products from './Products';

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

const LandingPage = ({ item, recentArrivals }) => {
  const { title, handle, content } = item;
  const src = item.featuredMedia ? item.featuredMedia.src : null;
  switch (handle) {
    case 'hero-banner':
      return (
        <article>
          {src && <HeroImage src={src} alt={title} title={title} />}
        </article>
      );
    case 'side-by-side':
      return (
        <article>
          <SideBySidePanel>
            {src && <HeroImage src={src} alt={title} />}
            <div>
              <h2>{title}</h2>
              <p>{content}</p>
            </div>
          </SideBySidePanel>
        </article>
      );
    case 'side-by-side-2':
      return (
        <article>
          <SideBySidePanel>
            <div>
              <h2>{title}</h2>
              <p>{content}</p>
            </div>
            {src && <HeroImage src={src} alt={title} />}
          </SideBySidePanel>
        </article>
      );
    case 'product-grid':
      return (
        <article>
          <CenteredTextBlock>
            <h2>{title}</h2>
            {src && <HeroImage src={src} alt={title} />}
            <p>{content}</p>
            {recentArrivals && <Products products={recentArrivals} />}
          </CenteredTextBlock>
        </article>
      );
    case 'testimonials':
      return <></>;
    default:
      return (
        <div>
          <h2>>{title}</h2>
          {src && <HeroImage src={src} alt={title} />}
        </div>
      );
  }
};

export default LandingPage;
