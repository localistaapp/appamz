import { useState, createRef, useEffect } from "react";
import axios from 'axios';

const GeolocationComponent = ({searchPlaces}) => {
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('GLatitude:', position.coords.latitude);
          console.log('GLongitude:', position.coords.longitude);
          document.getElementById('locMsg').style.display = 'none';
          window.selectedLat = position.coords.latitude;
          window.selectedLong = position.coords.longitude;
          searchPlaces('fashion', window.placeQuery);
        },
        (error) => {
          console.error('Error getting location:', error.message);
        },
        {
          enableHighAccuracy: true, // optional
          timeout: 10000,           // optional
          maximumAge: 0             // optional
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, []);

  return (
    <div id="locMsg" className="loc-msg">
      <p style={{marginBottom: '0px'}}>Requesting location access (optional)...</p>
    </div>
  );
};

const StoreDetail = ({showView, product, slideRight, onBackClick, reviews, viralDeals}) => {
  console.log('--product on display--', product);
  console.log('--reviews--', reviews);
  const [showWhatsTheRush, setShowWhatsTheRush] = useState(true);
  const [showViralDeals, setShowViralDeals] = useState(false);

  const getShareLink = (product) => {
    let shareLink = '';
    if (product != null && reviews.length > 0) {

      shareLink = "https://wa.me/?text="+encodeURIComponent('Hey!.. Sharing this personalised deal with you!\n\nI just had a great experience visiting '+ product['name']+" & they've shared a warm offer. 💪\n\n They're known for "+reviews.join('\n\n'))+".\n\nVisit them on Quikrush now!\n🔗 - "+encodeURIComponent('https://www.quikrush.com/app/store/'+product['place_id']+"\n\n✅ Get ₹300 OFF on next order\n✅ We both earn additional ₹200 cashback\n✅ Valid for 30 days only\n\n*T&C* Applied*");


    } else {
      shareLink = 'https://wa.me/?text=';
    }
    return shareLink;
  }

  const triggerShare = async (product) => {
    let shareText = '';
    if (product != null && reviews.length > 0) {

      shareText = "Hey!.. Sharing this personalised deal with you!\n\nI just had a great experience visiting "+ product['name']+" & they've shared a warm offer. 💪\n\n They're known for:\n\n"+reviews.join('\n\n')+".\n\nVisit them on Quikrush now!\n🔗 - "+encodeURIComponent('https://www.quikrush.com/app/store/'+product['place_id'])+"\n\n✅ Get ₹300 OFF on next order\n✅ We both earn additional ₹200 cashback\n✅ Valid for 30 days only\n\n*T&C* Applied*";


    } else {
      shareText = '';
    }
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Special offer on Quikrush 🎉',
          text: shareText,
          url: encodeURIComponent('https://www.quikrush.com/app/store/'+product['place_id'])
        });
        console.log('Shared successfully');
      } catch (err) {
        console.error('Share failed:', err);
      }
    } else {
      // fallback: show WhatsApp/Twitter share links
      alert('Sharing not supported on this browser.');
    }
  }

  return (
<div id="webcrumbs" className={`box ${slideRight ? 'slide-right' : ''}`} style={{display: showView ? 'block' : 'none'}}> 
        	<div className="flex flex-col min-h-screen bg-gray-50">
	  {/* Sticky Header */}
	  <header className="sticky top-0 z-50 bg-white shadow-md p-4 flex justify-between items-center">
    <div className="flex-1">
	      <img className="modal-left-arrow" src="../../assets/images/left-arrow.png" onClick={onBackClick} />
	    </div>
	    <div className="flex-1">
	      <p className="text-sm md:text-base">
	        Share this page with a friend to earn 
	        <a href="#" className="text-[#f81134] font-medium hover:underline ml-1">viral cashback</a>
	      </p>
	    </div>
	    <div>
	      <a onClick={()=>{triggerShare(product, reviews)}} className="bg-green-500 text-white p-2 rounded-full flex items-center justify-center hover:bg-green-600 transition-all w-10 h-10" style={{textDecoration: 'none'}}>
	        <i className="fa-brands fa-whatsapp text-xl" style={{fontSize: '34px'}}></i>
	      </a>
	    </div>
	  </header>
	
	  {/* Main Content */}
	  <main className="flex-1 p-4 md:p-6 lg:p-8">
	    <div className="flex flex-col md:flex-row gap-6 max-w-7xl mx-auto">
	      
	      {/* Top Section - Map */}
	      <div className="w-full md:w-1/2" style={{marginTop: '42px'}}>
        <span class="store-title">{product && product.name}</span>
	        <div style={{marginTop: '12px', height: '200px'}} className="bg-white shadow-lg rounded-xl overflow-hidden h-[400px] md:h-[500px]">
	          <iframe 
	            src={`https://www.google.com/maps?key=AIzaSyA38gnkeYsgyTgs4vAXt2r10Vlgg1R2-ec&q=${product && product.geometry.location.lat},${product && product.geometry.location.lng}&z=15&output=embed`}
	            className="w-full h-full border-0"
	            loading="lazy"
	            referrerPolicy="no-referrer-when-downgrade"
	            title="Google Maps"
	            allowFullScreen
	            keywords="map, location, store location, google maps"
	          ></iframe>
	        </div>
	      </div>
	      
	      {/* Bottom Section - Tabs */}
	      <div className="w-full md:w-1/2">
	        <div className="">
	          {/* Tabs Navigation */}
	          <div className="flex border-b">
	            <button style={{display: 'none',width: '100%'}} className="px-4 py-3 border-b-2 border-transparent hover:text-gray-700 flex-1 transition-colors">
	              Shop Now
	            </button>
	          </div>
	          
	          {/* Tab Content - What's the rush about */}
	          {showWhatsTheRush && <div className="">
	            <h2 className="text-xl font-bold mb-4" style={{marginBottom: '-8px'}}>What's the rush about?</h2>
              <p className="text-gray-700 mb-4" style={{maxWidth: '100%', display: 'inline-block',overflowX: 'scroll', height: '33px', paddingTop: '5px'}}>
                {
                  reviews.map((review) => {
                    return (
                      <div class="tag">{review}</div>
                    )

                  })
                }
              </p>

	            {/* Next: "Add testimonials section with customer reviews" */}
	          </div>}

            {viralDeals.length > 0 && 
            
            
            <div>
              
              <div class="pulse-container">
                  <div class="pulse-box">
                    <div class="pulse-css"><svg style={{marginLeft: '3px', marginTop: '0px'}} fill="#fff" width="24px" height="24px" version="1.1" id="Capa_1" viewBox="0 0 30 30">
                <g>
                  <path d="M11.001,30l2.707-16.334H5L11.458,0l9.25,0.123L16.667,8H25L11.001,30z"/>
                </g>
                </svg></div>
                  </div>
              </div>
              <h2 className="text-xl font-bold mb-4" style={{marginBottom: '-8px',marginTop: '8px'}}>Viral Deals for you</h2>
              
	            </div>}

            {viralDeals.length > 0 && <div className="p-5 ticket-card" style={{padding: '12px',marginBottom: '20px'}}>
              <p className="text-gray-700 mb-4 ticket-c" >
                {
                  viralDeals.map((deal) => {
                    return (
                      <div class="ticket3">
                        <div class="ticket3__details">
                          <h3 class="ticket3__title">{deal.title}</h3>
                        </div>
                        <div class="ticket3__rip"></div>
                        <div class="ticket3__price">
                          <span class="heading">Cashback upto</span>
                          <span class="price">₹{deal.max_cashback_value}</span>
                        </div>
                      </div>
                    )

                  })
                }
              </p>
	          </div>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6" style={{marginBottom: '120px'}}>
	              <div className="info-card p-4 hover:shadow-md transition-all">
	                <div className="flex items-center mb-2">
	                  <span className="material-symbols-outlined text-[#f81134] mr-2">local_offer</span>
	                  <h3 className="font-medium">Limited Time Offers</h3>
	                </div>
	                <p className="text-sm text-gray-600">Exclusive deals that expire quickly!</p>
	              </div>
	              <div className="info-card p-4 hover:shadow-md transition-all">
	                <div className="flex items-center mb-2">
	                  <span className="material-symbols-outlined text-[#f81134] mr-2">verified</span>
	                  <h3 className="font-medium">Quality Guaranteed</h3>
	                </div>
	                <p className="text-sm text-gray-600">All products verified by our experts</p>
	              </div>
	              <div className="info-card p-4 hover:shadow-md transition-all">
	                <div className="flex items-center mb-2">
	                  <span className="material-symbols-outlined text-[#f81134] mr-2">payments</span>
	                  <h3 className="font-medium">Cashback Rewards</h3>
	                </div>
	                <p className="text-sm text-gray-600">Earn while you shop!</p>
	              </div>
	              <div className="info-card p-4 hover:shadow-md transition-all">
	                <div className="flex items-center mb-2">
	                  <span className="material-symbols-outlined text-[#f81134] mr-2">redeem</span>
	                  <h3 className="font-medium">Referral Program</h3>
	                </div>
	                <p className="text-sm text-gray-600">Share and earn more rewards</p>
	              </div>
	            </div>
	        </div>
	      </div>
	    </div>
      
	  </main>
	</div> 
        </div>
  )
}; 

