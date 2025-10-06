import React from "react";
import "./ProductCard.css";

const ProductCard = ({ product }) => {

  console.log('--product--',  product);
  return (
    <div className="product-card">
      <img
        src={product.imageUrls['800x800']}
        alt={product.title}
        style={{ height: '300px' }}
      />
      <div className="card-content">
        <h3 style={{fontWeight: 400}}>{product.title}</h3>
        <p className="category">{product.categoryPath.split('>')[product.categoryPath.split('>').length-1]}</p>
        <p className="price">₹{product.flipkartSpecialPrice.amount}</p>
      </div>
    </div>
  );
};

export default ProductCard;
