import React from "react";
import "./ProductCard.css";

const ProductCard = ({ product }) => {

  console.log('--product--',  product);
  return (
    <div className="product-card">
      <img
        src={product.image}
        alt={product.title}
        style={{ height: product.height }}
      />
      <div className="card-content">
        <h3>{product.title}</h3>
        <p className="category">{product.category}</p>
        <p className="price">₹{product.price}</p>
      </div>
    </div>
  );
};

export default ProductCard;
