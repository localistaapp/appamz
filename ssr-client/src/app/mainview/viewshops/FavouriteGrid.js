import React from "react";
import ProductCard from "./ProductCard";
import "./ProductGrid.css";

const FavouriteGrid = ({ gridLoading, products = [] }) => {
console.log('--favourites products--', products);

  return (
    <div>

{products.map((product) => (<>
  <div className="product-card scale-down favourited">
    <div className="favd">Favourited by you</div>
    <img
      src={product.img_url}
      alt={product.title}
      style={{ height: '300px', objectFit: 'cover !important', margin: '0px' }}
    />
    <div className="card-content">
      <h3 style={{fontWeight: 400, color:'#757575'}}>{product.price}</h3>
      <h3 style={{fontWeight: 400, color:'#757575'}}>{product.highlights.split(',').slice(1).join()}</h3>
    </div>
</div>
<div className="favd-grid-title">Deals on similar products</div>
<div className={`favd-grid product-grid ${gridLoading ? 'grid-loading' : ''}`}>
  {console.log('--actual product--', product)}
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
              <span className="cta-shop favd" style={{ background: '#8f8f8f96'}} onClick={()=>{window.location.href=related.product_link}}>Online Deal</span>
            </div>
        </div>
      ))} </div>

</>
))}

      
    </div>
  );
};

export {FavouriteGrid};
