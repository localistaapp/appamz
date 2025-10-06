import React from "react";
import ProductCard from "./ProductCard";
import "./ProductGrid.css";

const ProductGrid = ({ products }) => {
  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.productBaseInfoV1.productId} product={product.productBaseInfoV1} />
      ))}
    </div>
  );
};

export {ProductGrid};
