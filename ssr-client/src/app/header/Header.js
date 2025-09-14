import "./Header.css";
import {useEffect, useState} from "react";
import axios from 'axios';
import { nanoid } from 'nanoid';
import confetti from "https://cdn.skypack.dev/canvas-confetti";
import { track } from "../constants/analytics";
import { METRICS } from "../constants";

const onLogoutClick = () => {
    console.log('--clicked log out--');
    alert('Log out');
}

/*const getLogoSrcWithSubdomain = () => {
    let url = '';
    if (typeof window !== 'undefined' && window.location.href.indexOf('www.amuzely.com') == -1 && window.location.href.indexOf('.amuzely.com') != -1) {
        const storeFolder = window.location.href.substring(window.location.href.indexOf('https://')+'https://'.length,window.location.href.indexOf('.amuzely.com'));
        url = `../../app/blr/${storeFolder}/images/logo.png`;
    }
    else {
        url = '../../app/blr/swirlyojpnagar/images/logo.png';
    }
    return url;
}*/

const getLogoSrc = (locationHref) => {
    let url = '';
    debugger;
    console.log('--locationHref1--', locationHref);
    let storeFolder = '';
    if (typeof locationHref !== 'undefined' && locationHref.indexOf('/app/') != -1) {
        debugger;
        locationHref = locationHref.split('from=')[0];
        storeFolder = locationHref.substring(locationHref.indexOf('/app/')+'/app/'.length,locationHref.length);
        if(storeFolder.indexOf('?')>=0) {
            storeFolder = storeFolder.substring(0, storeFolder.indexOf('?'));
        }
        url = `../../app/blr/${storeFolder}/images/logo.png`;
    }
    else {
        url = '../../app/blr/swirlyojpnagar/images/logo.png';
    }
    console.log('--storeFolder--', storeFolder);
    return url;
}

