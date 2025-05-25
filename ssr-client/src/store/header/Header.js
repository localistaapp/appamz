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
            <svg onClick={props.showSideBar} className="menu-bar text-indigo-600" width="41" height="41" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">                <rect width="56" height="56" rx="16" fill="#b9b9b9"></rect>                <path d="M37 32H19M37 24H19" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>              </svg>
            <img className="store-logo" src={logoSrc} />
            {props.loggedOut &&
                 <span id="logout" className="logout" onClick={onLogoutClick}>Logout</span>}
        </div>
}

export default Header;
