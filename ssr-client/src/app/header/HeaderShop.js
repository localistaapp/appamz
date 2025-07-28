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
            <img class="store-logo-shop" src="../../assets/images/qlogo.png"></img>
            {props.loggedOut &&
                 <span id="logout" className="logout" onClick={onLogoutClick}>Logout</span>}
        </div>
}

export default Header;
