import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import BannerImage from './BannerImage';
import Products from './Products';
import Description from './Description';

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
  direction: ${({ flip }) => (flip ? 'rtl' : 'ltr')};
`;

const LandingPage = ({ item, recentArrivals }) => {
  const isMobile = useSelector(state => state.user.isMobile);
  const { title, content, handle, tags } = item;
  const src = item.featuredMedia ? item.featuredMedia.src : null;
  const contentType = tags.find(el => el.includes('field::contentType'));
  switch (contentType.split('::')[2]) {
    case 'ContentHeroBanner': {
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
    }
    case 'ContentSideBySide': {
      const shouldFlip = ['2', '4', '6', '8', '10'].some(el =>
        handle.includes(el)
      );
      return (
        <article>
          {isMobile && (
            <>
              {src && <BannerImage src={src} alt={title} minHeight="300px" />}
              <CenteredBlock>
                <h2>{title}</h2>
                <Description content={content} />
              </CenteredBlock>
            </>
          )}
          {!isMobile && (
            <SideBySidePanel flip={shouldFlip}>
              {src && (
                <BannerImage src={src} alt={title} minHeight="400px" fill />
              )}
              <CenteredBlock>
                <h2>{title}</h2>
                <Description content={content} />
              </CenteredBlock>
            </SideBySidePanel>
          )}
        </article>
      );
    }
    case 'ContentProductGrid': {
      return (
        <article>
          <CenteredTextBlock>
            <h2>{title}</h2>
            {src && <BannerImage src={src} alt={title} />}
            <Description content={content} />
            {recentArrivals && <Products products={recentArrivals} />}
          </CenteredTextBlock>
        </article>
      );
    }
    case 'ContentTestimonial':
      return null;
    case 'ContentTestimonials':
      return null;
    default:
      return (
        <div>
          <h2>>{contentType}</h2>
          {src && <BannerImage src={src} alt={title} />}
        </div>
      );
  }
};

export default LandingPage;
