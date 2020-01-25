export const ADD_TO_CART = 'ADD_TO_CART';
export const INCREMENT_ITEM = 'INCREMENT_ITEM';
export const DECREMENT_ITEM = 'DECREMENT_ITEM';
export const CLEAR_CART = 'CLEAR_CART';
export const TOGGLE_CART = 'TOGGLE_CART';
export const STORE_CHECKOUT = 'STORE_CHECKOUT';

export function addToCart(payload) {
  return {
    type: ADD_TO_CART,
    payload
  };
}

export function increment(payload) {
  return {
    type: INCREMENT_ITEM,
    payload
  };
}

export function decrement(payload) {
  return {
    type: DECREMENT_ITEM,
    payload
  };
}

export function clearCart() {
  return {
    type: CLEAR_CART
  };
}

export function toggleCart() {
  return {
    type: TOGGLE_CART
  };
}

export function storeCheckout(payload) {
  return {
    type: STORE_CHECKOUT,
    payload
  };
}
