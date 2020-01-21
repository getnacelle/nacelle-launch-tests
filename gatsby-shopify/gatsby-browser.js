import React from 'react';
import { Provider } from 'react-redux';
import { store } from './src/state/store-with-middleware';
import Cart from './src/components/Cart';

export const wrapRootElement = ({ element }) => (
  <Provider store={store}>
    {element}
    <Cart />
  </Provider>
);
