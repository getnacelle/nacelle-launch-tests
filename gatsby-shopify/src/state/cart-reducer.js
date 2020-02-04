import {
  ADD_TO_CART,
  INCREMENT_ITEM,
  DECREMENT_ITEM,
  CLEAR_CART,
  TOGGLE_CART,
  STORE_CHECKOUT
} from './cart-actions';

const initialState = {
  lineItems: [],
  isCartVisible: false,
  checkoutId: null,
  checkoutComplete: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case ADD_TO_CART: {
      const { lineItems } = state;
      const { title, handle, src, variant } = action.payload;
      const index = lineItems.findIndex(el => el.variant.id === variant.id);
      const variantInLineItems = index > -1;
      const qty = variantInLineItems ? lineItems[index].variant.qty + 1 : 1;
      if (variantInLineItems) {
        return {
          ...state,
          lineItems: [...lineItems].map((el, idx) =>
            idx === index ? { ...el, variant: { ...el.variant, qty } } : el
          )
        };
      }
      return {
        ...state,
        lineItems: [
          ...lineItems,
          { title, handle, src, variant: { ...variant, qty } }
        ],
        isCartVisible: true
      };
    }
    case INCREMENT_ITEM: {
      const { lineItems } = state;
      const { variant } = action.payload;
      const index = lineItems.findIndex(el => el.variant.id === variant.id);
      return {
        ...state,
        lineItems: [...lineItems].map((el, idx) =>
          idx === index
            ? { ...el, variant: { ...el.variant, qty: el.variant.qty + 1 } }
            : el
        )
      };
    }
    case DECREMENT_ITEM: {
      const { lineItems } = state;
      const { variant } = action.payload;
      const index = lineItems.findIndex(el => el.variant.id === variant.id);
      if (variant.qty > 1) {
        return {
          ...state,
          lineItems: [...lineItems].map((el, idx) =>
            idx === index
              ? { ...el, variant: { ...el.variant, qty: el.variant.qty - 1 } }
              : el
          )
        };
      }
      return {
        ...state,
        lineItems: [...lineItems].filter((_, idx) => idx !== index)
      };
    }
    case CLEAR_CART: {
      return {
        ...state,
        lineItems: []
      };
    }
    case TOGGLE_CART: {
      return {
        ...state,
        isCartVisible: !state.isCartVisible
      };
    }
    case STORE_CHECKOUT: {
      const { id, completed } = action.payload;
      return {
        ...state,
        checkoutId: id,
        checkoutComplete: completed
      };
    }
    default: {
      return state;
    }
  }
}
