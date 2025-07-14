import { useState, createRef, useEffect } from "react";
import axios from 'axios';
import "./OnlineOrders.css";

const OrdersList = ({orders}) => {
    const [showOrderDetail, setShowOrderDetail] = useState(false);
    const [orderCreatedAt, setOrderCreatedAt] = useState('');
    const [orderId, setOrderId] = useState('');
    const [orderName, setOrderName] = useState('');
    const [orderMobile, setOrderMobile] = useState('');
    const [orderAddress, setOrderAddress] = useState('');
    const [orderPincode, setOrderPincode] = useState('');
    const [orderPrice, setOrderPrice] = useState('');
    const [orderStatus, setOrderStatus] = useState('');
    const [orderSchedule, setOrderSchedule] = useState('');
    const [orderFromUrl, setOrderFromUrl] = useState('');
    const [orderSlot, setOrderSlot] = useState('');
    const [storeName, setStoreName] = useState('');
    const [trackingLink, setTrackingLink] = useState('');

    const onCloseClick = () => {
      setShowOrderDetail(false);
    }

    const onOrderClicked = (o,totalPrice,orderString) => {
      setOrderId(o.id);
      setOrderCreatedAt(o.created_at);
      setOrderName(o.name);
      setOrderMobile(o.mobile);
      setOrderAddress(o.address);
      setOrderPincode(o.delivery_pincode);
      setOrderPrice(totalPrice);
      setOrderStatus(o.status);
      setOrderSchedule(o.delivery_schedule);
      setOrderSlot(o.delivery_timeslot);
      setTrackingLink(o.tracking_link);
      setOrderFromUrl(o.from_url);
      let fromUrl = o.from_url;
      let fromStoreName = fromUrl.split('/')[4];
      setStoreName(fromStoreName);
      setShowOrderDetail(true);
    }

    const onTrackingUpdate = () => {

    }

    const onAccept = () => {
      const prof = sessionStorage.getItem('user-profile');
      const supportMob = JSON.parse(prof).supportMobile;
      axios.post(`/store/web-order/update`, {onlineOrderId: orderId, trackingLink: 'www.slimcrust.com/yp.html?oid='+orderId+'&amt='+orderPrice+'&mob='+orderMobile+'&supportMob='+supportMob+'&fromUrl='+orderFromUrl}).then((response) => {
        console.log(response.status);
        window.open(`https://wa.me/+91${orderMobile}?text=Hello!%20Your%20order%20has%20been%20accepted%20by%20${storeName}!%20Please%20make%20your%20payment%20on%20the%20app%20to%20confirm%20at%20${orderFromUrl}`,'_blank');
      });
    }
 
    return (
      <div>
      <div className="product-list">
        {orders.length > 0 && orders.map((o, index) => {
          let orderString = '';
          let totalPrice = 0;
          let itemImgsrc = '';

          Object.values(JSON.parse(o.order)).forEach((obj, index)=>{
            console.log('--obj--', obj);
            orderString = orderString + `${obj.qty} ${obj.name} , `;
            totalPrice = totalPrice + obj.price;
            if (index == 0) {
              itemImgsrc = obj.itemSrc;
            }
          });
          
          orderString = orderString.substring(0,orderString.length-2);
          totalPrice = totalPrice + 750;
          //handle 2rs sample product
          if (totalPrice == 752) {
            totalPrice = 2;
          }

          return (
            <div key={index} className="card" onClick={()=>{onOrderClicked(o,totalPrice,orderString)}} >
              <img src={itemImgsrc} />
              <div className="card-content">
                <div className="description order-desc">{orderString}</div>
                <div className="price">
                  <div className="price-current">₹{totalPrice}</div>
                </div>
                <br/>
                <div className="description" style={{display: 'inline'}}>{o.name} - {o.mobile}</div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="address-container" style={{display: showOrderDetail == true ? 'block' : 'none'}}>
        <div className="close-icn" onClick={onCloseClick}><img src='../../assets/images/ic_close.png'></img></div>
        <div className="cnt">
            <div>Created At: {orderCreatedAt}</div>
            <div>{orderName}</div>
            <div>{orderMobile}</div>
            <div>{orderAddress}</div>
            <div>{orderPincode}</div>
            <div className='price-lbl'>₹{orderPrice}</div>
            {orderStatus != 'PAID'  && <div className='input-delivery'><input id="trackingLinkElemId" type='text' value={trackingLink} placeholder='Enter tracking link' /></div>}
            {orderStatus != 'PAID'  && <><a className='price-btn' onClick={()=>{onAccept()}} style={{left: '0px', width: '120px', margin: '0 auto', float: 'left', marginLeft: '26px', background: 'linear-gradient(0deg, #16b95e, #26c36b 35%, #39d980)'}}>Accept</a><a className='price-btn' onClick={()=>{onTrackingUpdate(document.getElementById('trackingLinkElemId').value);}} style={{right: '20px', float: 'right', width: '189px', margin: '0 auto', right: '20px'}}>Update Delivery</a></>}
            <div>{orderSchedule == 'now' ? 'DELIVER NOW' : ''}</div>
            {orderSlot != 'unknown' && <div>{orderSlot}</div>}
        </div>
        
    </div>
      </div>
    );
  };

const LoadingShimmer = () => <div className="loading-screen"><div className="shimmer"><div class="wrapper"><div class="animate image-card"></div><div class="animate stroke title"></div><div class="animate stroke link"></div><div class="animate stroke description"></div></div></div><div class="shimmer"><div class="wrapper"><div class="animate image-card"></div><div class="animate stroke title"></div><div class="animate stroke link"></div><div class="animate stroke description"></div></div></div><div class="shimmer"><div class="wrapper"><div class="animate image-card"></div><div class="animate stroke title"></div><div class="animate stroke link"></div><div class="animate stroke description"></div></div></div><div class="shimmer"><div class="wrapper"><div class="animate image-card"></div><div class="animate stroke title"></div><div class="animate stroke link"></div><div class="animate stroke description"></div></div></div><div class="shimmer"><div class="wrapper"><div class="animate image-card"></div><div class="animate stroke title"></div><div class="animate stroke link"></div><div class="animate stroke description"></div></div></div></div>;
  

const OnlineOrders = ({url}) => {

    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [orders, setOrders] = useState([]);

    let storeId = 0;
        try {
            storeId = JSON.parse(window.sessionStorage.getItem('user-profile')).storeId;
        } catch(e) {
            console.log('error');
        }

    if (orders.length == 0) {
      axios.get(`/web-orders/${storeId}`)
      .then(function (response) {
        if(response.data != 'auth error') {
            console.log('--orders res--', JSON.stringify(response.data));
            setIsLoading(false);
            setOrders(response.data);
        }
      }.bind(this));
    }

    setTimeout(()=>setIsLoading(false),2000);

    return (
        <div className="main">
           <div class="container">
                <h1 style={{marginLeft: '16px'}}>Online Orders</h1>
                {!isLoading && <OrdersList orders={orders} />}
                {isLoading && <LoadingShimmer/>}
            </div>
        </div>
    );
}

export default OnlineOrders;
