import React from "react";
import ProductCard from "./ProductCard";
import "./ProductGrid.css";

const ProductGrid = ({ gridLoading, products = [], onProductClick }) => {
  return (
    <div className={`product-grid ${gridLoading ? 'grid-loading' : ''}`}>
      {products.map((product) => (
        <ProductCard onProductClick={onProductClick} key={product.productBaseInfoV1.productId} product={product.productBaseInfoV1} category={product.categorySpecificInfoV1.keySpecs} />
      ))}
    </div>
  );
};

export {ProductGrid};
