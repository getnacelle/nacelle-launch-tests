import React from "react";

import { Cart } from "~/components";

export default function Layout({ children }) {
  return (
    <>
      <Cart />
      <main>{children}</main>
    </>
  );
}
