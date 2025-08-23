import { useState, createRef, useEffect } from "react";
import axios from 'axios';
import "./Notifications.css";

const Notifications = ({url}) => {
    const [festiveList, setFestiveList] = useState("");

    const loadFestiveNotifications = async () => {
        let businessType = JSON.parse(window.sessionStorage.getItem('user-profile')).businessType;
        let festiveArr = [];
        let month = new Date().getMonth() + 1;
        let day = new Date().getDate();
        axios.get(`/notif-config/${businessType}`)
            .then(function (response) {
                if(response.data != 'auth error') {
                    console.log('--res--', JSON.stringify(response.data));
                    

                    response.data.forEach(item => {
                        let d = item.date;
                        let notifMonth = parseInt(d.split('-')[0],10);
                        let notifDay = parseInt(d.split('-')[1],10);
                        if (month <= notifMonth && day <= notifDay) {
                            festiveArr.push(item);
                        }
                    });


                    setFestiveList(festiveArr);
                }
            }.bind(this));
    }

    const sendNotif = () => {
        const title = document.querySelector('#pTitle').value;
        const description = document.querySelector('#pDesc').value;
        const storeId = JSON.parse(window.sessionStorage.getItem('user-profile')).storeId;

        console.log('--title--', title);
        console.log('--description--', description);
        
        axios.post(`/push-notif`, {title: title, 
            description: description,
            storeId: storeId}).then((response) => {
            console.log('--Notif Response--', response);
        });       
    }

    useEffect(() => {
        const tabs = document.getElementById('notif-tabs');
        const tabElements = document.querySelectorAll('.notif-tab');

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
                <div class="notif-tabs-container">
                    <div class="notif-tabs" id="notif-tabs">
                        <div class="notif-tab active">Festive</div>
                        <div class="notif-tab">Content</div>
                        <div class="notif-tab">Events</div>
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
                <button onClick={sendNotif}><span>Send</span><i class="fas fa-arrow-right"></i></button>
            </div>
        </div>
    );
}

export default Notifications;
