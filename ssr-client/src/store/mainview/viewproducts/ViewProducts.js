import { useState, createRef } from "react";
import axios from 'axios';
import "./ViewProducts.css";

const ProductList = ({products}) => {
  
    return (
      <div className="product-list">
        {products.map((p, index) => {
          const originalPrice = Math.round(p.price * 1.2);
  
          return (
            <div key={index} className="card">
              <img src={p.image_url} alt={p.title} />
              <div className="card-content">
                <div className="highlights">{p.highlights}</div>
                <div className="description">{p.description}</div>
                <div className="price">
                  <div className="price-current">₹{p.price}</div>
                  <div className="price-original">₹{originalPrice}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

const ViewProducts = ({url}) => {
    const [message, setMessage] = useState("");
    const [products, setProducts] = useState([]);
    const productsList = [
        {
          "title": "Cool Kids Tee1",
          "description": "Soft cotton t-shirt for kids.",
          "price": "499",
          "image_url": "https://via.placeholder.com/300x200?text=Kids+Tee",
          "highlights": "type: kidswear, age: 9-10"
        },
        {
          "title": "Men’s Jacket",
          "description": "Windproof winter jacket.",
          "price": "1499",
          "image_url": "https://via.placeholder.com/300x200?text=Mens+Jacket",
          "highlights": "type: menswear, size: L"
        },
        {
          "title": "Women's Dress",
          "description": "Elegant floral print dress.",
          "price": "1299",
          "image_url": "https://via.placeholder.com/300x200?text=Womens+Dress",
          "highlights": "type: womenswear, size: M"
        }
      ];

      const storeId = JSON.parse(window.sessionStorage.getItem('user-profile')).storeId; 

      if (products.length == 0) {
        axios.get(`/products/${storeId}`)
        .then(function (response) {
          if(response.data != 'auth error') {
              console.log('--product res--', response.data);
              setProducts(response.data);
          }
        }.bind(this));
      }
    
    return (
        <div className="main">
           <div class="container">
                <h1 style={{marginLeft: '16px'}}>View Products</h1>
                <div class="tabs-container">
                    <div class="tabs" id="main-tabs">
                    <div class="tab active">All</div>
                    <div class="tab">Season's Special</div>
                    <div class="tab">New Arrivals</div>
                    </div>
                    <div class="sub-tabs" id="sub-tabs">
                    <div class="sub-tab active">Kidswear</div>
                    <div class="sub-tab">Menswear</div>
                    <div class="sub-tab">Womenswear</div>
                    </div>
                </div>
                <ProductList products={products} />
            </div>
        </div>
    );
}

export default ViewProducts;
