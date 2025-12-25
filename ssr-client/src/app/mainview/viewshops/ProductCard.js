import React, { useState, useEffect } from "react";
import axios from 'axios';
import "./ProductCard.css";

function getPriceRange(price) {
  if (price > 200 && price < 500) {
    return "Usually ₹1500+";
  } else if (price > 250 && price < 1000) {
    return "Usually ₹1800+";
  } else if (price > 700 && price < 2000) {
    return "Usually ₹2500+";
  } else if (price > 1500 && price < 3000) {
    return "Usually ₹3500+";
  } else if (price >= 3000) {
    const lower = Math.floor(price / 1000) * 1000;
    const upper = lower + 1000;
    return `₹${lower} - ₹${upper}`;
  } else {
    return "Usually ₹500+";
  }
}

function getRandomLocality() {
  const locations = [
    'Jayanagar',
    'Indiranagar',
    'Koramangala',
    'BTM Layout',
    'Church Street',
    'JP Nagar'
  ];

  const randomIndex = Math.floor(Math.random() * locations.length);
  return locations[randomIndex];
}

function getItForMsg(price) {
  //*Get it for under ₹1000 from Jayanagar
  if (price > 200 && price < 500) {
    return "Get it for under ₹1200 from " + getRandomLocality();
  } else if (price > 250 && price < 1000) {
    return "Get it for under ₹1500 from " + getRandomLocality();
  } else if (price > 700 && price < 2000) {
    return "Get it for under ₹2200 from " + getRandomLocality();
  } else if (price > 1500 && price < 3000) {
    return "Get it for under ₹3100 from " + getRandomLocality();
  } else if (price >= 3000) {
    const lower = Math.floor(price / 1000) * 1000;
    const upper = lower + 1000;
    return `Get it for under ₹${(upper * 1.2) * 0.8} from ` + getRandomLocality();
  } else {
    return "Get it for event less from " + getRandomLocality();
  }
}

const ProductCard = ({ product, category, onProductClick, onFavCreated, onFavRequestComplete }) => {

  console.log('--product--',  product);
  console.log('--category--',  category);
  const [queries, setQueries] = useState([]);
  
  useEffect(()=> {
    (category||[]).forEach((item)=>{
        if(item.indexOf(':')!=-1) {queries.push(item.split(':')[1]);} else {queries.push(item);} 
        setQueries(queries);
      });
  }, []);

  const createUserFav = (p, c) => {
    console.log('--fav product--', p);
    console.log('--fav category--', c);
    var title = p.title;
    var nanoid = localStorage.getItem('nanoId');
    var highlights = ((p.attributes['color']+',') || '') + ' ' + c.join();
    var price = p.flipkartSpecialPrice.amount;
    var url = p.productUrl;
    var imgUrl = p.imageUrls['800x800'];
    onFavCreated();

    axios.post(`/user-favs/create`, {title: title, nanoid: nanoid, 
      highlights: highlights, price: price, 
      url: url, imgUrl: imgUrl}).then((response) => {
      onFavRequestComplete();
      console.log('--Create Product Response--', response);
    }); 
  }

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
        {/*<p className="category">{product.categoryPath.split('>')[product.categoryPath.split('>').length-1]}</p>*/}
        <p className="price-range">{getPriceRange(product.flipkartSpecialPrice.amount)}</p>
        <p className="price-range get-it-for">{getItForMsg(product.flipkartSpecialPrice.amount)}</p>
        <span className="cta-wishlist price-range" onClick={()=>createUserFav(product, category)}>♡ Favourite for Deals</span>
      </div>
    </div>
  );
};

export default ProductCard;
