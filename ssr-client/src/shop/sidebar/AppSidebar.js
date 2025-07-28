import { useState } from "react";
import "./AppSidebar.css";

const AppSidebar = () => {
    const [message, setMessage] = useState("");

    const showMessage = (msg) => {
        setMessage(msg);
    };

    const clearMessage = () => {
        setMessage("");
    };

    return (
        <div className="sidebar">
            <h3>App Menu</h3>
            <div className="links">
                <a style={{marginRight: '24px', display: 'inline'}} href={`${window.location.pathname}?view=view-products`}>Products</a>
                <hr class="line-light"></hr>
                <a href="/">My Orders</a>
                <hr class="line-light" ></hr>
                <a href="/">My Bookings</a>
                <hr class="line-light" ></hr>
                <a href="/stats">Enquiries</a>
                <hr class="line-light" ></hr>
                <a href="/notifications">Push Notifications</a>
                <hr class="line-light" ></hr>
                <a href="/about">Stats</a>
            </div>
            {message && <div className="message">{message}</div>}
        </div>
    );
}

export default AppSidebar;
