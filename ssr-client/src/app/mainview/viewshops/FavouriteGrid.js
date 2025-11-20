import React from "react";
import ProductCard from "./ProductCard";
import "./ProductGrid.css";

const FavouriteGrid = ({ gridLoading, products = [] }) => {
console.log('--favourites products--', products);

  return (
    <div>

{products.map((product) => (<>
  <div className="product-card scale-down">
  <img
    src={product.img_url}
    alt={product.title}
    style={{ height: '300px', objectFit: 'contain !important' }}
  />
  <div className="card-content">
    <h3 style={{fontWeight: 400, color:'black'}}>{product.price}</h3>
    <h3 style={{fontWeight: 400, color:'black'}}>{product.highlights}</h3>
  </div>
</div>

<div className={`product-grid ${gridLoading ? 'grid-loading' : ''}`}>
{JSON.parse(product.related).length > 0 && JSON.parse(product.related).map((related) => (
          <div className="product-card" onClick={(e)=>{window.location.href=related.product_link}}>
            <img
              src={related.thumbnail}
              alt={related.title}
              style={{ height: '300px' }}
            />
            <div className="card-content" style={{background: `linear-gradient(rgba(0, 0, 0, 0), rgb(0 0 0 / 0%)), url(${related.thumbnail})`, filter: 'blur(36px)',backgroundSize: '1px'}}>
              <h3 style={{fontWeight: 400}}>{related.title}</h3>
              <p className="price">₹{related.price}</p>
            </div>
            <div className="card-content-desc">
              <p className="price-range">{related.price}</p>
              <span className="cta-wishlist price-range cta-shop" style={{ background: '#000'}} onClick={()=>{window.location.href=related.product_link}}>Shop Now</span>
            </div>
        </div>
      ))} </div>

</>
))}

      
    </div>
  );
};

export {FavouriteGrid};
