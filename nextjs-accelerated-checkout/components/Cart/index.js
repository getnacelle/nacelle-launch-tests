import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCheckout, useCart } from "@nacelle/react-hooks";
import { formatCurrency } from "@nacelle/react-dev-utils";

import useDetectDevice from "hooks/useDetectDevice";

const checkoutCredentials = {
  nacelleSpaceId: process.env.NACELLE_SPACE_ID,
  nacelleGraphqlToken: process.env.NACELLE_GRAPHQL_TOKEN,
};

const Cart = () => {
  const [{ cart }, cartActions] = useCart();
  const { isMobile } = useDetectDevice();
  const [checkoutData, checkout, isCheckingOut] = useCheckout(
    checkoutCredentials,
    cart
  );

  useEffect(() => {
    if (checkoutData) {
      const { processCheckout } = checkoutData.data;
      window.location = processCheckout.url;
    }
  }, [checkoutData]);

  return (
    <div>
      <header>
        <h3>Your Cart</h3>
        <button onClick={cartActions.toggleCart}>
          <Image
            alt="cross for closing the cart"
            src="https://nacelle-assets.s3-us-west-2.amazonaws.com/default-close-icon.svg"
            width="15"
            height="25"
          />
        </button>
      </header>
      <section>
        {cart.map((item) => (
          <CartItem
            item={item}
            key={item.id}
            cartActions={cartActions}
            isMobile={isMobile}
          />
        ))}
      </section>
      <footer>
        <h4>
          <span>SubTotal:</span>
          <span>{calculateSubTotal(cart)}</span>
        </h4>
      </footer>
      <button onClick={checkout} disabled={!cart.length || isCheckingOut}>
        {isCheckingOut ? "Processing Cart..." : "Checkout"}
      </button>
    </div>
  );
};

const CartItem = ({ item, cartActions, isMobile }) => {
  const formatPrice = formatCurrency(item.locale, item.priceCurrency);

  const removeItemFromCart = () => cartActions.removeFromCart(item);

  return (
    <div>
      <Link href={`/products/${item.handle}`}>
        <a>
          <Image src={item.image.thumbnailSrc} width="100" height="70" />
        </a>
      </Link>

      <div css={{ width: "100%" }}>
        <div>
          <h4>{item.title}</h4>
          {isMobile && <span>{formatPrice(item.price)}</span>}
        </div>

        <div>
          {!isMobile && <span>{formatPrice(item.price)}</span>}
          <button onClick={removeItemFromCart}>Remove</button>
        </div>
      </div>
    </div>
  );
};

function calculateSubTotal(cart) {
  const cartLocale = cart.length ? cart[0].locale : "en-us";
  const cartCurrency = cart.length ? cart[0].priceCurrency : "USD";
  const formatPrice = formatCurrency(cartLocale, cartCurrency);

  const total = cart.reduce((subTotal, item) => {
    const itemTotal = item.quantity * parseInt(item.price, 10);
    return subTotal + itemTotal;
  }, 0);

  return formatPrice(total);
}

export default Cart;
