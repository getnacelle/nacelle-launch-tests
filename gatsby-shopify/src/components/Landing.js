import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import BannerImage from './BannerImage';
import Products from './Products';

const CenteredTextBlock = styled.div`
  text-align: center;
  padding-top: 2em;
`;

const CenteredBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2em;
  p {
    max-width: 30em;
  }
  @media screen and (max-width: 768px) {
    height: 30em;
  }
`;

const SideBySidePanel = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  text-align: center;
  border: 1px solid rgba(0, 0, 0, 10%);
`;

const LandingPage = ({ item, recentArrivals }) => {
  const isMobile = useSelector(state => state.user.isMobile);
  const { title, handle, content } = item;
  const src = item.featuredMedia ? item.featuredMedia.src : null;
  switch (handle) {
    case 'hero-banner':
      return (
        <article>
          {src && (
            <BannerImage
              src={src}
              alt={title}
              title={title}
              height="100vh"
              fill
            />
          )}
        </article>
      );
    case 'side-by-side':
      return (
        <article>
          {isMobile && (
            <>
              {src && <BannerImage src={src} alt={title} minHeight="400px" />}
              <CenteredBlock>
                <h2>{title}</h2>
                <p>{content}</p>
              </CenteredBlock>
            </>
          )}
          {!isMobile && (
            <SideBySidePanel>
              {src && (
                <BannerImage
                  src={src}
                  alt={title}
                  title={title}
                  minHeight="400px"
                />
              )}
              <CenteredBlock>
                <h2>{title}</h2>
                <p>{content}</p>
              </CenteredBlock>
            </SideBySidePanel>
          )}
        </article>
      );
    case 'side-by-side-2':
      return (
        <article>
          {isMobile && (
            <>
              {src && <BannerImage src={src} alt={title} minHeight="400px" />}
              <CenteredBlock>
                <h2>{title}</h2>
                <p>{content}</p>
              </CenteredBlock>
            </>
          )}
          {!isMobile && (
            <SideBySidePanel>
              <CenteredBlock>
                <h2>{title}</h2>
                <p>{content}</p>
              </CenteredBlock>
              {src && (
                <BannerImage
                  src={src}
                  alt={title}
                  title={title}
                  minHeight="400px"
                />
              )}
            </SideBySidePanel>
          )}
        </article>
      );
    case 'product-grid':
      return (
        <article>
          <CenteredTextBlock>
            <h2>{title}</h2>
            {src && <BannerImage src={src} alt={title} />}
            <p>{content}</p>
            {recentArrivals && <Products products={recentArrivals} />}
          </CenteredTextBlock>
        </article>
      );
    case 'testimonials':
      return null;
    default:
      return (
        <div>
          <h2>>{title}</h2>
          {src && <BannerImage src={src} alt={title} />}
        </div>
      );
  }
};

export default LandingPage;
