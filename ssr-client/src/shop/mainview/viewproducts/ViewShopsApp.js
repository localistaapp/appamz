import { useState, createRef, useEffect } from "react";
import axios from 'axios';

const ProductCard = ({product, index, basketData, setBasketData, setTotalPrice}) => {
  
  return (
    <div key={index} className="card">
      <img src={product.image_url} alt={product.title} />
      <div className="card-content">
        <div className="highlights">{product.highlights}</div>
        <div className="description">{product.description}</div>
        <div className="price">
          <div className="price-current">₹{product.price}</div>
          <div className="price-original">₹{originalPrice}</div>
        </div>
        <div className="quantity"><a className="quantity__minus"><span style={{fontSize: '25px', lineHeight: '0px', marginLeft: '2px'}} onClick={() => handleMinusClick(product,basketData)}>-</span></a><input name="quantity" type="text" className="quantity__input" value={qty}/><a className="quantity__plus" onClick={()=>{handlePlusClick(product, basketData);}}><span>+</span></a></div>
      </div>
    </div>
  );
}

const ProductList = ({products, storeConfig}) => {

    const [basketData, setBasketData] = useState(null);

    useEffect (() => {
      setIsClient(true);

      if(onlineOrdersPinCodes && onlineOrdersPinCodes.length == 0) {
        let storeId = 0;
        try {
            storeId = storeConfig.storeId;
        } catch(e) {
            console.log('error');
        }
        axios.get(`/store/get-all/${storeId}`)
        .then(function (response) {
          if(response.data != 'auth error') {
              console.log('--store availability data--', JSON.stringify(response.data));
              setOnlineOrdersTimings(response.data[0].online_orders_timings);
              setStoreAcceptingOrders(response.data[0].accepting_online_orders == 'Y' ? true: false);
              setOnlineOrdersPinCodes(response.data[0].online_orders_pincodes);
          }
        }.bind(this));
      }

      axios.get(`/store/web-order/${localStorage.getItem('onlineOrderId')}`)
        .then(function (response) {
            console.log('--web order data-----', response.data);
            setTrackingLink(response.data.tracking_link);
            setPayStatus(response.data.status);
        })
      
    }, []);

  
    return (
      <div className="product-list">
        
        {products.map((p, index) => {
          return (<ProductCard product={p} index={index} basketData={basketData} setBasketData={setBasketData} setTotalPrice={setTotalPrice} />)
        })}
      </div>
    );
  };

  const isLeaf = (val) =>
  Array.isArray(val) || typeof val !== 'object' || val === null;

