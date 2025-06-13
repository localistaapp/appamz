import { useState, createRef, useEffect } from "react";
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

  const isLeaf = (val) =>
  Array.isArray(val) || typeof val !== 'object' || val === null;

const NestedTabs = (categories) => {
  const [selectedKeys, setSelectedKeys] = useState({}); 

  useEffect(()=> {
    handleSelect(0, 'categories');
  },[]);
  // Traverse using selectedKeys to build visible levels
  //ToDo: Check here
  const buildLevels = (data, keys) => {
    const levels = [];
    let current = data;

    while (current && typeof current === 'object') {
      const levelKeys = Object.keys(current);
      levels.push({ data: current, keys: levelKeys });

      const selectedKey = keys[levels.length - 1];
      if (selectedKey && current[selectedKey]) {
        current = current[selectedKey];
      } else {
        break;
      }
    }

    return levels;
  };

  const levels = buildLevels(categories, Object.values(selectedKeys));
  
  const handleSelect = (levelIndex, key) => {
    debugger;
    if (key !== 'categories') {
        console.log('--levelIndex--', levelIndex);
        
        window.filterStr = typeof window.filterStr == 'undefined' ? key : window.filterStr+','+key;

        if (levelIndex < window.filterStr.split(',').length) {
            let arr = window.filterStr.split(',');
            arr.splice(levelIndex-1, 0, key);
            arr.length = levelIndex;
            window.filterStr = arr.toString();
        } 
            console.log('--filterStr--', window.filterStr);
        
        
        window.onFilter(key, window.filterStr);
    }
    setSelectedKeys((prev) => {
      const updated = { ...prev };
      updated[levelIndex] = key;
      // Clear deeper levels
      Object.keys(updated)
        .filter((k) => parseInt(k) > levelIndex)
        .forEach((k) => delete updated[k]);
      return updated;
    });
  };

  return (
    <div>
      {levels.map((level, index) => {
        window.scrollTo(0,index*55);
        if (index > 0) {
            return <div key={index}>
            <div className="tabs">
                {/* check type - something like ..if level.keys is object vs array  */}
              {
              level.keys.map((key) => {
                    if (key.match(/^\d+$/)) {
                        return null
                    } else {
                        
                        return (
                            <div
                            className={`tab ${
                                selectedKeys[index] === key ? 'active' : ''
                            }`}
                            key={key}
                            onClick={() => handleSelect(index, key)}
                            >
                            {key}
                            </div>);
                    }
                
                })}
            </div>
          </div>
        } else {
            return <div></div>
        }
        
    })}

     
    </div>
  );
};
  


const ViewProducts = ({url}) => {

    const [message, setMessage] = useState("");
    const [products, setProducts] = useState([]);
    const [origProducts, setOrigProducts] = useState([]);
    const [categories, setCategories] = useState({});
    /*const categories = {
        "mens": {"shirts" : { "formals": {"xl": ["black", "white", "beige"]}, "casuals": { "T-shirt": {"m": ["black", "white"], "l": ["black", "white"]} }}},
        "womens": {"tops" : { "casuals": {"s": ["black", "white", "beige"]}, "casuals": { "T-shirt": {"m": ["black", "white"], "l": ["black", "white"]} }}, "dresses": { "lehengas": {"s": ["black", "white", "beige"]}, "casuals": { "salwar": {"m": ["black", "white"], "l": ["black", "white"]} }}}
    };*/
    
    let storeId = 0;
    try {
        storeId = JSON.parse(window.sessionStorage.getItem('user-profile')).storeId;
    } catch(e) {
        console.log('error');
    }
      

      if (products.length == 0) {
        axios.get(`/products/${storeId}`)
        .then(function (response) {
          if(response.data != 'auth error') {
              console.log('--product res--', JSON.stringify(response.data));
              setProducts(response.data);
              setOrigProducts(response.data);
              let productsData = response.data;

              let tabMap = {};
              productsData.forEach(product => {
                const highlights = product.highlights.split(',').map(h => h.trim());
                let current = tabMap;
              
                highlights.forEach((level, index) => {
                  if (index === highlights.length - 1) {
                    // Final level - assign 0
                    current[level] = 0;
                  } else {
                    // Intermediate level - go deeper
                    if (!current[level]) {
                      current[level] = {};
                    }
                    current = current[level];
                  }
                });
              });
            setCategories(tabMap);
            console.log('tabMap:', tabMap);
          }
        }.bind(this));
      }

    window.onFilter = (selected, filters) => {
        console.log('-selected-', selected);
        console.log('-filters-'+ filters+'-');
        let filterPattern =filters;
        const newArr = origProducts.filter((product) => product.highlights.trim().indexOf(filterPattern.trim()) >= 0);
        console.log('--newArr--', newArr);
        setProducts(newArr);
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
                    <div class="sub-tabs" id="sub-tabs" style={{marginBottom: '0',marginTop: '-16px'}}>
                    <NestedTabs categories={categories} />
                    </div>
                </div>
                <ProductList products={products} />
            </div>
        </div>
    );
}

export default ViewProducts;
