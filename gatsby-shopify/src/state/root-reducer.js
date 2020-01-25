import { combineReducers } from 'redux';

import cart from './cart-reducer';
import user from './user-reducer';

const rootReducer = combineReducers({
  cart,
  user
});

export default rootReducer;