const NestedTabs = (categories) => {
  const [selectedKeys, setSelectedKeys] = useState({}); 
  const [isClient, setIsClient] = useState(false);

  useEffect(()=> {
    setIsClient(true);
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
    if (isClient) {
      document.getElementById('sub-tabs').style.display = 'inline-block';
    }
    if (key !== 'categories') {
        console.log('--levelIndex--', levelIndex);
        
        if (isClient) {
          window.filterStr = window.filterStr+','+key;
          if (levelIndex < window.filterStr.split(',').length) {
              let arr = window.filterStr.split(',');
              arr.splice(levelIndex-1, 0, key);
              arr.length = levelIndex;
              window.filterStr = arr.toString();
          } 
              console.log('--filterStr--', window.filterStr);
          
          
          window.onFilter(key, window.filterStr);
      }
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
        //window.scrollTo(0,index*55);
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

const LoadingShimmer = () => <div className="loading-screen"><div className="shimmer"><div class="wrapper"><div class="animate image-card"></div><div class="animate stroke title"></div><div class="animate stroke link"></div><div class="animate stroke description"></div></div></div><div class="shimmer"><div class="wrapper"><div class="animate image-card"></div><div class="animate stroke title"></div><div class="animate stroke link"></div><div class="animate stroke description"></div></div></div><div class="shimmer"><div class="wrapper"><div class="animate image-card"></div><div class="animate stroke title"></div><div class="animate stroke link"></div><div class="animate stroke description"></div></div></div><div class="shimmer"><div class="wrapper"><div class="animate image-card"></div><div class="animate stroke title"></div><div class="animate stroke link"></div><div class="animate stroke description"></div></div></div><div class="shimmer"><div class="wrapper"><div class="animate image-card"></div><div class="animate stroke title"></div><div class="animate stroke link"></div><div class="animate stroke description"></div></div></div></div>;
  


const ViewShopProductsApp = ({url,storeConfig}) => {

    const [message, setMessage] = useState("");
    const [products, setProducts] = useState([]);
    const [origProducts, setOrigProducts] = useState([]);
    const [categories, setCategories] = useState({});
    const [tabUpdate, setTabUpdate] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
      alert(0);
      setIsClient(true);
      
    }, []);
    
    console.log('--store c1111--', storeConfig);
    /*const categories = {
        "mens": {"shirts" : { "formals": {"xl": ["black", "white", "beige"]}, "casuals": { "T-shirt": {"m": ["black", "white"], "l": ["black", "white"]} }}},
        "womens": {"tops" : { "casuals": {"s": ["black", "white", "beige"]}, "casuals": { "T-shirt": {"m": ["black", "white"], "l": ["black", "white"]} }}, "dresses": { "lehengas": {"s": ["black", "white", "beige"]}, "casuals": { "salwar": {"m": ["black", "white"], "l": ["black", "white"]} }}}
    };*/

    const handlePrimaryTabSelect = (type, tabId) => {
        let tabUpdateNew = tabUpdate + 1;
        setTabUpdate(tabUpdateNew);
        document.getElementById('tabDefault').classList.remove('active');
        document.getElementById('tabSeasons').classList.remove('active');
        document.getElementById('tabArrival').classList.remove('active');
        document.getElementById(tabId).classList.add('active');

        if (tabId == 'tabDefault') {
            document.getElementById('sub-tabs').style.display = 'inline-block';
            const subTabs = document.getElementById('sub-tabs');
            if (subTabs) {
            const activeElements = subTabs.querySelectorAll('.active');
            activeElements.forEach(el => el.classList.remove('active'));
            }
        } else {
            document.getElementById('sub-tabs').style.display = 'none';
        }

        
        /*axios.get(`/products/${storeId}/${type}`)
            .then(function (response) {
              if(response.data != 'auth error') {
                  console.log('--product res--', JSON.stringify(response.data));
                  setIsLoading(false);
                  setProducts(response.data);
              }
            });*/
      };
    
    
  
      if (products.length == 0) {
        /*axios.get(`/products/${storeId}`)
        .then(function (response) {
          if(response.data != 'auth error') {
              console.log('--product res--', JSON.stringify(response.data));
              setIsLoading(false);
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
        }.bind(this));*/
      }


      if(isClient) {
        window.onFilter = (selected, filters) => {
          console.log('-selected-', selected);
          console.log('-filters-'+ filters+'-');
          let filterPattern =filters;
          const newArr = origProducts.filter((product) => product.highlights.trim().indexOf(filterPattern.trim()) >= 0);
          console.log('--newArr--', newArr);
          setProducts(newArr);
        }
      }

    const handleSearchInput = (event) => {
      console.log('--test--');
      console.log('--key down--', event.target.value);
      debugger;
      if (event.key === 'Enter') {
        console.log('do validate: ', event.target);
      }
    }
    
    return (
        <div className="main">
           <div class="container">
                <h1 style={{marginLeft: '16px', display: 'none'}}>Shops near you:</h1>
                <div class="shop-search-c">
                  <input type="text" placeholder="Search stores by locality" onKeyDown={handleSearchInput} />
                  <img src="../../assets/images/magnifying.png" />
                </div>
                <div class="tabs-container shop">
                    <div class="tabs" id="main-tabs">
                    <div id="tabSeasons" class="tab active" onClick={() => handlePrimaryTabSelect('tags_seasons_special', 'tabSeasons')}>Fashion</div>
                    <div id="tabArrival" class="tab" onClick={() => handlePrimaryTabSelect('tags_new_arrival', 'tabArrival')}>Essentials</div>
                    <div id="tabArrival" class="tab" onClick={() => handlePrimaryTabSelect('tags_new_arrival', 'tabArrival')}>Cafes</div>
                    <div id="tabArrival" class="tab" onClick={() => handlePrimaryTabSelect('tags_new_arrival', 'tabArrival')}>Kids</div>
                    </div>
                    <div class="sub-tabs" id="sub-tabs" style={{marginBottom: '0',marginTop: '-16px'}}>
                    {tabUpdate >=0 && <NestedTabs categories={categories} />}
                    </div>
                </div>
                {!isLoading && <ProductList products={products} storeConfig={storeConfig} />}
                {isLoading && <LoadingShimmer/>}
            </div>
        </div>
    );
}

export default ViewShopProductsApp;
