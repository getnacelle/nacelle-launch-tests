import React from "react";

// import { Cart } from "~/components";
const Cart = dynamic(() => import("~/components/Cart"), { ssr: false });
import dynamic from "next/dynamic";
import styles from "./Layout.module.css";

export default function Layout({ children }) {
  return (
    <>
      <div className={styles.header}>
        <h1 className="app">Shopify Accelerated Checkout Demo</h1>
      </div>
      <Cart className={styles.cart} css={{ position: "fixed" }} />
      <main>{children}</main>
    </>
  );
}
