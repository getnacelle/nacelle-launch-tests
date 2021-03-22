import React from "react";
import { nacelleClient } from "~/services";
import { ProductCard } from "~/components";

export default function Home({ products }) {
  return (
    <div className="app">
      <h1>Shopify Accelerated Checkout Demo</h1>
      <div className="card-container">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

export async function getStaticProps(_context) {
  const products = await nacelleClient.data.allProducts();

  return {
    props: {
      products,
    },
  };
}
