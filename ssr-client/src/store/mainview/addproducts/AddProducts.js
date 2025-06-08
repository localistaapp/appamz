import { useState } from "react";
import "./AddProducts.css";

const AddProducts = ({url}) => {
    const [message, setMessage] = useState("");

    const showMessage = (msg) => {
        setMessage(msg);
    };

    const clearMessage = () => {
        setMessage("");
    };

    return (
        <div className="main">
           <div class="container">
                <h1>Add Product</h1>
                <input type="text" placeholder="Title" />
                <input type="text" placeholder="Highlights (e.g. type: kidswear, age: 9-10)" />
                <textarea placeholder="Description"></textarea>
                <input type="number" placeholder="Price" />
                
                <select>
                <option disabled selected>Eligible for</option>
                <option>Online Purchase</option>
                <option>Online Enquiry</option>
                <option>Online Booking</option>
                </select>

                <select>
                <option selected>Default</option>
                <option>Season's Special</option>
                <option>New Arrival</option>
                </select>
            </div>

            <div class="footer-buttons">
                <button><span>Save & Add</span><i class="fas fa-plus"></i></button>
                <button><span>Finish</span><i class="fas fa-arrow-right"></i></button>
            </div>
        </div>
    );
}

export default AddProducts;
