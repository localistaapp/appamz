import React from "react";
import ProductCard from "./ProductCard";
import "./ProductGrid.css";

const StoreSearchGrid = ({ products = [], storeSearchIntent }) => {
  console.log('-store search products--', products);
  return (
    <div className={`product-grid store-product-grid`}>
      <div className="store-search-title">⏱️ Deals on {storeSearchIntent} from {products[0].name} {products[0].locality}</div>
      {products.map((product, index) => (
        <div className="product-card store-product-card" onClick={(e)=>{window.location.href=products[0].app_url+storeSearchIntent}}>
            <img
              src={product.image_url}
              alt={product.title}
              style={{ height: '150px' }}
            />
            <div className="store-deal">22% OFF</div>
          </div>
      ))}
    </div>
  );
};

export {StoreSearchGrid};
