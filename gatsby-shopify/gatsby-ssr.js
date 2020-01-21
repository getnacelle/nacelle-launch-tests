import React from 'react';
import { Provider } from 'react-redux';
import { store } from './src/state/store-without-middleware';
import Cart from './src/components/Cart';

export const wrapRootElement = ({ element }) => (
  <Provider store={store}>
    {element}
    <Cart />
  </Provider>
);
