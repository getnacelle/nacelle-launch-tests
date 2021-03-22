import React, { useCallback } from "react";
import { useCart } from "@nacelle/react-hooks";

import styles from "./ProductCard.module.css";

export default function ProductCard({ product }) {
  const [, cartActions] = useCart();
  const addItemToCart = useCallback(() => {
    const lineItem = { ...product, variant: product.variants[0], quantity: 1 };
    cartActions.addToCart(lineItem);

    return cartActions.toggleCart();
  });

  return (
    <div className={`product-card ${styles.card}`}>
      <h2>{product.title}</h2>
      <img src={product.featuredMedia.src} className={styles.image} />
      <button className={styles.button} onClick={addItemToCart}>
        Add to Cart
      </button>
      <button onClick={() => cartActions.toggleCart()}>Toggle Cart</button>
    </div>
  );
}
