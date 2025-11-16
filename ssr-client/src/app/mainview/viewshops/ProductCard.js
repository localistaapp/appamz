import React, { useState, useEffect } from "react";
import "./ProductCard.css";

function getPriceRange(price) {
  if (price > 200 && price < 500) {
    return "₹250 - ₹1000";
  } else if (price > 250 && price < 1000) {
    return "₹500 - ₹1000";
  } else if (price > 700 && price < 2000) {
    return "₹1000 - ₹2000";
  } else if (price > 1500 && price < 3000) {
    return "₹2000 - ₹3000";
  } else if (price >= 3000) {
    const lower = Math.floor(price / 1000) * 1000;
    const upper = lower + 1000;
    return `₹${lower} - ₹${upper}`;
  } else {
    return "Below ₹200";
  }
}

const ProductCard = ({ product, category, onProductClick }) => {

  console.log('--product--',  product);
  console.log('--category--',  category);
  const [queries, setQueries] = useState([]);
  
  useEffect(()=> {
    (category||[]).forEach((item)=>{
        if(item.indexOf(':')!=-1) {queries.push(item.split(':')[1]);} else {queries.push(item);} 
        setQueries(queries);
      });
  }, []);

  return (
    <div className="product-card" onClick={(e)=>{console.log('--category queries--', queries);console.log('--product category--', e.target.attributes['data-cat'].value); onProductClick(queries, e.target.attributes['data-cat'].value)}}>
      <img
        data-cat={product.categoryPath.replace(/\>/g,' ')}
        src={product.imageUrls['800x800']}
        alt={product.title}
        style={{ height: '300px' }}
      />
      <div className="card-content" style={{background: `linear-gradient(rgba(0, 0, 0, 0), rgb(0 0 0 / 0%)), url(${product.imageUrls['800x800']})`, filter: 'blur(36px)',backgroundSize: '1px'}}>
        <h3 style={{fontWeight: 400}}>{product.title}</h3>
        <p className="category">{product.categoryPath.split('>')[product.categoryPath.split('>').length-1]}</p>
        <p className="price">₹{product.flipkartSpecialPrice.amount}</p>
      </div>
      <div className="card-content-desc">
        <p className="category">{product.categoryPath.split('>')[product.categoryPath.split('>').length-1]}</p>
        <p className="price-range">{getPriceRange(product.flipkartSpecialPrice.amount)}</p>
        <span className="cta-wishlist price-range">♡ Favourite</span>
        <span className="cta-wishlist price-range cta-shop" style={{ background: '#000'}} onClick={()=>{window.location.href=product.productUrl}}>Shop Now</span>
      </div>
    </div>
  );
};

export default ProductCard;
