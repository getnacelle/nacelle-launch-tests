import React from 'react';
import styled from 'styled-components';
import Image from './Image';

const HeroContainer = styled.div`
  margin: 0 auto;
  position: relative;
  width: 100%;
  min-height: 18em;
  display: flex;
  align-items: center;
  picture {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
  }
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  div {
    margin: 0 auto;
    min-width: 12em;
    padding: 1em;
    border: 1px solid white;
    border-radius: 4px;
    background-color: rgba(255, 255, 255, 95%);
    text-align: center;
    h1 {
      margin: 0;
    }
  }
`;

const HeroImage = ({ title, src }) => (
  <HeroContainer>
    <Image src={src} alt={title} />
    {title && (
      <div>
        <h1>{title}</h1>
      </div>
    )}
  </HeroContainer>
);

export default HeroImage;
