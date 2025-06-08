import { useState } from "react";
import "./Sidebar.css";

const Sidebar = () => {
    const [message, setMessage] = useState("");

    const showMessage = (msg) => {
        setMessage(msg);
    };

    const clearMessage = () => {
        setMessage("");
    };

    return (
        <div className="sidebar">
            <h3>Menu</h3>
            <div className="links">
                <a style={{marginRight: '24px', display: 'inline'}} href={`${window.location.pathname}?view=view-products`}>Products</a><span style={{fontWeight: '100'}}>|</span><a style={{marginLeft: '24px', display: 'inline'}} href={`${window.location.pathname}?view=add-products`}>Add  ✚</a>
                <hr class="line-light"></hr>
                <a href="/">Online Orders</a>
                <hr class="line-light" ></hr>
                <a href="/">Bookings</a>
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

export default Sidebar;
