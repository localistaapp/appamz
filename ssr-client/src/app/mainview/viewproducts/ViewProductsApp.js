import { useState, createRef, useEffect } from "react";
import axios from 'axios';
import "./ViewProducts.css";

const ProductCard = ({product, index, basketData, setBasketData, setTotalPrice}) => {
  const originalPrice = Math.round(product.price * 1.2);

  const [qty, setQty] = useState(0);

  document.addEventListener('basket-updated', function(e) {
    console.log('basket-updated event', e.detail);
    var currBasketData = localStorage.getItem("basket");
    var basketData;
    if(currBasketData == null) {
         basketData = new Object();
    } else {
        basketData = JSON.parse(currBasketData);
    }
    if(e.detail != null) {
        console.log('e.detail.itemId: ', e.detail.itemId);
        console.log('e.detail.qty: ', e.detail.qty);
        if (e.detail.qty <=0 && basketData[e.detail.itemId] != null) {
            delete basketData[e.detail.itemId];
            document.getElementById('checkoutCount').innerHTML = Object.keys(basketData).length;
            if (Object.keys(basketData).length == 0) {
                document.getElementById('checkoutHeader').style.display = 'none';
            }
        } else {
            if (e.detail.qty > 0) {
                basketData[e.detail.itemId] = e.detail;
            }
        }
    }

    if(Object.keys(basketData).length >= 1) {
        document.getElementById('checkoutHeader').style.display = 'inline';
        document.getElementById('checkoutCount').innerHTML = Object.keys(basketData).length;
        setBasketData(basketData);
        let total = 0;
        let shippingCharges = 750;
        Object.keys(basketData).forEach((key)=>{total += basketData[key].price});
        setTotalPrice(total + shippingCharges);
        console.log('--basketData--', basketData);
    }
    var basketStr = JSON.stringify(basketData);
    localStorage.setItem("basket",basketStr)
});

  const setCheckoutCount = (count, item, basketData) => {
    debugger;
    if (count >= 1) {
      document.getElementById('checkoutHeader').style.display = 'block';
      document.getElementById('checkoutCount').innerHTML = count;
    } else {
      if (Object.keys(basketData).length == 0)
        document.getElementById('checkoutHeader').style.display = 'none';
    }
    var event = new CustomEvent('basket-updated', { 
      detail: {name: item.title, price: item.price * count, qty: count, itemId: item.id, itemSrc: item.image_url}
    });
    document.dispatchEvent(event);
  }

  const handlePlusClick = (item, basketData) => {
    setQty(qty + 1);
    setCheckoutCount(qty + 1, item, basketData);
  }

  const handleMinusClick = (item, basketData) => {
    if (qty >= 1) {
      setQty(qty - 1);
      setCheckoutCount(qty - 1, item, basketData);
    }
  }

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
};

