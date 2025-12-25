import React from "react";
import ProductCard from "./ProductCard";
import "./ProductGrid.css";

const ProductGrid = ({ gridLoading, products = [], onProductClick, onFavCreated, onFavRequestComplete }) => {
  console.log('--Grid Loading--', gridLoading);
  return (
    <div className={`product-grid ${gridLoading ? 'grid-loading' : ''}`}>
      {products.map((product) => (
        <ProductCard onFavCreated={onFavCreated} onFavRequestComplete={onFavRequestComplete} onProductClick={onProductClick} key={product.productBaseInfoV1.productId} product={product.productBaseInfoV1} category={product.categorySpecificInfoV1.keySpecs} />
      ))}
    </div>
  );
};

export {ProductGrid};
