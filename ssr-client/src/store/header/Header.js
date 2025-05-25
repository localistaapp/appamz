import "./Header.css";

const onLogoutClick = () => {
    console.log('--clicked log out--');
    alert('Log out');
}

const getLogoSrcWithSubdomain = () => {
    let url = '';
    if (typeof window !== 'undefined' && window.location.href.indexOf('www.amuzely.com') == -1 && window.location.href.indexOf('.amuzely.com') != -1) {
        const storeFolder = window.location.href.substring(window.location.href.indexOf('https://')+'https://'.length,window.location.href.indexOf('.amuzely.com'));
        url = `../../app/blr/${storeFolder}/images/logo.png`;
    }
    else {
        url = '../../app/blr/swirlyojpnagar/images/logo.png';
    }
    return url;
}

const getLogoSrc = (locationHref) => {
    let url = '';
    debugger;
    if (typeof locationHref !== 'undefined' && locationHref.indexOf('/dashboard/') != -1) {
        const storeFolder = locationHref.substring(locationHref.indexOf('/dashboard/')+'/dashboard/'.length,locationHref.length);
        url = `../../app/blr/${storeFolder}/images/logo.png`;
    }
    else {
        url = '../../app/blr/swirlyojpnagar/images/logo.png';
    }
    return url;
}

const Header = (props) => {
    const logoSrc = getLogoSrc(props.locationHref);

    return <div
        className="header">{""}
            <img className="store-logo" src={logoSrc} />
            {props.loggedOut &&
                 <span id="logout" className="logout" onClick={onLogoutClick}>Logout</span>}
        </div>
}

export default Header;
