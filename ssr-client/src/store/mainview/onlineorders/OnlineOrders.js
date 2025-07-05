import { useState, createRef, useEffect } from "react";
import axios from 'axios';
import "./OnlineOrders.css";

const OrdersList = ({orders}) => {
    const [showOrderDetail, setShowOrderDetail] = useState(false);
    const [orderCreatedAt, setOrderCreatedAt] = useState('');
    const [orderName, setOrderName] = useState('');
    const [orderMobile, setOrderMobile] = useState('');
    const [orderAddress, setOrderAddress] = useState('');
    const [orderPincode, setOrderPincode] = useState('');
    const [orderPrice, setOrderPrice] = useState('');
    const [orderStatus, setOrderStatus] = useState('');
    const [orderSchedule, setOrderSchedule] = useState('');
    const [orderSlot, setOrderSlot] = useState('');
    const [trackingLink, setTrackingLink] = useState('');

    const onCloseClick = () => {
      setShowOrderDetail(false);
    }

    const onOrderClicked = (o,totalPrice,orderString) => {
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
      setShowOrderDetail(true);
    }

    const onTrackingUpdate = () => {

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
            {orderStatus != 'PAID'  && <a className='price-btn' onClick={()=>{onTrackingUpdate(document.getElementById('trackingLinkElemId').value);}} style={{right: '123px', width: '189px', margin: '0 auto', left: '0', right: '0'}}>Update Delivery</a>}
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