const ProductCard = ({product, index, onDetailClick}) => {
  if (product['business_status'] !== "OPERATIONAL" || (product.photos && product.photos.length == 0) || typeof product.photos === 'undefined') {
    return null;
  }
  //onClick -> window.location.href = `/app/shop/place/${product.place_id}`
  return (
    <div key={index} className="card shop-card" onClick={onDetailClick}>
      <img src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400
            &photo_reference=${product.photos[0].photo_reference.replace(/[\n\r\t]/g, '').replace(/\s{2,}/g, '').replace(/&amp;/g, '&').replace(/"/g, '').trim()}&key=AIzaSyA38gnkeYsgyTgs4vAXt2r10Vlgg1R2-ec`} alt={product.name} />
      <div className="card-content">
        <div className="highlights">{product.name}</div>
        <div className="description shop-description">{product.formatted_address}</div>
        <div className="price">
          <div className="shop-price-current">{product.rating}⭐</div>
          <div className="shop-price-original">({product.user_ratings_total})</div>
        </div>
      </div>
    </div>
  );
}

const ProductList = ({products, storeConfig}) => {

    const [basketData, setBasketData] = useState(null);
    const [isClient, setIsClient] = useState(false);
    const [showDetailView, setShowDetailView] = useState(false);
    const [productToShow, setProductToShow] = useState(null);
    const [showProdutList, setShowProdutList] = useState(true);
    const [reviews, setReviews] = useState([]);
    const [viralDeals, setViralDeals] = useState([]);
    const [slideRight, setSlideRight] = useState(false);

    useEffect (() => {
      setIsClient(true);

      axios.get(`/store/web-order/${localStorage.getItem('onlineOrderId')}`)
        .then(function (response) {
            console.log('--web order data-----', response.data);
        })
      
    }, []);

    const fetchStoreDetail = (placeId) => {
      axios.get(`/shops/place/${placeId}`)
        .then(function (response) {
            console.log('--place data-----', response.data);
            if(response.data != null) {
              let reviewsArr = response.data.split(',');
              setReviews(reviewsArr);
            }
        })
    }

    const fetchViralDeals = (placeId) => {
      axios.get(`/shops/deals/${placeId}`)
        .then(function (response) {
            console.log('--deals data-----', response.data);
            if(response.data != null && response.data != 'error') {
              let dealsArr = response.data.viralDeals;
              window.shopOnlineUrl = response.data.appUrl;
              setViralDeals(dealsArr);
            }
        })
    }

    const onDetailClick = (product) => {
      console.log('--onDetailClick--', product);
      window.scrollTo(0,0);
      setProductToShow(product);
      setShowDetailView(true);
      fetchStoreDetail(product.place_id);
      fetchViralDeals(product.place_id);
      setTimeout(()=>{setSlideRight(true);},200);
      setTimeout(()=>{setShowProdutList(false);},400);
    }

    const onBackClick = () => {
      //window.scrollTo(0,0);
      setShowProdutList(true);
      setTimeout(()=>{setSlideRight(false);setShowDetailView(false);},200);
    }

  
    return (
      <>
      <div className="product-list shop-product-list" style={{display: showProdutList ? 'grid': 'none'}}>
        
        {products.map((p, index) => {
          return (<ProductCard product={p} index={index} onDetailClick={()=>onDetailClick(p)} />)
        })}
        
      </div>
      <StoreDetail showView={showDetailView} product={productToShow} slideRight={slideRight} onBackClick={onBackClick} reviews={reviews} viralDeals={viralDeals} />
      {viralDeals.length > 0 && <div class="w-full md:w-1/2 p-8 sticky-btn">
                 <div class="flex flex-wrap ml-auto md:w-56 -m-2">
                    <div class="w-full p-2">            <button onClick={()=>{window.location.href=window.shopOnlineUrl;}} class="btn-shop-online py-4 px-6 w-full font-medium rounded-xl shadow-6xl focus:ring focus:ring-gray-300 bg-white hover:bg-gray-100 transition ease-in-out duration-200" style={{background: '#f81134', color: '#fff',fontSize: '1rem'}} type="button" onclick="window.location.href='/app/kidsaurajpnagar/'">Shop Online</button>          </div>
                    <div class="w-full p-2">
                       
                    </div>
                 </div>
              </div>}
      </>
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

    let fashionCategories = {"Menswear":{"1": []},"Womenswear":{"1": []},"Kidswear":{"girls":{"1-to-6":{"jumpsuits":0,"dresses":0,"skirts":0,"tops":0},"6-to-14":{"jackets":0,"dresses":0}},"boys":{"1-to-6":{"denims":0,"shirts":0},"6-to-14":{"shoes":0}}}};

    let essentialsCategories = {"furniture": {"1":[]},"home decor": {"1":[]},"Linen": {"1":[]}};

    let cafeCategories = {"cafe only": [],"food and cafe": [],"cafe and restaurant": []};

    let kidsCategories = {"toys": [],"stationary": [],"classes": []};

    let saloonCategories = {"mens saloon": [],"womens saloon": [],"unisex saloon": []};

    let categoriesList = {};
    categoriesList['tabFashion'] = fashionCategories;
    categoriesList['tabEssentials'] = essentialsCategories;
    categoriesList['tabCafes'] = cafeCategories;
    categoriesList['tabKids'] = kidsCategories;
    categoriesList['tabSaloons'] = saloonCategories;

    useEffect(() => {
      setIsClient(true);
      setCategories(categoriesList['tabFashion']);
      
    }, []);
    
    console.log('--store c1111--', storeConfig);
    /*const categories = {
        "mens": {"shirts" : { "formals": {"xl": ["black", "white", "beige"]}, "casuals": { "T-shirt": {"m": ["black", "white"], "l": ["black", "white"]} }}},
        "womens": {"tops" : { "casuals": {"s": ["black", "white", "beige"]}, "casuals": { "T-shirt": {"m": ["black", "white"], "l": ["black", "white"]} }}, "dresses": { "lehengas": {"s": ["black", "white", "beige"]}, "casuals": { "salwar": {"m": ["black", "white"], "l": ["black", "white"]} }}}
    };*/

    const handlePrimaryTabSelect = (type, tabId) => {
        let tabUpdateNew = tabUpdate + 1;
        setTabUpdate(tabUpdateNew);
        document.getElementById('tabFashion').classList.remove('active');
        document.getElementById('tabEssentials').classList.remove('active');
        document.getElementById('tabCafes').classList.remove('active');
        document.getElementById('tabKids').classList.remove('active');
        document.getElementById('tabSaloons').classList.remove('active');
        document.getElementById(tabId).classList.add('active');

        //if (tabId == 'tabDefault') {
            document.getElementById('sub-tabs').style.display = 'inline-block';
            const subTabs = document.getElementById('sub-tabs');
            if (subTabs) {
            const activeElements = subTabs.querySelectorAll('.active');
            activeElements.forEach(el => el.classList.remove('active'));
            }
        //} else {
          //  document.getElementById('sub-tabs').style.display = 'none';
        //}
        console.log('categoriesList[tabId]: ', categoriesList[tabId]);
        setCategories(categoriesList[tabId]);
        searchPlaces(tabId.replace('tab',''), window.placeQuery);
        
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
          window.selectedCatId = selected;
          searchPlaces(selected, window.placeQuery);
          console.log('-filters-'+ filters+'-');
          let filterPattern =filters;
          const newArr = origProducts.filter((product) => product.highlights.trim().indexOf(filterPattern.trim()) >= 0);
          console.log('--newArr--', newArr);
          setProducts(newArr);
        }
      }

    const searchPlaces = (cat, q) => {
      
        //let jsonResponse = {"html_attributions":[],"next_page_token":"ATKogpcuIh6iNHRqjaurStxS3gKrcBbkcoEubowuEqcluy3ssnAXUzl6DY5cwK5M26OyYPc9S210HECH1-Xhj-scwvsXKoFko79WM7gngUfeT3usA41rByf7rzdkCGEymcfdDCR2GluoW7NK7hH9w1weYN6pE-FrJeZq3-6aTSuAOJrLbxZXyP94ndXP-Pa1LE1Y07snrxigMm5TOOKtVGXhzsrXvYEK8IWlW_dOVOSKWti0WEE1ALeq6xflznMb1KsQSjkLByJr8X0ow92sVOfFgC8K0OP6xHdv-OBsxddRwh4Dn3JDT5XWNAdBZG1EL_ZHiqVXFqfoRbpJil5EB86Dh5dOcGKGXqGTe7K-Nanzg5DQLSXyY1MoObxgZ-T_mJTrMYZx2s2g0BkyCs3aN2PWQuXjOyH1OIBhcCYl4Q","results":[{"business_status":"OPERATIONAL","formatted_address":"Shop No.948, 1st Floor, 16th Main Rd, BTM 2nd Stage, Mico Layout, BTM 2nd Stage, BTM Layout, Bengaluru, Karnataka 560076, India","geometry":{"location":{"lat":12.9141754,"lng":77.610197},"viewport":{"northeast":{"lat":12.91552567989272,"lng":77.61152612989272},"southwest":{"lat":12.91282602010728,"lng":77.60882647010727}}},"icon":"https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/shopping-71.png","icon_background_color":"#4B96F3","icon_mask_base_uri":"https://maps.gstatic.com/mapfiles/place_api/icons/v2/shopping_pinlet","name":"Pretty Chicks Boutique","opening_hours":{"open_now":true},"photos":[{"height":434,"html_attributions":["<a href=\"https://maps.google.com/maps/contrib/118361615604507077752\">Pretty Chicks Boutique</a>"],"photo_reference":"ATKogpc0t6NUlsohjONDhy7e3w2SyLNWnlgK7YCC5-AugDYB9plBAMp7x_suPpBpQW5_D_7Olc2PyhpjDMfhkiGYXdG2tFFU5lDUXr6euSEZy3odXkZNuS9QWyNqZatbAdN93OhC0VjbRQS23iem2L2RVXqvztWgMEMdbPFtcbuJY6V4EYfvGzvlzEHBcVgpju_kA9od94WQw06oSyCoIeDx_sf2WQGWQdY00Bt_15ftAhjnE87KwSDTaWxPninf5bACBjkUff-K6wIju_-G2kU-DqwRiShpJr8PEsGWR5Lu5hrzKeCB2U8","width":756}],"place_id":"ChIJz7FtB_0UrjsRcO86XcucWj0","plus_code":{"compound_code":"WJ76+M3 Bengaluru, Karnataka","global_code":"7J4VWJ76+M3"},"rating":4.9,"reference":"ChIJz7FtB_0UrjsRcO86XcucWj0","types":["clothing_store","store","point_of_interest","establishment"],"user_ratings_total":104},{"business_status":"OPERATIONAL","formatted_address":"241, 7th Cross Rd, Mico Layout, BTM 2nd Stage, BTM Layout, Bengaluru, Karnataka 560076, India","geometry":{"location":{"lat":12.9136619,"lng":77.60430010000002},"viewport":{"northeast":{"lat":12.91494012989272,"lng":77.60565382989273},"southwest":{"lat":12.91224047010728,"lng":77.60295417010728}}},"icon":"https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/shopping-71.png","icon_background_color":"#4B96F3","icon_mask_base_uri":"https://maps.gstatic.com/mapfiles/place_api/icons/v2/shopping_pinlet","name":"Hello Beautiful Boutique","opening_hours":{"open_now":true},"photos":[{"height":3018,"html_attributions":["<a href=\"https://maps.google.com/maps/contrib/102893459896411473334\">Hello Beautiful Boutique</a>"],"photo_reference":"ATKogpcUmz1arAa5LvisMcpchrsrCqO6wrsKBd0c7-kYyqPOLJTpLknTUiOvmwJI5bJqRXII41-F9wffdiqv804nbaTjxaU8vin_UoGv_bYlmELEIMn8LeNxAmsvxBMDOi52eULrUSsPShLzvC9Ej_JzjNQ1OYXtCcI1sODTXLm4M31wyF4m304rRQmZZK0N_N4TUbBJ03szP3GEmsVLM57db5ahnf0ZFfbmEbBrkthpDsDrlAiND946Bn_dbagaFGp1fPqWwgCRRjqzUuOcVh6p4zRUxQmrgDJSlclpTztJQual29YgC-0","width":3018}],"place_id":"ChIJB6_qdOYVrjsRxqHF2PwAQQ8","plus_code":{"compound_code":"WJ73+FP Bengaluru, Karnataka","global_code":"7J4VWJ73+FP"},"rating":4.8,"reference":"ChIJB6_qdOYVrjsRxqHF2PwAQQ8","types":["clothing_store","store","point_of_interest","establishment"],"user_ratings_total":94},{"business_status":"OPERATIONAL","formatted_address":"291, 7th Main Rd, near ashirwad super market, Mico Layout, Stage 2, BTM Layout, Bengaluru, Karnataka 560076, India","geometry":{"location":{"lat":12.9143174,"lng":77.60600579999999},"viewport":{"northeast":{"lat":12.91567327989272,"lng":77.60744767989272},"southwest":{"lat":12.91297362010728,"lng":77.60474802010727}}},"icon":"https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/shopping-71.png","icon_background_color":"#4B96F3","icon_mask_base_uri":"https://maps.gstatic.com/mapfiles/place_api/icons/v2/shopping_pinlet","name":"Welcome designer boutique","opening_hours":{"open_now":true},"photos":[{"height":3780,"html_attributions":["<a href=\"https://maps.google.com/maps/contrib/116420939759834956644\">Welcome designer boutique</a>"],"photo_reference":"ATKogpfZJNrDFiTeIkBjtt4XYHlkajiWzvf3ie27kQ4E-CjrKQsfocXAWMBJLdzkqq4OzBDFCm-KmgNPSoA3YBrAWu0tQ7A_oHxvlCWh2r8ARkNZZ7D3snE0j4ePLl8b45ye4BRbzxujCMFAanNLBpzniXoWquB5DsnOVGwPwlPAjkG3H8d72WAIOM1k9a8ZvJPuzg4eMsrGtbAVv242mKgU_mFHNK62MKr-ScVkc9wWvfE36zUcK9dGoPbNnaifFBDzlKgiIQEvjQSsieNkCKnTS_mmF_Jg3v1YRafPVm_BUDkghfar5Rk","width":3024}],"place_id":"ChIJb3gGx8EVrjsRYzJbYtWXhH4","plus_code":{"compound_code":"WJ74+PC Bengaluru, Karnataka","global_code":"7J4VWJ74+PC"},"rating":4.9,"reference":"ChIJb3gGx8EVrjsRYzJbYtWXhH4","types":["clothing_store","store","point_of_interest","establishment"],"user_ratings_total":129},{"business_status":"OPERATIONAL","formatted_address":"14, 6th Cross, 29th Main Road, Tank Band Road, NS Palya, BTM 2nd Stage, Bengaluru, Karnataka 560076, India","geometry":{"location":{"lat":12.9057377,"lng":77.6062543},"viewport":{"northeast":{"lat":12.90709297989272,"lng":77.60756642989273},"southwest":{"lat":12.90439332010728,"lng":77.60486677010728}}},"icon":"https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/shopping-71.png","icon_background_color":"#4B96F3","icon_mask_base_uri":"https://maps.gstatic.com/mapfiles/place_api/icons/v2/shopping_pinlet","name":"Shagun - The New Era Boutique","opening_hours":{"open_now":true},"photos":[{"height":2304,"html_attributions":["<a href=\"https://maps.google.com/maps/contrib/116255553554104986731\">Nithyadevi Gokul</a>"],"photo_reference":"ATKogpepdQKG-GErimRVE43S0_qdMSIfo1l9AsnLLrXsEmp7xAfP9zqj05gZiHWETwx_6LP_lU86DbONI5TGVelcdzXTMcIwglLwixg5PGXHyExMGPjSerZ_xo37vbnWvH3NiDCX7rPKHGbTWWa0S87Wd5HNZyVt4sjkeFCpdeHB8GbhY4s3Nz_5cfPnV3i89ejTTKTGAVpw8gOK0HVxDGMUdAK9ZUYgytuIRgLqfyoCRP9tueAiZbUAsei-JUnus7VfjJmiqIif24_XdZpLcOjCo2O6yZ-5p1pDeVKnu8HkDhg4-9mhiTOJz-Bu53Bof9AMuQnLFc6pIYF-mlC3HO5S_T9sfoS9qOeoFyww01YK3L_3ZIsoUh0WRqDLXmhff94tjPxbdbLDozGIyi_pYwN-fOntS5MNunm9ic0kmNRGqJuare2x_9kcraqrQoy-DdftgGgAX-iVEElAtJCF0L0VlPyLzMoBBVybxcgtipiupd1oE3cJHZRXlTTgeIt2v71c8IB5mrPpxVNPLKO5OeoyTJeK7N9aJe8JVNr2BUQ8rlahC31OVwUfiZa2hKAcvR1GrezzN-X-","width":4096}],"place_id":"ChIJYwuX3x0VrjsR5il8IJHBYSA","plus_code":{"compound_code":"WJ44+7G Bengaluru, Karnataka","global_code":"7J4VWJ44+7G"},"rating":3.8,"reference":"ChIJYwuX3x0VrjsR5il8IJHBYSA","types":["clothing_store","store","point_of_interest","establishment"],"user_ratings_total":406},{"business_status":"OPERATIONAL","formatted_address":"26/27, Ground Floor, 6th Main Rd, Mico Layout, BTM 2nd Stage, BTM Layout, Bengaluru, Karnataka 560076, India","geometry":{"location":{"lat":12.9146725,"lng":77.60577529999999},"viewport":{"northeast":{"lat":12.91601902989272,"lng":77.60708047989272},"southwest":{"lat":12.91331937010728,"lng":77.60438082010727}}},"icon":"https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/shopping-71.png","icon_background_color":"#4B96F3","icon_mask_base_uri":"https://maps.gstatic.com/mapfiles/place_api/icons/v2/shopping_pinlet","name":"Umanya Designer Studio","opening_hours":{"open_now":true},"photos":[{"height":2560,"html_attributions":["<a href=\"https://maps.google.com/maps/contrib/104148947710043399379\">Umanya Designer Studio</a>"],"photo_reference":"ATKogpcCVYTyUAKVpPim4m0qGLqR1n-I1tHo1X2CBeujll7yAWNAMpIEdGRMZQa1JPxAyvddX5zC8fbWoB8pczoEav0F987T-kfSF_sNN6vzEGyCvySwZ8H_aJ7I4-dKsmHex-qOTVJI36sUfIkbqBgAmzyMZO0ri0bkzsFQbtpyuPZ_QQ1qP8wNpuo6oNmaKVypyNPUe2eN90LCxo9sR1RLiRXhRzBbERi5NLmr0uKYFE5qLa7LnQ0mZG0zZNxtvmJrZHlOgRLeuBzSfFMI8d1z5j4_jgpTye1omVAvplLRZIxSge32yJI","width":1706}],"place_id":"ChIJgeQdQrsVrjsR-zvGrJmU7xA","plus_code":{"compound_code":"WJ74+V8 Bengaluru, Karnataka","global_code":"7J4VWJ74+V8"},"rating":4.9,"reference":"ChIJgeQdQrsVrjsR-zvGrJmU7xA","types":["clothing_store","store","point_of_interest","establishment"],"user_ratings_total":88},{"business_status":"OPERATIONAL","formatted_address":"WJC7+QQ9, 12th A Cross Rd, Old Madiwala, Chikka Madivala, 1st Stage, BTM 1st Stage, Bengaluru, Karnataka 560068, India","geometry":{"location":{"lat":12.9218971,"lng":77.6145064},"viewport":{"northeast":{"lat":12.92325772989272,"lng":77.61583132989271},"southwest":{"lat":12.92055807010728,"lng":77.61313167010726}}},"icon":"https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/shopping-71.png","icon_background_color":"#4B96F3","icon_mask_base_uri":"https://maps.gstatic.com/mapfiles/place_api/icons/v2/shopping_pinlet","name":"Fashion Factory Designer Boutique","opening_hours":{"open_now":true},"photos":[{"height":3456,"html_attributions":["<a href=\"https://maps.google.com/maps/contrib/103804124307125217841\">ranjith kumar b b</a>"],"photo_reference":"ATKogpcTcf1H5hCcB6-PSQvwx1kVgfdWmH3XEH_2aDDlURR3D9V9XiqwaK7YG3zQW-7jer7e3puJYXS67OqYIzQMtCPKq-rnWI22ADLsWxghGdXMXY3DtPft7eBRcO1IeJaoNwFTE7bjOwqz9EQciCj1XUBJChsrQ4gdcYDJX4zpSsiNIY0kEahApyl_-46oetDI6tCc_b1CgzCVulktXmgo4y1fDpBGW3Sr5OG6oJ6zR8CFhx7KicipCghG8dDBKWUQPX_F8O25NsgzEWnwbRdJK4BG-bCb2hCriOMpAqg-zIxBmNd1K_oqDUi9ipUH8ojBWfScFwM-cNrjVHjjz6jok0pS87JWy3SBvli5ezfmo4bRqLzVY6L0E0JgQpEi1UnKxhG-TI_vr91mz3n9sXRpBG0emnvK-f-SS4LZahNPnETfOAdqDT2Qjx5W-Wav887wF9XicKydKrUbW30P9hmQ0MbMk-bQOq9pUKNovffWcBWiWqJ6Znq8g1Hg4hGSFSzal_NbV1b0GeGO5PoBfvvvnx708VCVNqtiJzXLnu2zSU2Y6lRvrNhrn75uslY4Hz3DtR9KQ29H","width":4608}],"place_id":"ChIJi8pZxycVrjsRNbpb1c34O-A","rating":4.2,"reference":"ChIJi8pZxycVrjsRNbpb1c34O-A","types":["clothing_store","store","point_of_interest","establishment"],"user_ratings_total":38},{"business_status":"OPERATIONAL","formatted_address":"Shwetha Fashion,#452/453, 24th Main Road, 3rd Cross Rd, BTM 2nd Stage, Bengaluru, Karnataka 560076, India","geometry":{"location":{"lat":12.9142718,"lng":77.6134486},"viewport":{"northeast":{"lat":12.91556912989272,"lng":77.61477597989273},"southwest":{"lat":12.91286947010728,"lng":77.61207632010728}}},"icon":"https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/shopping-71.png","icon_background_color":"#4B96F3","icon_mask_base_uri":"https://maps.gstatic.com/mapfiles/place_api/icons/v2/shopping_pinlet","name":"SHWETHA FASHION","opening_hours":{"open_now":true},"photos":[{"height":4000,"html_attributions":["<a href=\"https://maps.google.com/maps/contrib/100665375340398559275\">SHWETHA FASHION</a>"],"photo_reference":"ATKogpdroFhzjZn7fhfBWFVRxhLe1KsmwImrrq-nBa8UKO2fRgHpZh488jAjYn-UCGD4jhPJNto9yq16gts5Kd7HwEWr7imzlbOY8rapQLcdzu7QadHOayKwjY98U3xuHMA5BX54cDaA_X8PiPRDdKBE-OkC-W3CH0qUGd3h69EtLXFltWN12T8aIiyOUnlkMb7jfNB32jVsEgbfGA8ZQ_G_yUjTYYdAV5sVeKoiwfqBxWR7JJ2LpL4IWVZ3jH_fkoTdOuUmioeDpolventAyTXPa7-XOgYmAJqR24OIgEst8756XPqNLBc","width":3000}],"place_id":"ChIJK4gugtkVrjsRa2MB5yKYAng","plus_code":{"compound_code":"WJ77+P9 Bengaluru, Karnataka","global_code":"7J4VWJ77+P9"},"rating":4.7,"reference":"ChIJK4gugtkVrjsRa2MB5yKYAng","types":["clothing_store","store","point_of_interest","establishment"],"user_ratings_total":31},{"business_status":"OPERATIONAL","formatted_address":"16/17,1st A cross, 1st Main Rd, Maruti Nagar, Bengaluru, Karnataka 560068, India","geometry":{"location":{"lat":12.9268608,"lng":77.6157944},"viewport":{"northeast":{"lat":12.92820472989272,"lng":77.61713517989273},"southwest":{"lat":12.92550507010728,"lng":77.61443552010728}}},"icon":"https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/shopping-71.png","icon_background_color":"#4B96F3","icon_mask_base_uri":"https://maps.gstatic.com/mapfiles/place_api/icons/v2/shopping_pinlet","name":"Anna’s Boutique","opening_hours":{"open_now":true},"photos":[{"height":2948,"html_attributions":["<a href=\"https://maps.google.com/maps/contrib/111057655007593196427\">A Google User</a>"],"photo_reference":"ATKogpdCG9GN5pRTVrSvKORFeLlNtSndeAiJzm_c7_RTcKCy3ZvGsDzPgrgqyKhykA7CPIphOtNTBUSJ2UIKt6FYS-7dqCBXKMp_WFbYKe8eLXNhy3hL0AOptxbYTz5BsGi48Xm5S1IfcUo6ORZGsJkztMmfEso1SdgiSb8N-ih8wm8LdnaUEJJaT4ZgiQj0SwrKFMg9PVtXlI4x4KfYIS9_JDyMVqMxvaQsmLitzpmq8-eIiDwkrXa_gfvKahPkaq8d2r2GR9SvJ1pHs9Aamm_OOJjSLjKDzKqolsJSOENT3l4Afjp_eNo","width":2613}],"place_id":"ChIJN8ICb5sVrjsRpZOkoV9u04Y","plus_code":{"compound_code":"WJG8+P8 Bengaluru, Karnataka","global_code":"7J4VWJG8+P8"},"rating":4.7,"reference":"ChIJN8ICb5sVrjsRpZOkoV9u04Y","types":["clothing_store","store","point_of_interest","establishment"],"user_ratings_total":92},{"business_status":"OPERATIONAL","formatted_address":"26, 21st Main, 3rd D Cross Rd, BTM 2nd Stage, Banaglore, Karnataka 560076, India","geometry":{"location":{"lat":12.9133282,"lng":77.6122174},"viewport":{"northeast":{"lat":12.91460837989272,"lng":77.61354957989272},"southwest":{"lat":12.91190872010728,"lng":77.61084992010727}}},"icon":"https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/shopping-71.png","icon_background_color":"#4B96F3","icon_mask_base_uri":"https://maps.gstatic.com/mapfiles/place_api/icons/v2/shopping_pinlet","name":"Suwin Designer Studio","opening_hours":{"open_now":true},"photos":[{"height":1479,"html_attributions":["<a href=\"https://maps.google.com/maps/contrib/102969697753794422400\">Suwin Designer Studio</a>"],"photo_reference":"ATKogpf0Vq9g5ccg7meI8JsOGVqukr3hNPtwWZaPBSQtCht7E6d4TD5oB4WrClo_yc0fdcbW29EZBS1oAXwm4RJ6IfxblQh7fh0Rev3JRyZBj8p0vt4ZLimKv8fvk3pVJZFqbZ8l-WQcijA1ujA0oV50dFyjjDbz0j7kMj_cr_8FdpAq_Mspd2yivMfV0W74A7cHz6JNHvYt1Vpdp_UABSFtjXWilS5VVxDZ1HlM11Ispg1T3Xh2vQJktzGSq9fyqdtUN-9LNIHM_h70_a-CNJGQuNF22Yd6-usmJO3ChQIFwDXQB96Z070","width":1179}],"place_id":"ChIJ6dAqxogVrjsRvJdKa1S5SGc","plus_code":{"compound_code":"WJ76+8V BTM 2nd Stage, BTM Layout, Bengaluru, Karnataka","global_code":"7J4VWJ76+8V"},"rating":5,"reference":"ChIJ6dAqxogVrjsRvJdKa1S5SGc","types":["clothing_store","store","point_of_interest","establishment"],"user_ratings_total":19},{"business_status":"OPERATIONAL","formatted_address":"967, BTM 4th Stage, 1st Block, Kodichikknahalli, DUO Layout, BDA Layout BTM 4th Stage, Bengaluru, Karnataka 560076, India","geometry":{"location":{"lat":12.8932815,"lng":77.6121673},"viewport":{"northeast":{"lat":12.89464357989272,"lng":77.61347042989271},"southwest":{"lat":12.89194392010728,"lng":77.61077077010727}}},"icon":"https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/shopping-71.png","icon_background_color":"#4B96F3","icon_mask_base_uri":"https://maps.gstatic.com/mapfiles/place_api/icons/v2/shopping_pinlet","name":"Studio ADeeKa","opening_hours":{"open_now":true},"photos":[{"height":1844,"html_attributions":["<a href=\"https://maps.google.com/maps/contrib/112911913769152683683\">Delna Shahuna Baindur</a>"],"photo_reference":"ATKogpfCYNcuyDx2IaUU-9ZlBh1BjQDv8-_OA2Qu9OCR9Eio9S1EEr418QapMIrNLGoCinOoumoR7Bpvjq_woOyhTO9iuoTUVrSnh8fFf7iIlU2T3ksF4s2aUkxUratpG0abth08JjZBJKN7GVJ-wMlcC2hR6JXAMJPsMI1FaiHpcV-EhGWn0gCZMCo8nVs9EldlUxnaqgBbkm1iiLxGHdhJRZjjyhNU0qU1G0_d37h76f_4F3GoQVUf2QK4WZ4Bzi20gTerwXP7g9khtqBcD19QCmMU3Kc3E1Ko0C8qpNJdtlLUCp_hYarok8801TB-tJSH_KPb1CPqRVv4bdPl7wo0YhQLA-adMT9n_1-j3WQ5RHDTjk70qQeihnknUOV2KcZhsc8SEZNWGzu3iztdTL2cqsAiUWnenyso1fLTU0lpFNVxe-J3N19c_mQMjscfJs_S2UtB569lLLIjIpoPNKeIu8VrEbUTaiImLLw1NCMCvXe-5ClGFSScuEAADouxmhi1tQRWYDmb3BhGMu_Xtd0Fs1g7mL4EyX3cru33PtyIQxejQRane7Qh4wqy5VJg7zxiqy6kNKdy","width":4000}],"place_id":"ChIJPRYH5lgVrjsRXnEjTmz5NT0","plus_code":{"compound_code":"VJV6+8V Bengaluru, Karnataka","global_code":"7J4VVJV6+8V"},"rating":4.7,"reference":"ChIJPRYH5lgVrjsRXnEjTmz5NT0","types":["clothing_store","store","point_of_interest","establishment"],"user_ratings_total":15},{"business_status":"OPERATIONAL","formatted_address":"690, 7th Main, 7th Cross Rd, near health & glow, BTM 2nd Stage, Bengaluru, Karnataka 560076, India","geometry":{"location":{"lat":12.8967956,"lng":77.6315812},"viewport":{"northeast":{"lat":12.89812917989272,"lng":77.63296567989272},"southwest":{"lat":12.89542952010728,"lng":77.63026602010727}}},"icon":"https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/shopping-71.png","icon_background_color":"#4B96F3","icon_mask_base_uri":"https://maps.gstatic.com/mapfiles/place_api/icons/v2/shopping_pinlet","name":"Supriya Jais Boutique & Co.","opening_hours":{"open_now":true},"place_id":"ChIJOR4xhbsVrjsRFRXCM4d4rWA","plus_code":{"compound_code":"VJWJ+PJ Bengaluru, Karnataka","global_code":"7J4VVJWJ+PJ"},"rating":4.9,"reference":"ChIJOR4xhbsVrjsRFRXCM4d4rWA","types":["clothing_store","store","point_of_interest","establishment"],"user_ratings_total":19},{"business_status":"OPERATIONAL","formatted_address":"23, 7th Main Rd, NS Palya, BTM 2nd Stage, BTM Layout, Bengaluru, Karnataka 560076, India","geometry":{"location":{"lat":12.9062804,"lng":77.6061165},"viewport":{"northeast":{"lat":12.90763807989272,"lng":77.60742947989272},"southwest":{"lat":12.90493842010728,"lng":77.60472982010728}}},"icon":"https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/generic_business-71.png","icon_background_color":"#7B9EB0","icon_mask_base_uri":"https://maps.gstatic.com/mapfiles/place_api/icons/v2/generic_pinlet","name":"Gulshan Fashion Boutique","opening_hours":{"open_now":true},"photos":[{"height":4160,"html_attributions":["<a href=\"https://maps.google.com/maps/contrib/104814334442068269937\">Jamshed Ansari</a>"],"photo_reference":"ATKogpfWnHAz-75-98LJIiZUUg1YQ5IsytMUctJxOek9GNN4CeQHgMxMAQGRRlsbjR4659jYWWf4hzuB_tccSDGMjqty-FFeHAyiosNrU5oLk8lvOmLdAfoMuDGTgG_cVw2fDZmkAOKbZ_OZzLSwlPxmTPK8C2rbxUFCLcbcBeX02uCG96FA1dVMqCixqmjC06aumLwdkkT-pWd4saCZdpjlpVqjKvTwO03S3r_Hij_kPvpvj85CTAzfueZo9945Win_TH0v60fFw2mdOXzowhLwRVki0eNcZ7rDwmHnNY-YiVmfZ-sPs4r3ynmCjlX2jlXxNp7r-ch05qPTv-zqyHpUPjLw8qCwQeBZxpwAA-cXHyae2lrbG7aF4Vv3--xImSoacCmMDS78Q_oTp5Eyy7MQ2stiWN4PUOikQJV9daPi3G0ONu0fcyQo666a7hAADyyMWi-8ZtGUAJ0vDLWqw2g8IFp00QP00dNeHJhoVBzrQPZTgJijKbX7XSzp18jQH2ggmEaXQVNqPWjUnIwR7ZkAu35NLe2plF_8Bqkgf98_QL40ywfYvNzGU5IcvDKryPjHSDIAn2at","width":3120}],"place_id":"ChIJFczbdB0VrjsRrh6jDe6ognM","plus_code":{"compound_code":"WJ44+GF Bengaluru, Karnataka","global_code":"7J4VWJ44+GF"},"rating":3.5,"reference":"ChIJFczbdB0VrjsRrh6jDe6ognM","types":["point_of_interest","establishment"],"user_ratings_total":23},{"business_status":"OPERATIONAL","formatted_address":"7th cross, 7th Main Rd, Mico Layout, BTM 2nd Stage, Bengaluru, Karnataka 560076, India","geometry":{"location":{"lat":12.9135135,"lng":77.6061306},"viewport":{"northeast":{"lat":12.91486682989272,"lng":77.60753572989273},"southwest":{"lat":12.91216717010728,"lng":77.60483607010728}}},"icon":"https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/shopping-71.png","icon_background_color":"#4B96F3","icon_mask_base_uri":"https://maps.gstatic.com/mapfiles/place_api/icons/v2/shopping_pinlet","name":"Blueberry womens wear","opening_hours":{"open_now":true},"photos":[{"height":809,"html_attributions":["<a href=\"https://maps.google.com/maps/contrib/114280823467702654036\">A Google User</a>"],"photo_reference":"ATKogpcAxSggV-zHHrcMsHD2QnHUgNWUkfWCK7RSgFSxKCTJ62j1W1ob29jv8Igo7NxkafnnLT2lsIr4pWQNevRb1wLw9DUOlu3RVWbRq2YDhm3m3eSqDM1zkz7-N81rVpMIhLz_6Q9tlvtftc5-VAkoUWOXTojqyEllJ0oS-nVJ1DQyvoqK6PxMsUOJvWdjvyuLxG7DMZUtQIElF1b-MT7Z2-raZsi8y4xzscB_FSVlSGRr-AZkLmQiMRkltltrLHzBTnc8t8yIsAH3h91-K4q0AgPuOolWgZhlcR5_FIfwDwjoiVuKPdg","width":1440}],"place_id":"ChIJXSRKDfoVrjsRbmXBbVc2c5Y","plus_code":{"compound_code":"WJ74+CF Bengaluru, Karnataka","global_code":"7J4VWJ74+CF"},"rating":4.8,"reference":"ChIJXSRKDfoVrjsRbmXBbVc2c5Y","types":["clothing_store","store","point_of_interest","establishment"],"user_ratings_total":389},{"business_status":"OPERATIONAL","formatted_address":"12, 2nd Cross Rd, BHCS Layout, BHBCS Layout, BTM 2nd Stage, BTM Layout, Bengaluru, Karnataka 560076, India","geometry":{"location":{"lat":12.9159481,"lng":77.6011077},"viewport":{"northeast":{"lat":12.91727672989272,"lng":77.60245772989272},"southwest":{"lat":12.91457707010727,"lng":77.59975807010728}}},"icon":"https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/shopping-71.png","icon_background_color":"#4B96F3","icon_mask_base_uri":"https://maps.gstatic.com/mapfiles/place_api/icons/v2/shopping_pinlet","name":"Siri Designer Boutique","opening_hours":{"open_now":true},"place_id":"ChIJg66HEAQVrjsRsg93QxtYdZ4","plus_code":{"compound_code":"WJ82+9C Bengaluru, Karnataka","global_code":"7J4VWJ82+9C"},"rating":5,"reference":"ChIJg66HEAQVrjsRsg93QxtYdZ4","types":["clothing_store","store","point_of_interest","establishment"],"user_ratings_total":4},{"business_status":"OPERATIONAL","formatted_address":"Fathima Manzil Ground Floor 7th A Main Road, 1st B Cross Rd, BTM 1st Stage, Bengaluru, Karnataka 560029, India","geometry":{"location":{"lat":12.9181388,"lng":77.602182},"viewport":{"northeast":{"lat":12.91948932989272,"lng":77.60344902989272},"southwest":{"lat":12.91678967010728,"lng":77.60074937010727}}},"icon":"https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/shopping-71.png","icon_background_color":"#4B96F3","icon_mask_base_uri":"https://maps.gstatic.com/mapfiles/place_api/icons/v2/shopping_pinlet","name":"Saniya Khan Vogue Boutique","opening_hours":{"open_now":true},"photos":[{"height":1080,"html_attributions":["<a href=\"https://maps.google.com/maps/contrib/114486428032537675996\">Saniya Khan Vogue Boutique</a>"],"photo_reference":"ATKogpe5gQQKMYpCfSWhtFloyuQWSEwkrTtCEmbzhlV99STqmbFvIqijnlS3ioGCDzY3iHvX1cLeZCzQnlBMJppSHrbHf0BsbXlsQUG-3eqPuVn1l7K1nJ8jydie86x5Fq40cY5WP920NlMDTmRqfMfT4iU-ekAfWcIntUss4Peg7QHPSz13BCs8MRJaNdgPpSb0w7C3DDkWlaFcgOIR9CwDWAYCmleG1GemPHCDMyonj12Y6b7uD5GrBTMUOW36pX4mwc4r7IJUGf_fIBJh8X48192C6yijXaaj1gs0PvS_8WlKBCCOH04","width":1080}],"place_id":"ChIJWwBlYgcVrjsRHGFClIqeJGc","plus_code":{"compound_code":"WJ92+7V Bengaluru, Karnataka","global_code":"7J4VWJ92+7V"},"rating":5,"reference":"ChIJWwBlYgcVrjsRHGFClIqeJGc","types":["clothing_store","store","point_of_interest","establishment"],"user_ratings_total":35},{"business_status":"OPERATIONAL","formatted_address":"689-690- basement floor,7th main, 7th Cross Rd, BTM 2nd Stage, Bengaluru, Karnataka 560076, India","geometry":{"location":{"lat":12.9125788,"lng":77.606445},"viewport":{"northeast":{"lat":12.91392477989272,"lng":77.60772427989272},"southwest":{"lat":12.91122512010728,"lng":77.60502462010727}}},"icon":"https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/shopping-71.png","icon_background_color":"#4B96F3","icon_mask_base_uri":"https://maps.gstatic.com/mapfiles/place_api/icons/v2/shopping_pinlet","name":"Blushouse - Boutique & Makeup Studio","opening_hours":{"open_now":true},"photos":[{"height":3024,"html_attributions":["<a href=\"https://maps.google.com/maps/contrib/115948674803866096688\">Blushouse - Boutique &amp; Makeup Studio</a>"],"photo_reference":"ATKogpcyOvdExiE06BXSjCitnjkkNkO5fnXwnC2BeRox-nP525iPSloVrws0qtXA-c0fbMLnKHm_75NlTBPV0NUYBJa96IB6jEbCq1bi-iMqj2EYlqkaExtXh7FDqkVLGOOK3nYQg5NXWEf1xHOxJ9BtCHUKqz6WLURYPjjH8O0_5qjTpgwhneMlvUUf5j_LXsErZEIFXfjdD_UgnmoFHUUXkLUjTeI1Ca7NOll35oks40CXODxAJUdtwh3ExgR5i_lfZI4TRFAa9J0Fcv7eHyduLUPWqc4TaFana0nq7BR-lovcQZQss0Q","width":4032}],"place_id":"ChIJmwiumGIVrjsRivj_LmKD1rA","plus_code":{"compound_code":"WJ74+2H Bengaluru, Karnataka","global_code":"7J4VWJ74+2H"},"rating":5,"reference":"ChIJmwiumGIVrjsRivj_LmKD1rA","types":["clothing_store","store","point_of_interest","establishment"],"user_ratings_total":73},{"business_status":"OPERATIONAL","formatted_address":"1, 2nd Main Rd, opp. Maruti Layout, KEB Colony, 1st Stage, BTM 1st Stage, Bengaluru, Karnataka 560029, India","geometry":{"location":{"lat":12.9204386,"lng":77.6061576},"viewport":{"northeast":{"lat":12.92179132989272,"lng":77.60749107989272},"southwest":{"lat":12.91909167010728,"lng":77.60479142010728}}},"icon":"https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/generic_business-71.png","icon_background_color":"#7B9EB0","icon_mask_base_uri":"https://maps.gstatic.com/mapfiles/place_api/icons/v2/generic_pinlet","name":"Fashion R Designer Boutique","opening_hours":{"open_now":true},"photos":[{"height":4160,"html_attributions":["<a href=\"https://maps.google.com/maps/contrib/113005075351396873264\">A Google User</a>"],"photo_reference":"ATKogpe10JfZnKsBG1hTAYvZHtc0q1kbo21dGUOs0WPrq6D4UQ_K5M9FZFJ64r9FWmM6SSq3Qata_4cEZzodjw37wuF3KJKSOaiNyOFKlQhu2cLsVbvt29EZCeroh4zAJrh3Av-IIXPu4gzaKi-4vxQGNqEzrp6Mh0pGoJWxQqkDyqUsALYaTqeE8_BYVK_ZOwcpQ1ELQGDP6ReFSVt0shvBH2xp0vbq3B49UrNQb5X3pqNgWY21hO6EuohPndEz8MrwWClxcM5BmCLQ_JW0oE874ES7pnET5L_zTZZFKnAFl5H5fgYGNkw","width":3120}],"place_id":"ChIJqaDhJAAVrjsRLI_c8ZoQW9M","plus_code":{"compound_code":"WJC4+5F Bengaluru, Karnataka","global_code":"7J4VWJC4+5F"},"rating":5,"reference":"ChIJqaDhJAAVrjsRLI_c8ZoQW9M","types":["point_of_interest","establishment"],"user_ratings_total":1},{"business_status":"OPERATIONAL","formatted_address":"849, 7th Cross Rd, Stage 2, Mico Layout, BTM 2nd Stage, BTM Layout, Bengaluru, Karnataka 560076, India","geometry":{"location":{"lat":12.913629,"lng":77.606996},"viewport":{"northeast":{"lat":12.91499817989272,"lng":77.60834447989271},"southwest":{"lat":12.91229852010728,"lng":77.60564482010727}}},"icon":"https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/shopping-71.png","icon_background_color":"#4B96F3","icon_mask_base_uri":"https://maps.gstatic.com/mapfiles/place_api/icons/v2/shopping_pinlet","name":"Lauren fashion","opening_hours":{"open_now":true},"photos":[{"height":608,"html_attributions":["<a href=\"https://maps.google.com/maps/contrib/103180679131666080366\">Lauren fashion</a>"],"photo_reference":"ATKogpeD19Sc_72Z_YxiQCZtLD33TPjicpKOi4dF7HZXAvZm-iku_KCzAs9rHfYU-oxqVRGyOpi7hSduA0QaTSS6jlwW7sP-xKK9uwELeIy1UDZjj33RETwCygkI7IQSkw-FHz4b6T-T8M6FFawKcewfwUU6tH5NV995jtn61TA34vyTVHa3rQgs6ISRzDf_V1bno00-BSqRRG2yWaCLmxzZdsSaHs8w5KQ5UZZJ-jl2KMFz-3Yg-NcSj_cvHycSJVbUb-DtfUKkTt_uYpQnkz9CTGBqj1eY65xxV9tljHCeFBv76kBALkk","width":456}],"place_id":"ChIJiZpb6dYVrjsRkUjidDAL4Xk","plus_code":{"compound_code":"WJ74+FQ Bengaluru, Karnataka","global_code":"7J4VWJ74+FQ"},"rating":5,"reference":"ChIJiZpb6dYVrjsRkUjidDAL4Xk","types":["clothing_store","store","point_of_interest","establishment"],"user_ratings_total":123},{"business_status":"OPERATIONAL","formatted_address":"#3, 8th - Cross Rd, near surya sweet, Madiwala New Extension, Maruti Nagar, 1st Stage, BTM Layout, Bengaluru, Karnataka 560068, India","geometry":{"location":{"lat":12.9249256,"lng":77.6149957},"viewport":{"northeast":{"lat":12.92627867989272,"lng":77.61634642989272},"southwest":{"lat":12.92357902010728,"lng":77.61364677010727}}},"icon":"https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/shopping-71.png","icon_background_color":"#4B96F3","icon_mask_base_uri":"https://maps.gstatic.com/mapfiles/place_api/icons/v2/shopping_pinlet","name":"Young 18 designer boutique","opening_hours":{"open_now":true},"photos":[{"height":3000,"html_attributions":["<a href=\"https://maps.google.com/maps/contrib/103857146841969740258\">Young 18 designer boutique</a>"],"photo_reference":"ATKogpfuW3jafRuuzsq4wiDZA7BnsQjefRmWJb-cNWPMVB_D7QO1zSrLlN5DvTihqkbzWHHdfmuKdI5lWNXbqQro5q2xZSm0KFZEMQk9qovyItRhGUDzA-jo4Exe5pdB9HOOiS_18zlGYKzw8oeZNn9uuJzWLlLNVqVmmRQ4FjA7nbHTMbJxo-4VpoznHjKiBrhpbM8wNZgn4dNZ5VQm7py9pwwo6WapJR1AJPrT9thSopB3b9O9V6cm5y-Qx4DqqaOW87U6Go2rLwgS0anYiZ6Yqo5vCuDWKrKui-ZPPR1LG-WMYMBfN4k","width":3999}],"place_id":"ChIJJ_-E0FIUrjsRy2SVd_jkLfw","plus_code":{"compound_code":"WJF7+XX Bengaluru, Karnataka","global_code":"7J4VWJF7+XX"},"rating":3.5,"reference":"ChIJJ_-E0FIUrjsRy2SVd_jkLfw","types":["clothing_store","store","point_of_interest","establishment"],"user_ratings_total":115},{"business_status":"OPERATIONAL","formatted_address":"445, 6th Main Rd, 7th Cross Rd, Mico Layout, BTM 2nd Stage, Bengaluru, Karnataka 560076, India","geometry":{"location":{"lat":12.9135034,"lng":77.6057032},"viewport":{"northeast":{"lat":12.91491427989272,"lng":77.60704732989271},"southwest":{"lat":12.91221462010728,"lng":77.60434767010727}}},"icon":"https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/shopping-71.png","icon_background_color":"#4B96F3","icon_mask_base_uri":"https://maps.gstatic.com/mapfiles/place_api/icons/v2/shopping_pinlet","name":"Four Seasons Boutique","opening_hours":{"open_now":true},"photos":[{"height":1920,"html_attributions":["<a href=\"https://maps.google.com/maps/contrib/104283818269984826818\">Four Seasons Boutique</a>"],"photo_reference":"ATKogpdnpnrdO4sZv76vftTIoAThDmI03hSLD3TloONuJiFbVNu1Q0IMTQyeHMkbctpRLMW5arZ1Kvfq53ThkDwttFBZrD98Y4wYaMY57zV2DVcW04XPQDa0sjfdpKUGRDSlRzJd-_2FBll1yJ5lvKnYLSGCs5xmYxvdLP6v7r9-yquEkCGseN-7-Q2jn57l-YEVPkmNUTjCr-8aTnh1pUQZGrriibzj4R289IXmB8bCO1hqxYgOnolcckYuU3NaV5vwfhQsE8ctFq2iEUU8LwMLbF3ptFlZwUlSBeV91vN_vqQws3YJRCI","width":1080}],"place_id":"ChIJyRZyUQAVrjsR-YgUQhSyEr4","plus_code":{"compound_code":"WJ74+C7 Bengaluru, Karnataka","global_code":"7J4VWJ74+C7"},"rating":5,"reference":"ChIJyRZyUQAVrjsR-YgUQhSyEr4","types":["clothing_store","store","point_of_interest","establishment"],"user_ratings_total":2}],"status":"OK"};
        //setProducts(jsonResponse.results);
        //setIsLoading(false);
        //comment below for testing
        setIsLoading(true);
        axios.get(`/shops/search/${cat != '' ? cat : 'undefined'}/${q != '' ? encodeURI(q) : 'undefined'}/${window.selectedLat}/${window.selectedLong}`)
        .then(function (response) {
            const jsonResponse = response.data;
            setProducts(jsonResponse.results);
            setIsLoading(false);
        })
    }

    const handleSearchInput = (event) => {
      if (event.key === 'Enter') {
        const q = event.target.value;
        window.placeQuery = q;
        let selectedCategory = 'fashion';
        if (window.selectedCatId == null) {
          window.selectedCatId = selectedCategory;
        }
        searchPlaces(window.selectedCatId, q);
      }
    }
    
    return (
        <div className="main">
           <GeolocationComponent searchPlaces={searchPlaces} />
           <div class="container">
                <h1 style={{marginLeft: '16px', display: 'none'}}>Shops near you:</h1>
                <div class="shop-search-c">
                  <input type="text" placeholder="Search stores by locality" onKeyUp={handleSearchInput} />
                  <img src="../../assets/images/magnifying.png" />
                </div>
                <div class="tabs-container shop">
                    <div class="tabs" id="main-tabs">
                    <div id="tabFashion" class="tab active" onClick={() => handlePrimaryTabSelect('tags_fashion', 'tabFashion')}>Fashion</div>
                    <div id="tabEssentials" class="tab" onClick={() => handlePrimaryTabSelect('tags_essentials', 'tabEssentials')}>Essentials</div>
                    <div id="tabCafes" class="tab" onClick={() => handlePrimaryTabSelect('tags_cafes', 'tabCafes')}>Cafes</div>
                    <div id="tabKids" class="tab" onClick={() => handlePrimaryTabSelect('tags_kids', 'tabKids')}>Kids</div>
                    <div id="tabSaloons" class="tab" onClick={() => handlePrimaryTabSelect('tags_saloons', 'tabSaloons')}>Saloons</div>
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
