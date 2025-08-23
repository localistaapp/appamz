import { useState, createRef, useEffect } from "react";
import axios from 'axios';
import "./Notifications.css";

const Notifications = ({url}) => {
    const [message, setMessage] = useState("");
    const [festiveList, setFestiveList] = useState("");

    // State to keep track of the current upload progress (percentage)
    const [progress, setProgress] = useState(0);

    const [uploadUrl, setUploadUrl] = useState(0);

    // Create a ref for the file input element to access its files easily
    const fileInputRef = createRef();

    // Create an AbortController instance to provide an option to cancel the upload if needed.
    const abortController = new AbortController();

    const saveProduct = () => {
        const title = document.querySelector('#pTitle').value;
        const highlights = document.querySelector('#pHighlights').value;
        const description = document.querySelector('#pDesc').value;
        const price = document.querySelector('#pPrice').value;
        const eligibleFor = document.querySelector('#pEligibleFor').options[document.querySelector('#pEligibleFor').selectedIndex].value;
        const primaryCat = document.querySelector('#pCategory').options[document.querySelector('#pCategory').selectedIndex].value;
        const thumbnailUrl = uploadUrl;
        const storeId = JSON.parse(window.sessionStorage.getItem('user-profile')).storeId;

        console.log('--title--', title);
        console.log('--highlights--', highlights);
        console.log('--description--', description);
        console.log('--price--', price);
        console.log('--eligibleFor--', eligibleFor);
        console.log('--primaryCat--', primaryCat);
        console.log('--thumbnailUrl--', thumbnailUrl);
        
        axios.post(`/createProduct`, {title: title, highlights: highlights, 
            description: description, price: price, 
            eligibleFor: eligibleFor, primaryCat: primaryCat,
            thumbnailUrl: thumbnailUrl, storeId: storeId}).then((response) => {
            console.log('--Create Product Response--', response);
            setTimeout(()=>{window.location.reload();},500);
        });       
        //window.location.reload();
    };

    const loadFestiveNotifications = async () => {
        let businessType = JSON.parse(window.sessionStorage.getItem('user-profile')).businessType;

        axios.get(`/notif-config/${businessType}`)
            .then(function (response) {
                if(response.data != 'auth error') {
                    console.log('--res--', JSON.stringify(response.data));
                    setFestiveList(response.data);
                }
            }.bind(this));
    }

    useEffect(() => {
        const tabs = document.getElementById('tabs');
        const tabElements = document.querySelectorAll('.tab');

        tabElements.forEach(tab => {
            tab.addEventListener('click', () => {
                tabElements.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
            });
        });

        loadFestiveNotifications();
    }, []);

    return (
        <div className="main">
           <div class="container">
                <h1>Notifications</h1>
                <div class="tabs-container">
                    <div class="tabs" id="tabs">
                        <div class="tab active">Festive</div>
                        <div class="tab">Content</div>
                        <div class="tab">Events</div>
                    </div>
                </div>

                <div className="festive">
                {festiveList.length > 0 && festiveList.map((item, index) => { 
                    return (
                    <div className="notif-item">
                        <div className="notif-item-title">{item.title}</div>
                        <div className="notif-item-desc">{item.description}</div>
                        <div className="notif-item-due">Due by {item.date}</div>
                    </div>)
                })}
                </div>
                
                <div className="new-notif">
                    <input id="pTitle" type="text" placeholder="Title" />
                    <textarea id="pDesc" placeholder="Description"></textarea>
                </div>
            </div>

            <div class="footer-buttons">
                <button><span>Send</span><i class="fas fa-arrow-right"></i></button>
            </div>
        </div>
    );
}

export default Notifications;