const Header = (props) => {
    const [isClient, setIsClient] = useState(false);
    const [isShopFlow, setIsShopFlow] = useState(false);
    const [cashbackExists, setCashbackExists] = useState(false);
    const [cashbackValue, setCashbackValue] = useState(0);
    const [maxCashbackValue, setMaxCashbackValue] = useState(0);
    const [showAddToHome, setShowAddToHome] = useState(false);
    const [showCashback, setShowCashback] = useState(false);
    const [showCashbackDone, setShowCashbackDone] = useState(false);
    const [logoSrc, setLogoSrc] = useState(false);
    const [shareLoading, setShareLoading] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [storeName, setStoreName] = useState('');
    const [storeConfig, setStoreConfig] = useState(null);
    let homeLocation = '/';

    const getCashback = (storeId) => {
        //alert(`/user/st-cashback/${localStorage.getItem('nanoId')}/${storeConfigVal.storeId}`);
        axios.get(`/user/st-cashback/${localStorage.getItem('nanoId')}/${storeId}`)
        .then(function (response) {
            console.log('--user cashback data-----', response.data.cashBackValue);
            if (response.data != null && response.data.cashBackValue > 0) {
                setCashbackExists(true);
                setCashbackValue(response.data.cashBackValue);
                setMaxCashbackValue(response.data.maxCashBackValue);
                localStorage.setItem('cashback-value', response.data.cashBackValue);
            }
        })
    }

    const addTopCardClass = () => {
        document.querySelector('#idHeader').classList.add('card-margin-header');
        document.querySelector('#idMenu').classList.add('card-margin-menu');
        document.querySelector('#idLogoSm').classList.add('card-margin-logo-sm');
        document.querySelector('#idLogo').classList.add('card-margin-logo');
    }

    const removeTopCardClass = () => {
        document.querySelector('#idHeader').classList.remove('card-margin-header');
        document.querySelector('#idMenu').classList.remove('card-margin-menu');
        document.querySelector('#idLogoSm').classList.remove('card-margin-logo-sm');
        document.querySelector('#idLogo').classList.remove('card-margin-logo');
    }

    const isNotSubscribed = () => {
        return !(localStorage.getItem('subscribed')!=null && localStorage.getItem('subscribed')=='true');
    }

    const fetchStoreDetail = (storeConfigVal) => {
        axios.get(`/shops/place/${storeConfigVal.placeId}`)
          .then(function (response) {
              console.log('--place data-----', response.data);
              if(response.data != null) {
                let reviewsArr = response.data.split(',');
                setReviews(reviewsArr);
              }
          })
      }

    const isIOS = () => {
        return [
            'iPad Simulator',
            'iPhone Simulator',
            'iPod Simulator',
            'iPad',
            'iPhone',
            'iPod'
          ].includes(navigator.platform)
          // iPad on iOS 13 detection
          || (navigator.userAgent.includes("Mac") && "ontouchend" in document);
    }

    const isNotificationShown = () => {
        return window.PushAlertCo.getSubsInfo().status == "subscribed" ||    
                (localStorage.getItem('notif-shown') != null &&
                localStorage.getItem('notif-shown')=='true');
    }

    const showAddToHomeCard = () => {
        setShowAddToHome(true);
    }

    const showCashbackCard = () => {
        setShowCashback(true);
    }

    const showFollowCard = () => {
        if(localStorage.getItem('notif-shown') == null) {
            localStorage.setItem('notif-shown', 'true');
            //setTimeout(()=>{window.location.reload();},1000);
        }
    }

    const callbackOnSuccess = (result) => {
        console.log('cb-', result.subscriber_id); //will output the user's subscriberId
        console.log('cb-', result.alreadySubscribed); // False means user just Subscribed
        if (localStorage.getItem('subscribed') == null) {
            //confetti();
            //addTopCardClass();
            removeTopCardClass();
            setShowCashback(true);
            setShowAddToHome(false);
            //setTimeout(()=>{setShowCashbackDone(true);}, 4100);
            track(storeConfig.storeId, METRICS.DEALS_CLAIMED);
            addCashback(storeConfig.storeId);
            localStorage.setItem('subscribed', 'true');
        } else {
            setShowAddToHome(false);
            removeTopCardClass();
        }
    }

    const addCashback = (storeId) => {
        let nanoId = localStorage.getItem('nanoId');

        if (nanoId == null) {
            nanoId = nanoid();
            localStorage.setItem('nanoId', nanoId);
        }
        let cashbackPc = 0.1; //0.1 if from=store 
        axios.post(`/store/user/create/`, {nanoId: nanoId, storeId: storeId, cashbackPc: cashbackPc, storeUrl: window.shopOnlineUrl}).then(async (response) => {
            console.log(response.status);
            getCashback(storeId);
            confetti();
            setShowCashback(true);
            setTimeout(()=>{setShowCashbackDone(true);}, 3200);
        });
    }

    const showOfferPromptStates = (storeId) => {
        //ToDo: Remove
        
        /*removeTopCardClass();
        setShowAddToHome(false);
        addCashback(storeId);*/
        

        if (isNotSubscribed()) {
            if (isIOS()) {
                console.log('isNotificationShown: ',isNotificationShown());
                if (!isNotificationShown()) {
                    addTopCardClass();
                    showAddToHomeCard();
                    localStorage.setItem('notif-shown', 'true');
                } else {
                    showFollowCard();
                }
            } else {
                showFollowCard();
            }
        } else {
            setShowAddToHome(false);
            removeTopCardClass();
        }
        if (window.pushalertbyiw) {
            (window.pushalertbyiw).push(['onSuccess', callbackOnSuccess]);
        }
     }
    
     const getClientLogo = (storeId) => {
        let locationHref = window.location.href;
        let url = '';
        let storeFolder = '';
        if (typeof locationHref !== 'undefined' && locationHref.indexOf('/app/') != -1) {
            //locationHref = locationHref.split('from=')[0];
            storeFolder = locationHref.substring(locationHref.indexOf('/app/')+'/app/'.length,locationHref.length);
            if(storeFolder.indexOf('?')>=0) {
                storeFolder = storeFolder.substring(0, storeFolder.indexOf('?'));
            }
            setStoreName(storeFolder);
            url = `../../app/blr/${storeFolder}/images/logo.png`;
        }
        else {
            url = '../../app/blr/swirlyojpnagar/images/logo.png';
        }

        if(url.indexOf('/from=qr')>=0) {
            track(storeId, METRICS.QR_VISITS);
            track(storeId, METRICS.STORE_BROWSE);
            url = url.replace('/from=qr','');
        } else {
            track(storeId, METRICS.REPEAT_VISITS);
            track(storeId, METRICS.STORE_BROWSE);
        }
        console.log('--logosrc--', logoSrc);
        setLogoSrc(url);
    }

    useEffect(() => {
        setIsClient(true);
        const storePathNameConfig = {
            'swirlyojpnagar': {storeId: '9', placeId: ''},
            'kidsaurajpnagar': {storeId: '13', placeId: 'ChIJjSGVUwAVrjsRKuLMxFv9BYE'}
        }
        let storeConfigVal = storePathNameConfig[window?.location.pathname.split('/')[2]];
        setStoreConfig(storeConfigVal);
        homeLocation = window.location.href;
        if(homeLocation && homeLocation.indexOf('/app/shop/') >= 0) {
            setIsShopFlow(true);
        } else {
            /*confetti();
            addTopCardClass();
            showCashbackCard();
            setShowAddToHome(false);*/
            getClientLogo(storeConfigVal.storeId);
            getCashback(storeConfigVal.storeId);
            showOfferPromptStates(storeConfigVal.storeId);
        }
      }, []);

    console.log('--props.locationHref--', props.locationHref);
    if (isClient) {
        homeLocation = window.location.href;
        if (homeLocation.indexOf('?') >= 0) {
            homeLocation = window.location.href.substring(0,window.location.href.indexOf('?'));
        } 
    }

    const handleScardMiniClick = () => {
        setShowCashback(true);
        document.getElementById('scardMain').classList.remove('bounce-3');
        document.getElementById('scardMainInner').classList.remove('bounce-3');
        setShowCashbackDone(false);
        setTimeout("document.getElementById('scardMain').classList.add('bounce-3');",50);
        setTimeout("document.getElementById('scardMainInner').classList.add('bounce-3');",50);
        setTimeout(()=>{setShowCashbackDone(true);},3200);
    }
    const triggerShare = async (product) => {
        let shareText = '';
        
        if (navigator.share) {
    
          let nanoId = localStorage.getItem('nanoId');
    
          if (nanoId == null) {
            nanoId = nanoid();
            localStorage.setItem('nanoId', nanoId);
          }
          let cashbackPc = 0.05; //0.1 if from=store 
          cashbackPc = 0.1;
          setShareLoading(true);

          //fetchStoreDetail(storeConfigVal)

          axios.get(`/shops/place/${storeConfig.placeId}`)
          .then(function (response) {
              console.log('--place data-----', response.data);
              if(response.data != null) {
                let reviewsArr = response.data.split(',');
                setReviews(reviewsArr);

                axios.post(`/store/user/create/`, {nanoId: nanoId, storeId: storeConfig.storeId, cashbackPc: cashbackPc, storeUrl: '/app/'+storeName+'/'}).then(async (response) => {
                    console.log(response.status);
                    try {
                      if (product != null && reviewsArr.length > 0) {
            
                        shareText = "Hey!.. Sharing this personalised deal with you!\n\nI just had a great experience visiting "+ product['name']+" & they've shared a warm offer. 💪\n\n They're known for:\n\n"+reviewsArr.join('\n')+".\n\nVisit them on Slashify now! 🔗 - https://www.slashify.in/app/shop/id="+product['place_id']+'&u='+nanoId+" \n\n✅ Get ₹300 OFF on next order\n✅ We both earn additional ₹200 cashback\n✅ Valid for 30 days only\n\n*T&C* Applied*";
                  
                  
                      } else {
                        shareText = '';
                      }
                      track(storeConfig.storeId, METRICS.SHARES);
                      await navigator.share({
                        title: 'Special offer on Slashify 🎉',
                        text: shareText,
                        url: 'https://www.slashify.in/app/shop/id='+product['place_id']+'&u='+nanoId
                      });
                      setShareLoading(false);
                      console.log('Shared successfully');
                    } catch (err) {
                      console.error('Share failed:', err);
                    }
                    setTimeout(function(){setShareLoading(false);}.bind(this),2000);
                  });
                } else {
                  // fallback: show WhatsApp/Twitter share links
                  alert('Sharing not supported on this browser.');
                }
              });
          }

          
      }
   
    //const logoSrc = getLogoSrc(props.locationHref);

    return <><div
        id="idHeader"
        className="header">
            
            {!isShopFlow && <svg id="idMenu" onClick={props.showSideBar} className={`menu-bar text-indigo-600`} width="41" height="41" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">                <rect width="56" height="56" rx="16" fill="#b9b9b9"></rect>                <path d="M37 32H19M37 24H19" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>              </svg>}
            {!isShopFlow && <img id="idLogoSm" onClick={()=> window.location.href=homeLocation} className={`store-logo-sm`} src={logoSrc} />}
            <img id="idLogo" class={isShopFlow ? `store-logo-shop` :`store-logo`} src="../../assets/images/sflogo.png"></img>
            {props.loggedOut && !isShopFlow &&
                 <span id="logout" className="logout" onClick={onLogoutClick}>Logout</span>}
        </div>
        {showAddToHome &&
            <> 
            <div class="notif-card-box-th notif-card-box-th-1" style={{backgroundCcolor: '#fff!important'}}>
                <div class="notif-card-icon-container">
                    <img src="../../assets/images/dealcard.png" style={{width: '140px'}} />
                </div>
                <div class="notif-card-msg-box-container">
                <div class="notif-card-title-txt-container">
                    <p class="notif-card-title-txt" style={{color:'#333!important'}}>Unlock special offer</p>
                </div>
                <div class="notif-card-msg-txt-container">
                    <p class="notif-card-msg-txt" style={{color:'#777!important'}}>Add this app to your home screen to continue. Tap Share 
                    <svg class="notif-card-ic" viewBox="0 0 512 512" ><path d="M396.545 154.249h-51.039a18.7 18.7 0 1 0 0 37.401h51.052a18.723 18.723 0 0 1 18.7 18.7v244.55a18.723 18.723 0 0 1-18.7 18.7H115.443a18.723 18.723 0 0 1-18.7-18.7V210.35a18.723 18.723 0 0 1 18.7-18.7h51.052a18.7 18.7 0 0 0 0-37.401h-51.052a56.169 56.169 0 0 0-56.101 56.101v244.55A56.169 56.169 0 0 0 115.443 511h281.115a56.169 56.169 0 0 0 56.101-56.101V210.35a56.172 56.172 0 0 0-56.113-56.101zm-210.278-37.75l51.65-51.65v246.195a18.7 18.7 0 1 0 37.401 0V64.849l51.65 51.65a18.702 18.702 0 0 0 26.455-26.442L269.857 6.479a18.706 18.706 0 0 0-26.455 0l-83.578 83.578a18.697 18.697 0 0 0 26.442 26.442z"></path></svg>
                    and then <p style={{display: 'inline'}}>Add to Home Screen</p>
                    <svg class="notif-card-ic" viewBox="0 0 512 512" ><path d="M384 42.667A85.419 85.419 0 0 1 469.333 128v256A85.419 85.419 0 0 1 384 469.333H128A85.419 85.419 0 0 1 42.667 384V128A85.419 85.419 0 0 1 128 42.667zM384 0H128A127.992 127.992 0 0 0 0 128v256a127.992 127.992 0 0 0 128 128h256a127.992 127.992 0 0 0 128-128V128A127.992 127.992 0 0 0 384 0zM256 384a21.327 21.327 0 0 1-21.333-21.333V149.333a21.334 21.334 0 1 1 42.667 0v213.333A21.327 21.327 0 0 1 256 384z"></path><path d="M128 256a21.327 21.327 0 0 1 21.333-21.333h213.333a21.333 21.333 0 0 1 0 42.667H149.333A21.327 21.327 0 0 1 128 256z"></path></svg>
                    </p>
                </div>
                </div>
            </div>
            <div>
            </div>
            <div class="card-modal" ></div>
         </>
        }
        {showCashback && maxCashbackValue > 0 && <div class="holder">
            <div id="scardMain" class="scard-bg bounce-3"></div>
                <div id="scardMainInner" class="scard bounce-3">
                    <img class="sslogo" src="../../assets/images/slogos.png" />
                    <div class="cashback-type">Upto {maxCashbackValue} OFF</div>
                    <div class="card__elig">*Eligible online & in-store across all partner stores in</div>
                    <img class="card__elig_loc" src="../../assets/images/sblr.png"/>
                    <img class="card__elig_loc_logo" src="../../assets/images/sloc_blr.png"/>
                    <div class="card__text">
                    
                    </div>
                    <div class="ssbox left-skew"></div>
                    <div class="cashback-value">₹{cashbackValue} collected</div>
                </div>
                </div>}
        {
            showCashbackDone && maxCashbackValue > 0 && <div class="holder">

                <div class="scard-mini" onClick={handleScardMiniClick}>
                    <img class="sslogo" src="../../assets/images/slogos.png"/>
                    <span class="scard-mini-text">Share to earn upto ₹{maxCashbackValue}/-</span>
                    <div id="webcrumbs" class="mini-share-ic"><i class="fa-brands fa-whatsapp text-xl" style={{fontSize: '34px',color: '#22c55d'}}></i></div>
                    <div class="card__text"></div><div class="ssbox left-skew"></div>
                    <div class="scard-mini-cashback">₹{cashbackValue} collected</div>
                    </div>
            </div>
        }
        
        </>
}

export default Header;
