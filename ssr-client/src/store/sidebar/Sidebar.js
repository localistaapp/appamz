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
            <h3>Sidebar</h3>
            <p>Links and other content can go hereeee.</p>
            <div className="links">
                <a href="/">Home</a>
                <a href="/cars">Cars</a>
                <a href="/about">About</a>
            </div>
            {message && <div className="message">{message}</div>}
        </div>
    );
}

export default Sidebar;
