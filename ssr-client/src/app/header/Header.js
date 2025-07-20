import "./Header.css";
import {useEffect, useState} from "react";

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
    let homeLocation = '/';
    useEffect(() => {
        setIsClient(true);
      }, []);

    console.log('--props.locationHref--', props.locationHref);
    if (isClient) {
        homeLocation = window.location.href;
        if (homeLocation.indexOf('?') >= 0) {
            homeLocation = window.location.href.substring(0,window.location.href.indexOf('?'));
        } 
    }
   
    const logoSrc = getLogoSrc(props.locationHref);

    return <div
        className="header">
            <svg onClick={props.showSideBar} className="menu-bar text-indigo-600" width="41" height="41" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">                <rect width="56" height="56" rx="16" fill="#b9b9b9"></rect>                <path d="M37 32H19M37 24H19" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>              </svg>
            <img onClick={()=> window.location.href=homeLocation} className="store-logo-sm" src={logoSrc} />
            <img class="store-logo" src="../../assets/images/blogo1.png"></img>
            {props.loggedOut &&
                 <span id="logout" className="logout" onClick={onLogoutClick}>Logout</span>}
        </div>
}

export default Header;
