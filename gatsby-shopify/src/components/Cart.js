import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'gatsby';
import { useCheckout } from '@nacelle/nacelle-react-hooks';
import styled from 'styled-components';
import Image from './Image';
import {
  increment,
  decrement,
  clearCart,
  toggleCart,
  storeCheckout
} from '../state/cart-actions';

const CartContainer = styled.div`
  position: fixed;
  top: 100px;
  right: 0;
  height: calc(100% - 100px);
  overflow: auto;
  border: 1px solid slategray;
  background-color: white;
  @media screen and (min-width: 769px) {
    width: 20em;
  }
  @media screen and (max-width: 768px) {
    width: 100%;
  }
  p {
    text-align: center;
  }
`;

const ButtonContainer = styled.div`
  margin: 1em 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 3em;
`;

const CartButton = styled.button`
  border: 1px solid rgba(0, 0, 0, 10%);
  width: 8em;
  border-radius: 5px;
  padding: 0.25em 2em;
  background-color: #212736;
  color: white;
  cursor: pointer;
`;

const Cart = () => {
  const lineItems = useSelector(state => state.cart.lineItems);
  const checkoutId = useSelector(state => state.cart.checkoutId);
  const dispatch = useDispatch();
  const credentials = {
    nacelle_space_id: process.env.GATSBY_NACELLE_SPACE_ID,
    nacelle_graphql_token: process.env.GATSBY_NACELLE_GRAPHQL_TOKEN
  };
  const [checkoutData, getCheckoutData, isLoading] = useCheckout(
    credentials,
    lineItems,
    checkoutId
  );
  useEffect(() => {
    if (checkoutData) {
      const payload = checkoutData.data.data.processCheckout;
      dispatch(storeCheckout(payload));
      window.location = payload.url;
    }
  }, [checkoutData, dispatch]);
  const isCartEmpty = lineItems.length === 0;
  return (
    <CartContainer>
      <div>
        <ButtonContainer>
          {!isCartEmpty && (
            <button
              type="button"
              onClick={() => getCheckoutData()}
              disabled={isLoading}
            >
              {isLoading ? <>Loading...</> : <>Checkout</>}
            </button>
          )}
        </ButtonContainer>
        {isCartEmpty ? (
          <ButtonContainer>
            <p>Your cart is empty</p>
            <button type="button" onClick={() => dispatch(toggleCart())}>
              Continue Shopping
            </button>
          </ButtonContainer>
        ) : (
          <CartItems lineItems={lineItems} />
        )}
      </div>
    </CartContainer>
  );
};

const CartMenu = () => {
  const isCartVisible = useSelector(state => state.cart.isCartVisible);
  const dispatch = useDispatch();
  return (
    <div>
      {isCartVisible && <Cart />}
      <CartButton type="button" onClick={() => dispatch(toggleCart())}>
        {isCartVisible ? 'Close' : 'Cart'}
      </CartButton>
    </div>
  );
};

const CartItemContainer = styled.div`
  border-bottom: 1px solid slategray;
`;

const CartItem = ({ item }) => {
  const dispatch = useDispatch();
  return (
    <CartItemContainer>
      <h3>
        {item.handle ? (
          <Link to={`/products/${item.handle}`}>{item.title}</Link>
        ) : (
          item.title
        )}
      </h3>
      <Image src={item.src} alt={item.title} />
      <p>{item.variant.title}</p>
      <p>
        Quantity: {item.variant.qty}
        <span style={{ marginLeft: '1em' }}>
          <button type="button" onClick={() => dispatch(decrement(item))}>
            -
          </button>
          <button type="button" onClick={() => dispatch(increment(item))}>
            +
          </button>
        </span>
      </p>
      <p>$ {(Number(item.variant.price) * item.variant.qty).toFixed(2)}</p>
    </CartItemContainer>
  );
};

const CartItems = ({ lineItems }) => {
  const dispatch = useDispatch();
  const total = lineItems.reduce(
    (subtotal, el) =>
      subtotal + Number(el.variant.price) * Number(el.variant.qty),
    0
  );
  return (
    <>
      <ButtonContainer>
        <button type="button" onClick={() => dispatch(clearCart())}>
          Clear Cart
        </button>
      </ButtonContainer>
      <div style={{ textAlign: 'center' }}>
        <h3>Total</h3>
        <p>$ {total.toFixed(2)}</p>
      </div>
      <ul style={{ listStyle: 'none' }}>
        {lineItems.map(el => (
          <li key={el.variant.id}>
            <CartItem item={el} />
          </li>
        ))}
      </ul>
    </>
  );
};

export default CartMenu;
