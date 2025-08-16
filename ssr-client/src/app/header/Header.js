import "./Header.css";
import {useEffect, useState} from "react";
import axios from 'axios';

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
    const [showAddToHome, setShowAddToHome] = useState(false);
    const [showCashback, setShowCashback] = useState(false);
    let homeLocation = '/';

    const getCashback = () => {
        axios.get(`/user/cashback/${localStorage.getItem('nanoId')}/${encodeURIComponent(window.location.pathname)}`)
        .then(function (response) {
            console.log('--user cashback data-----', response.data.cashBackValue);
            if (response.data != null && response.data.cashBackValue > 0) {
                setCashbackExists(true);
                setCashbackValue(response.data.cashBackValue);
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

    const isNotSubscribed = () => {
        return !(window.PushAlertCo.getSubsInfo().status == "subscribed");
             //&& localStorage.getItem('subscribed')!=null && localStorage.getItem('subscribed')=='true';
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
            setTimeout(()=>{window.location.reload();},1000);
        }
    }

    const showOfferPromptStates = () => {
        if (isNotSubscribed()) {
            if (isIOS()) {
                console.log('isNotificationShown: ',isNotificationShown());
                if (!isNotificationShown()) {
                    addTopCardClass();
                    showAddToHomeCard();
                    localStorage.setItem('notif-shown', 'true');
                } else {
                    addTopCardClass();
                    showFollowCard();
                }
            } else {
                addTopCardClass();
                showFollowCard();
            }
        } else {
            showCashbackCard();
        }
     }

    useEffect(() => {
        setIsClient(true);
        homeLocation = window.location.href;
        if(homeLocation && homeLocation.indexOf('/app/shop/') >= 0) {
            setIsShopFlow(true);
        } else {
            getCashback();
        }
        showOfferPromptStates();
      }, []);

    console.log('--props.locationHref--', props.locationHref);
    if (isClient) {
        homeLocation = window.location.href;
        if (homeLocation.indexOf('?') >= 0) {
            homeLocation = window.location.href.substring(0,window.location.href.indexOf('?'));
        } 
    }
   
    const logoSrc = getLogoSrc(props.locationHref);

    return <><div
        id="idHeader"
        className={`${!isShopFlow && cashbackExists ? 'top-margin' : ''} header`}>
            {!isShopFlow && cashbackExists && <span className="announcement">🎉 You're eligible for instant cashback of ₹{cashbackValue}. Shop now to redeem!</span>}
            {!isShopFlow && <svg id="idMenu" onClick={props.showSideBar} className={`${!isShopFlow && cashbackExists ? 'top-margin' : ''} menu-bar text-indigo-600`} width="41" height="41" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">                <rect width="56" height="56" rx="16" fill="#b9b9b9"></rect>                <path d="M37 32H19M37 24H19" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>              </svg>}
            {!isShopFlow && <img id="idLogoSm" onClick={()=> window.location.href=homeLocation} className={`${!isShopFlow && cashbackExists ? 'top-margin-sm' : ''} store-logo-sm`} src={logoSrc} />}
            <img id="idLogo" class={isShopFlow ? `${!isShopFlow && cashbackExists ? 'top-margin' : ''} store-logo-shop` :`${!isShopFlow && cashbackExists ? 'top-margin' : ''} store-logo`} src="../../assets/images/qlogo.png"></img>
            {props.loggedOut && !isShopFlow &&
                 <span id="logout" className="logout" onClick={onLogoutClick}>Logout</span>}
        </div>
        {showAddToHome && <span>Add to home screen</span>}
        </>
}

export default Header;
