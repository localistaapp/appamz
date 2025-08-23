import "./Dashboard.css";
import {Suspense, lazy, useEffect, useState} from "react";
import axios from 'axios';
import GoogleOneTapLogin from 'react-google-one-tap-login';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const HeadersComponent = lazy(() =>
    import("./header/Header.js")
);

const SidebarComponent = lazy(() =>
    delay(500).then(() => import("./sidebar/Sidebar.js"))
);

const MainViewComponent = lazy(() =>
    import("./mainview/MainView.js")
);

const CarsComponent = lazy(() =>
    delay(500).then(() => import("../Cars.js" ))
);

const CarDetailComponent = lazy(() =>
    delay(100).then(() => import("../CarDetail.js"))
);

const FooterComponent = lazy(() => import("./footer/Footer.js"));

const LoadingScreen = () => <div>Loading Cars...</div>;
const LoadingSidebarScreen = () => <div className="loading-screen"><div className="shimmer"><div class="wrapper"><div class="animate image-card"></div><div class="animate stroke title"></div><div class="animate stroke link"></div><div class="animate stroke description"></div></div></div><div class="shimmer"><div class="wrapper"><div class="animate image-card"></div><div class="animate stroke title"></div><div class="animate stroke link"></div><div class="animate stroke description"></div></div></div><div class="shimmer"><div class="wrapper"><div class="animate image-card"></div><div class="animate stroke title"></div><div class="animate stroke link"></div><div class="animate stroke description"></div></div></div><div class="shimmer"><div class="wrapper"><div class="animate image-card"></div><div class="animate stroke title"></div><div class="animate stroke link"></div><div class="animate stroke description"></div></div></div><div class="shimmer"><div class="wrapper"><div class="animate image-card"></div><div class="animate stroke title"></div><div class="animate stroke link"></div><div class="animate stroke description"></div></div></div></div>;
const LoadingFooterScreen = () => <div>Loading Footer...</div>;
const LoadingCarDetailScreen = () => <div>Loading Car Details...</div>;

const initializeStats = (email) => {
    let enquiriesArr = [];
    typeof window !== 'undefined' && window.sessionStorage.setItem('user-profile', email);
    axios.get(`/stats/${email}`)
      .then(function (response) {
        if(response.data != 'auth error') {
            typeof window !== 'undefined' && window.sessionStorage.setItem('user', JSON.stringify(email));
            if (response.data) {
                window.sessionStorage.setItem('user-profile', '{"user":"'+email+'","storeId":"'+response.data.storeId+'","franchiseId":"'+response.data.franchiseId+'","supportMobile":"'+response.data.supportMobile+'","businessType":"'+response.data.businessType+'"}');
                /*this.setState({
                  statTotalSales: response.data.eventSales && response.data.storeSales?  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(response.data.eventSales + response.data.storeSales): 0,
                  statEventSales: response.data.eventSales? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(response.data.eventSales) : 0,
                  statStoreSales: response.data.storeSales? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(response.data.storeSales) : 0,
                });*/
            }
            document.getElementById('dash-content').style.display='block';
            document.getElementById('logout').style.display='block';
        }
      }.bind(this));

      const dayName = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
      axios.get(`/content-lookup/${dayName}`)
      .then(function (response) {
        console.log('---content-lookup-response---', response.data);
      }.bind(this));
}

function Dashboard({locationHref}) {
    const [selectedCar, setSelectedCar] = useState(null);
    const [showSideBar, setShowSideBar] = useState(false);

    const toggleSideBar = () => {
        setShowSideBar(!showSideBar);
    }

    useEffect( ()=> {
        if (window.screen.width >= 768) {
            setShowSideBar(true);
        }
    }, []);

    return (
        <>
            <HeadersComponent loggedOut={true} locationHref={locationHref} showSideBar={toggleSideBar} />
            {typeof window !== 'undefined' && window.sessionStorage.getItem('user-profile') == null && <GoogleOneTapLogin onError={(error) => console.log(error)} onSuccess={(response) => {console.log(response);initializeStats(response.email);}} googleAccountConfigs={{ client_id: '854842086574-uk0kfphicblidrs1pkbqi7r242iaih80.apps.googleusercontent.com',auto_select: false,cancel_on_tap_outside: false }} />}
            <div className="app-layout">
                {showSideBar && <Suspense fallback={<LoadingSidebarScreen />}>
                    <SidebarComponent />
                </Suspense>}
                <div><Suspense fallback={<></>}>
                    <MainViewComponent />
                </Suspense></div>
            </div>
        </>
    );
}

export default Dashboard;