const ProductList = ({products}) => {

    const [basketData, setBasketData] = useState(null);
    const [totalPrice, setTotalPrice] = useState(0);
    const [currStep, setCurrStep] = useState(1);

    useEffect (() => {
      const openBtn = document.getElementById('checkoutBtn');
      const modal = document.getElementById('modal');
      const closeBtn = document.getElementById('closeBtn');

      openBtn.addEventListener('click', () => {
        setCurrStep(1);
        modal.classList.add('active');
      });

      closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
      });

      localStorage.removeItem('basket');
      /*var currBasketData = localStorage.getItem("basket");
      if(currBasketData != null) {
        document.getElementById('checkoutHeader').style.display = 'block';
        document.getElementById('checkoutCount').innerHTML = Object.keys(JSON.parse(currBasketData)).length;
        setBasketData(currBasketData);
      }*/
    }, []);

    if (basketData != null)
      console.log('--Object.keys(basketData).length--', Object.keys(basketData).length);

    const next = () => {
      if(currStep == 1) {
        document.getElementById('step1').classList.add('done');
        document.getElementById('step1Circle').classList.remove('active');
        document.getElementById('step2Circle').classList.add('active');
        setCurrStep(2);
      }
    }
  
    return (
      <div className="product-list">
        <div id="checkoutHeader">
            <div id="checkoutBtn" className="card-btn checkout" onClick={()=>{document.getElementById('checkoutModal').style.top='-40px';this.setState({orderSummary: localStorage.getItem('basket') != null ? JSON.parse(localStorage.getItem('basket')) : []});}}>Checkout&nbsp;→
                <div className=""></div>
                <div id="checkoutCount" class="c-count">0</div>
            </div>
        </div>
        <div className="modal-overlay" id="modal">
          <button className="close-btn" id="closeBtn">&times;</button>
          <div className="modal-content">
          <div class="md-stepper-horizontal orange" style={{marginTop: '8px'}}>
            <div id="step1" class="md-step">
                <div class="md-step-circle active" id="step1Circle"><span>1</span></div>
                <div class="md-step-title">Order Summary</div>
                <div class="md-step-bar-left"></div>
                <div class="md-step-bar-right"></div>
            </div>
            <div id="step2" class="md-step">
                <div class="md-step-circle" id="step2Circle"><span>2</span></div>
                <div class="md-step-title">Delivery Schedule</div>
                <div class="md-step-bar-left"></div>
                <div class="md-step-bar-right"></div>
            </div>
            <div id="step3" class="md-step">
                <div class="md-step-circle" id="step3Circle"><span>3</span></div>
                <div class="md-step-title">Delivery Details</div>
                <div class="md-step-bar-left"></div>
                <div class="md-step-bar-right"></div>
            </div>
          </div>
            <div class="checkout-content" style={{overflowY: 'scroll', overflowX: 'hidden'}}>
                {
                    currStep == 1 && basketData != null && Object.keys(basketData).length > 0 && Object.keys(basketData).map((key)=> {
                      return (
                        <div class="card-container small" style={{padding: '0px 12px', height: '163px', marginTop: '0px'}}>
                        <div class="section-one">
                          <div class="top">
                              <div class="top-left-mini"><img id="primaryImgp0" class="primary-img rotatable" src={basketData[key].itemSrc} style={{width: '72px', paddingTop: '0px'}} /></div>
                              <div class="top-right-mini">
                                <div class="usp-title">
                                    <div class="title" style={{marginTop: '-10px'}}>{basketData[key].name}</div>
                                </div>
                                <div class="usp-desc" style={{color: 'rgb(101, 101, 101)', marginTop: '48px'}}>Quantity: ({basketData[key].qty})</div>
                              </div>
                          </div>
                        </div>
                        <div class="section-two small">
                          <div class="pricing"><label class="price"><span class="rupee" style={{marginLeft: '6px'}}>₹</span><span class="orig" id="priceNewp0">{basketData[key].price}</span></label></div>
                          <div class="top"></div>
                        </div>
                    </div>)
                    })
                }
                {
                  currStep == 2 && 
                    <div>Step 2</div>
                }
                <div class="summary-total">
                    Total:  <span class="rupee">₹</span><span id="price">{totalPrice}</span>
                    <div style={{fontSize: '13px', marginTop: '5px', marginLeft: '2px'}}>(incl GST + delivery apprx.)</div>
                </div>
                <div id="checkoutBtn" class="card-btn checkout-next" style={{bottom: '120px', marginTop: 'auto'}} onClick={next}>
                    Next&nbsp;→
                    <div class=""></div>
                </div>
              </div>
          </div>
        </div>

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
    document.getElementById('sub-tabs').style.display = 'inline-block';
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

const LoadingShimmer = () => <div className="loading-screen"><div className="shimmer"><div class="wrapper"><div class="animate image-card"></div><div class="animate stroke title"></div><div class="animate stroke link"></div><div class="animate stroke description"></div></div></div><div class="shimmer"><div class="wrapper"><div class="animate image-card"></div><div class="animate stroke title"></div><div class="animate stroke link"></div><div class="animate stroke description"></div></div></div><div class="shimmer"><div class="wrapper"><div class="animate image-card"></div><div class="animate stroke title"></div><div class="animate stroke link"></div><div class="animate stroke description"></div></div></div><div class="shimmer"><div class="wrapper"><div class="animate image-card"></div><div class="animate stroke title"></div><div class="animate stroke link"></div><div class="animate stroke description"></div></div></div><div class="shimmer"><div class="wrapper"><div class="animate image-card"></div><div class="animate stroke title"></div><div class="animate stroke link"></div><div class="animate stroke description"></div></div></div></div>;
  


const ViewProductsApp = ({url,storeConfig}) => {

    const [message, setMessage] = useState("");
    const [products, setProducts] = useState([]);
    const [origProducts, setOrigProducts] = useState([]);
    const [categories, setCategories] = useState({});
    const [tabUpdate, setTabUpdate] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
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

        let storeId = 0;
        try {
            storeId = storeConfig.storeId;
        } catch(e) {
            console.log('error');
        }
        axios.get(`/products/${storeId}/${type}`)
            .then(function (response) {
              if(response.data != 'auth error') {
                  console.log('--product res--', JSON.stringify(response.data));
                  setIsLoading(false);
                  setProducts(response.data);
              }
            });
      };
    
    
    let storeId = 0;
    try {
        storeId = storeConfig.storeId;
    } catch(e) {
        console.log('error');
    }
      

      if (products.length == 0) {
        axios.get(`/products/${storeId}`)
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
                    <div id="tabDefault" class="tab active" onClick={() => handlePrimaryTabSelect('tags_default', 'tabDefault')}>All</div>
                    <div id="tabSeasons" class="tab" onClick={() => handlePrimaryTabSelect('tags_seasons_special', 'tabSeasons')}>Season's Special</div>
                    <div id="tabArrival" class="tab" onClick={() => handlePrimaryTabSelect('tags_new_arrival', 'tabArrival')}>New Arrivals</div>
                    </div>
                    <div class="sub-tabs" id="sub-tabs" style={{marginBottom: '0',marginTop: '-16px'}}>
                    {tabUpdate >=0 && <NestedTabs categories={categories} />}
                    </div>
                </div>
                {!isLoading && <ProductList products={products} />}
                {isLoading && <LoadingShimmer/>}
            </div>
        </div>
    );
}

export default ViewProductsApp;
