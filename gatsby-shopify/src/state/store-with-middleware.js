import { createStore, applyMiddleware } from 'redux';
import { save, load } from 'redux-localstorage-simple';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from './root-reducer';

export const store = createStore(
  rootReducer,
  load(),
  composeWithDevTools(applyMiddleware(save()))
);
