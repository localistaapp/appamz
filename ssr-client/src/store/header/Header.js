import "./Header.css";

const onLogoutClick = () => {
    console.log('--clicked log out--');
    alert('Log out');
}

const getLogoSrc = () => {
    return '/assets/images/logo_rc.png';
}

const Header = (props) => {
    const logoSrc = getLogoSrc();

    return <div
        className="header">{""}
            <img className="store-logo" src={logoSrc} />
            {props.loggedOut &&
                 <span id="logout" className="logout" onClick={onLogoutClick}>Logout</span>}
        </div>
}

export default Header;
