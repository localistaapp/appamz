import "./ShopDashboard.css";
import {Suspense, lazy, useEffect, useState} from "react";
import axios from 'axios';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const ShopHeadersComponent = lazy(() =>
    import("./shopheader/ShopHeader.js")
);

const AppSidebarComponent = lazy(() =>
    import("./sidebar/AppSidebar.js")
);

const MainViewComponent = lazy(() =>
    import("./mainview/MainView.js")
);

const CarsComponent = lazy(() =>
    import("../Cars.js" )
);

const CarDetailComponent = lazy(() =>
    import("../CarDetail.js")
);

const FooterComponent = lazy(() => import("./footer/Footer.js"));

const LoadingScreen = () => <div>Loading Cars...</div>;
const LoadingSidebarScreen = () => <div className="loading-screen"><div className="shimmer"><div class="wrapper"><div class="animate image-card"></div><div class="animate stroke title"></div><div class="animate stroke link"></div><div class="animate stroke description"></div></div></div><div class="shimmer"><div class="wrapper"><div class="animate image-card"></div><div class="animate stroke title"></div><div class="animate stroke link"></div><div class="animate stroke description"></div></div></div><div class="shimmer"><div class="wrapper"><div class="animate image-card"></div><div class="animate stroke title"></div><div class="animate stroke link"></div><div class="animate stroke description"></div></div></div><div class="shimmer"><div class="wrapper"><div class="animate image-card"></div><div class="animate stroke title"></div><div class="animate stroke link"></div><div class="animate stroke description"></div></div></div><div class="shimmer"><div class="wrapper"><div class="animate image-card"></div><div class="animate stroke title"></div><div class="animate stroke link"></div><div class="animate stroke description"></div></div></div></div>;
const LoadingFooterScreen = () => <div>Loading Footer...</div>;
const LoadingCarDetailScreen = () => <div>Loading Car Details...</div>;

function ShopDashboard({storeConfig, locationHref}) {
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
            <Suspense fallback={<LoadingSidebarScreen />}><ShopHeadersComponent loggedOut={true} locationHref={locationHref} /></Suspense>
            <div className="app-layout">
                <div><Suspense fallback={<></>}>
                    <MainViewComponent storeConfig={storeConfig} />
                </Suspense></div>
            </div>
        </>
    );
}

export default ShopDashboard;
