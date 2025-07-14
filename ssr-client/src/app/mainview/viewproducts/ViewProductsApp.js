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

const ProductList = ({products, storeConfig}) => {

    const [basketData, setBasketData] = useState(null);
    const [totalPrice, setTotalPrice] = useState(0);
    const [currStep, setCurrStep] = useState(1);
    const [isClient, setIsClient] = useState(false);

    const [onlineOrdersTimings, setOnlineOrdersTimings] = useState({});
    const [onlineOrdersPinCodes, setOnlineOrdersPinCodes] = useState([]);
    const [storeAcceptingOrders, setStoreAcceptingOrders] = useState(false);
    const [currDayTimings, setCurrDayTimings] = useState([]);
    const [showDeliveryOptions, setShowDeliveryOptions] = useState(false);
    const [deliveryNotSupported, setDeliveryNotSupported] = useState(false);
    const [showOrderConfirmationMsg, setShowOrderConfirmationMsg] = useState(false);
    const [trackingLink, setTrackingLink] = useState('');
    const [payStatus, setPayStatus] = useState('');
    const [orderCompleted, setOrderCompleted] = useState(false);

    if (isClient) {
      window.weekdays = new Array(7);
      window.weekdays[0] = "Sunday";
      window.weekdays[1] = "Monday";
      window.weekdays[2] = "Tuesday";
      window.weekdays[3] = "Wednesday";
      window.weekdays[4] = "Thursday";
      window.weekdays[5] = "Friday";
      window.weekdays[6] = "Saturday";
    }

    useEffect (() => {
      setIsClient(true);
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

    useEffect(()=> {
      if (localStorage.getItem('onlineOrderId') != null) {
        setInterval(() => { if(trackingLink != '' && payStatus != 'PAYMENT_SUCCESS') { axios.get(`/store/web-order/${localStorage.getItem('onlineOrderId')}`)
        .then(function (response) {
            console.log('--web order data-----', response.data);
            setTrackingLink(response.data.tracking_link);
            if (response.data.status == 'PAYMENT_SUCCESS') {
              setPayStatus('PAYMENT_SUCCESS')
            } else {

            } 
        })}}, 5000);
      }
    }, [trackingLink]);

    const getCurrentTimeInFormat = () => {
      const now = new Date();
        let hours = now.getHours();
        const isPM = hours >= 12;
        if (hours > 12) {
            hours -= 12;
        } else if (hours === 0) {
            hours = 12;
        }
        const period = isPM ? "pm" : "am";
        return hours;
    } 

    if (basketData != null)
      console.log('--Object.keys(basketData).length--', Object.keys(basketData).length);

      const checkDeliveryOptions = () => {
        if (isClient && onlineOrdersPinCodes && onlineOrdersPinCodes.indexOf(document.getElementById('dPincode').value)>=0) {
            var curDay = window ? window.weekdays[new Date().getDay()].toLowerCase() : '';
            if (onlineOrdersTimings.hasOwnProperty(curDay) && onlineOrdersTimings[curDay].length > 0) {
                console.log('--schedule--', onlineOrdersTimings[curDay]);
                setCurrDayTimings(onlineOrdersTimings[curDay].filter((slotStr)=>{return parseInt(slotStr.substr(0,slotStr.indexOf('pm'))) > getCurrentTimeInFormat()}));
                setShowDeliveryOptions(true);
                setDeliveryNotSupported(false);
            } else {
                setShowDeliveryOptions(false);
                setDeliveryNotSupported(true);
            }
        } else {
            setShowDeliveryOptions(false);
            setDeliveryNotSupported(true);
        }
        document.getElementById('checkoutNextBtn').style.display = 'block';
      }

      const initiatePayment = async (amount, customerDetails) => {
        //make display block for another iframe with src as https://www.slimcrust.com/v2/pay
        //in the url pass amount and customerDetails (userId, mobileNumber & orderId) params

        //create a GET endpoint that shows the new v2 pay page
        //this page will trigger the below fetch call on load
        try {
            const response = await fetch('https://www.slimcrust.com/api/my-initiate-payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    amount,
                    customerDetails
                })
            });
    
            const result = await response.json();
            
            if (result.success) {
                // Redirect to PhonePe payment page
                window.location.href = result.data.instrumentResponse.redirectInfo.url;
            } else {
                throw new Error(result.message || 'Transaction failed');
            }
            
            return result;
        } catch (error) {
            console.error('Payment initiation failed:', error);
            throw error;
        }
    };
  
      const startPayment = (name, mobile, price, orderId) => {
          const customerDetails = {
              userId: name,
              mobileNumber: mobile,
              orderId: orderId
          };
          
          initiatePayment(price, customerDetails) // Amount in rupees
              .then(response => {
                  console.log('Transaction initiated:', response);
              })
              .catch(error => {
                  console.error('Error:', error);
              });
      };
  
      const payOrderNow = () => {
        let oName = localStorage.getItem('onlineOrderName');
        let oMobile = localStorage.getItem('onlineOrderMobile');
        let oPrice = localStorage.getItem('onlineOrderPrice');
        let orderId = localStorage.getItem('onlineOrderId');
        startPayment(oName,oMobile,oPrice,orderId);
      }
    
      const next = () => {
        console.log('--currStep--', currStep);
      if(currStep == 1) {
        document.getElementById('step1').classList.add('done');
        document.getElementById('step1Circle').classList.remove('active');
        document.getElementById('step2Circle').classList.add('active');
        document.getElementById('checkoutNextBtn').style.display = 'none';
        setCurrStep(2);
      } else if(currStep == 2) {
        document.getElementById('step2').classList.add('done');
        document.getElementById('step2Circle').classList.remove('active');
        document.getElementById('step3Circle').classList.add('active');

        let pincode = document.getElementById('dPincode').value;
        let deliverySchedule = 'unknown';
        let deliveryTimeSlot = 'unknown';
        if (document.getElementById('deliverNow').checked) {
            deliverySchedule = 'now';
        } else if (document.getElementById('deliverSchedule').checked) {
            deliverySchedule = 'later';
            deliveryTimeSlot = document.getElementById('slot').options[document.getElementById('slot').selectedIndex].value;
        }
        sessionStorage.setItem('delivery-pincode',pincode);
        sessionStorage.setItem('delivery-schedule',deliverySchedule);
        sessionStorage.setItem('delivery-timeslot',deliveryTimeSlot);

        setCurrStep(3);
      } else if(currStep == 3) {
        let address = document.getElementById('dAddress').value;
        console.log('--delivery add--', address);

        let deliveryPincode = sessionStorage.getItem('delivery-pincode');
        let deliverySchedule = sessionStorage.getItem('delivery-schedule');
        let deliveryTimeslot = sessionStorage.getItem('delivery-timeslot');
        let deliveryAddress = document.getElementById('dAddress').value;
        let deliveryMobile = document.getElementById('dMobile').value;
        let deliveryName = document.getElementById('dName').value;
        let storeId = sessionStorage.getItem('storeId');
        
        sessionStorage.setItem('dAddress',deliveryAddress);
        sessionStorage.setItem('dMobile',deliveryMobile);
        sessionStorage.setItem('dName',deliveryName);
        let price = totalPrice;
        let summary = JSON.stringify(basketData);

        setShowOrderConfirmationMsg(true);
        //document.getElementById('checkoutBtnStep11').style.display = 'none';
        //document.getElementById('checkoutBtnStep12').style.display='block';

        summary = summary != null ? summary : '';

        var inputVal = window.confirm("You will be notified to make payment once the order is dispatched.");
        if (inputVal) {
            //show the confirmation with food is being prepared screen
        }

        //create order
        var http = new XMLHttpRequest();
        var url = '/store/web-order';
        var params = 'storeId='+storeId+'&price='+price+'&mobile='+deliveryMobile+'&name='+deliveryName+'&slot='+deliveryTimeslot+'&items='+summary+'&pincode='+deliveryPincode+'&schedule='+deliverySchedule+'&address='+deliveryAddress+'&fromUrl='+window.location.href;
        http.open('POST', url, true);
        http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        
        http.onreadystatechange = function() {//Call a function when the state changes.
            if(http.readyState == 4 && http.status == 200) {
                console.log('order creation post response:', http.responseText);
                var res = http.responseText;
                if(res.indexOf('error')>=0) {
                    alert('There was an error creating your order! Please try again.');
                } else {
                    if(res != null) {
                        console.log('---order created---', res);
                        var onlineOrderId = JSON.parse(res).onlineOrderId;
                        var onlineOrderName = JSON.parse(res).onlineOrderName;
                        var onlineOrderMobile = JSON.parse(res).onlineOrderMobile;
                        var onlineOrderPrice = JSON.parse(res).onlineOrderPrice;
                        localStorage.setItem('onlineOrderId', onlineOrderId);
                        localStorage.setItem('onlineOrderName', onlineOrderName);
                        localStorage.setItem('onlineOrderMobile', onlineOrderMobile);
                        localStorage.setItem('onlineOrderPrice', onlineOrderPrice);
                        localStorage.setItem('order-created', 'true');
                    }
                }
                
            }
        }.bind(this);
        http.send(params);
        document.getElementById('checkoutNextBtn').style.display = 'none';
        document.getElementById('backHomeBtn').style.display = 'block';
        document.getElementsByClassName('summary-total')[0].style.display = 'none';
        document.getElementById('step3').classList.add('done');
        setCurrStep(3);
      } else {
        document.getElementById('checkoutNextBtn').style.display = 'block';
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
                      <div className="card-container" style={{ marginTop: '4px', height: '480px'}}>
                      <div className="section-one">
                          <div className="top">
                              <div className="top-right">
                              <img src="../../assets/images/shipment.png" className="delivery-icon" style={{marginTop: '0px',width: '48px'}}/>

                              <span className="title-ff" style={{top:'0px', padding: '10px', lineHeight: '22px', width: '210px', left: '11px'}}>Share your pincode to check delivery options:</span>

                              </div>
                          </div>
                          <div className="top-right step-2" style={{left: '0px',marginTop: '70px'}}>
                        
                        <div className="usp-title" style={{left: '0',right: '0',margin: '0 auto'}}>
                            <div className="usp-title">
                                      <input id="dPincode" type="text" className="step-input" placeholder="Your pincode" style={{left: '20px',top: '0px'}}/>
                                      <input type="button" class="pincode-btn" value="Check Options" onClick={checkDeliveryOptions} />
                                  </div>
                            <div className="delivery-section" style={{top:'124px',paddingTop: '20px', display: `${showDeliveryOptions == true ? 'block' : 'none'}`}}>
                              {storeAcceptingOrders == true && <div class="radios">
                                  <input type="radio" style={{width: '30px'}} id="deliverNow" name="deliveryTime" value="deliverNow" checked/>
                                  <label for="deliverNow" style={{color:'green'}}>Deliver Now (Delivery in 90 minutes)</label><br/>
                                  <input type="radio" id="deliverSchedule" name="deliveryTime" value="deliverSchedule" style={{width: '30px', marginTop: '14px'}} selected />
                                  <label for="deliverSchedule">Deliver Later</label>
                              </div>}
                              {storeAcceptingOrders == true && <div className="deliver-cell" style={{marginTop: '12px', marginLeft: '40px'}}>
                                    <span>Select your time slot for delivery today:</span>
                                    
                                </div>}
                                {storeAcceptingOrders == true && <div className="deliver-cell" style={{marginTop: '12px', marginLeft: '30px'}}>
                                    <select name="slot" id="slot" style={{height:'48px',marginLeft: '10px', width: '172px'}} className="slot-dropdown" onChange={(e)=>{sessionStorage.setItem('deliverySlot',e.target.options[e.target.selectedIndex].text);}}>
                                        {currDayTimings && currDayTimings.map((item)=> {
                                          return (<option value={item}>{item}</option>)
                                        })}
                                      </select>
                                </div>}
                                <div className="slot"></div>
                            </div>
                            {storeAcceptingOrders}
                            <div className="delivery-section msg" style={{top:'123px', display: `${deliveryNotSupported == true || storeAcceptingOrders == false ? 'block' : 'none'}`}}>
                              
                                <div className="deliver-cell" style={{marginTop: '12px', marginLeft: '6px'}}>
                                    <span>Sorry! Our store isn't servicing this locality at the moment.</span>
                                    
                                </div>
                                
                                <div className="slot"></div>
                            </div>
                            <br/>
                        </div>
                        </div>
                    </div>

                  </div>
                }
                {
                  currStep == 3 && 
                  <div>
                    <div className="card-container small" style={{position:'absolute',left:'20px',padding: '0px 12px 0px 12px', minHeight: '266px',width: 'calc(100% - 64px)', display: `${!showOrderConfirmationMsg ? 'block' : 'none'}`}}>
                        <div className="section-one">
                        <div className="top">
                                      <div className="top-right" style={{width: '90%'}}>
                                          <div className="usp-title" style={{left: '0px', top: '-68px',width: '100%'}}>
                                              <textarea id="dAddress"  style={{top: '78px'}}  className="checkout-step-input step-input step-textarea" placeholder="Delivery address (with landmark)" />
                                              <input id="dMobile" type="text" className="checkout-step-input step-input" placeholder="Mobile number" style={{top:'194px',width: '100%'}}/>
                                              <input id="dName" type="text" className="checkout-step-input step-input" placeholder="Your full name" style={{top:'248px',width: '100%'}}/>
                                          </div>
                                      </div>
                                  </div>
                        </div>
                        
                    </div>

                    <div className="card-container small" style={{display: `${showOrderConfirmationMsg ? 'block' : 'none'}`,padding: '0px 12px 0px 12px', minHeight: '246px'}}>
                        <div className="section-one">
                        <div className="deliver-cell" style={{marginLeft: '6px', fontSize: '17px', paddingBottom: '24px', color:'#2b2b2b', margin: '0 auto',width: '220px', marginTop: '36px',textAlign: 'center'}}>
                                            <img src="../../assets/images/tickvo.gif" style={{width: '78px'}} />  
                                            <span className="order-conf-msg" style={{display: 'block'}}>Thank you for your order! Our agent will notify you once the order is dispatched.</span>
                                            
                                        </div>
                      </div>
                    </div>
                        <div id="checkoutBtnStep12" className="card-btn checkout home-btn" style={{top: '548px', marginTop: 'auto', width: '190px', display: 'none'}} onClick={()=>{window.location.href='/app';}}>←&nbsp;Back Home
                            <div className=""></div>
                        </div>
                    </div>


                }
                <div class="summary-total">
                    Total:  <span class="rupee">₹</span><span id="price">{totalPrice}</span>
                    <div style={{fontSize: '13px', marginTop: '5px', marginLeft: '2px'}}>(incl GST + delivery apprx.)</div>
                </div>
                <div id="checkoutNextBtn" class="card-btn checkout-next" style={{bottom: '120px', marginTop: 'auto'}} onClick={next}>
                    Next&nbsp;→
                    <div class=""></div>
                </div>
                <div id="backHomeBtn" class="card-btn checkout-next" style={{display: 'none', width: '180px', margin: '0 auto', left: '0', right: '0'}} onClick={()=>window.location.reload()}>
                    ← Back Home
                    <div class=""></div>
                </div>
              </div>
          </div>
        </div>

        {orderCompleted == false && localStorage.getItem('order-created') != null && localStorage.getItem('order-created') == 'true' && trackingLink != '' && trackingLink != 'null' &&
                    <div className="card-container notify-card-track" style={{position: 'fixed', bottom: '0', left: '0', width: '100%'}}>
                        <div className="section-one-notify">
                        </div>
                        {trackingLink.indexOf('slimcrust.com') >= 0 ?
                        <div className="title notify-title-track"><img src="../../assets/images/tickvo.gif" style={{width: '42px'}}/><span className='track-icon-title'>Order received!</span></div> :
                        <div className="title notify-title-track"><img src="../../assets/images/trk.gif" style={{width: '42px'}}/><span className='track-icon-title'>Track your order</span></div>
                        }
                        <div className="section-two">
                            <div className="top">
                                {!orderCompleted && trackingLink.indexOf('slimcrust.com') >= 0 ?
                                   <iframe className='track-frame' src={`https://${trackingLink}`} style={{width: typeof window !== 'undefined' ? window.screen.width-32 +'px' : '100%', height: typeof window !== 'undefined' ? window.screen.height-280+'px' : '100%'}} />
                                   : <iframe className='track-frame' src={`https://${trackingLink}`} style={{width: typeof window !== 'undefined' ? window.screen.width-32 +'px' : '100%'}} />
                                } 
                                <br/>
                                {payStatus != 'PAYMENT_SUCCESS' && <div style={{visibility: 'hidden'}} className='pay-card'>
                                    <span>Your payment is pending. Please pay now to complete your order.</span>
                                </div>}
                                {payStatus != 'PAYMENT_SUCCESS' && <span style={{visibility: 'hidden'}} className='card-btn pay-now card-btn checkout-next' onClick={()=>{payOrderNow()}}>Pay Now</span>}

                                {payStatus == 'PAYMENT_FAILED' && <div className='pay-card'>
                                    <span>Your payment FAILED! Please TRY AGAIN to complete your order.</span>
                                </div>}
                                {payStatus == 'PAYMENT_FAILED' && <span style={{visibility: 'hidden'}} className='card-btn pay-now card-btn checkout-next' onClick={()=>{payOrderNow()}}>Pay Now</span>}

                                {payStatus == 'PAYMENT_SUCCESS' && setOrderCompleted(true) && <div className='pay-card'>
                                    <span style={{color: '#407f40'}}>Your payment is successful! You will recieve a whatsapp notification once your order is dispacthed!</span>
                                </div>}
                                
                            </div>
                        </div>
                    </div>
                }

          {payStatus == 'PAYMENT_SUCCESS' && 
              <div className="card-container notify-card-track" style={{position: 'fixed', bottom: '0', left: '0', width: '100%', minHeight: '100px'}}>
                <div className="section-one-notify">
                </div>
                <div className="section-two" style={{marginTop: '27px', paddingLeft: '10px', paddingRight:'32px', fontWeight: '500'}}>
                              <div className="top">
                                <span style={{color: '#407f40'}}>Your payment is successful! You will recieve a whatsapp notification once your order is dispacthed!</span>
                              </div>
                </div>
              </div>
          }
          
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
  


const ViewProductsApp = ({url,storeConfig}) => {

    const [message, setMessage] = useState("");
    const [products, setProducts] = useState([]);
    const [origProducts, setOrigProducts] = useState([]);
    const [categories, setCategories] = useState({});
    const [tabUpdate, setTabUpdate] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
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
        sessionStorage.setItem('storeId', storeId);
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
                {!isLoading && <ProductList products={products} storeConfig={storeConfig} />}
                {isLoading && <LoadingShimmer/>}
            </div>
        </div>
    );
}

export default ViewProductsApp;
