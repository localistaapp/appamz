import {Suspense, lazy, useEffect, useState} from "react";
import "./MainView.css";
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const MainView = () => {
    let view = '';
    const [currView, setCurrView] = useState('');
    useEffect(()=>{
        if(window.location.href) {
            if (window.location.href.indexOf('?') >= 0) {
                view = window.location.href.substring(window.location.href.indexOf('?view=')+6, window.location.href.length);
                setCurrView(view);
            }
        }
    })
    const [message, setMessage] = useState("");
    const AddProductsComponent = lazy(() =>
        //delay(100).then(() => import("./addproducts/AddProducts.js"))
        import("./addproducts/AddProducts.js")
    );

    const ViewProductsComponent = lazy(() =>
        //delay(100).then(() => import("./viewproducts/ViewProducts.js"))
        import("./viewproducts/ViewProducts.js")
    );

    const OnlineOrdersComponent = lazy(() =>
        //delay(100).then(() => import("./viewproducts/ViewProducts.js"))
        import("./onlineorders/OnlineOrders.js")
    );

    const NotificationsComponent = lazy(() =>
        //delay(100).then(() => import("./notifications/Notifications.js"))
        import("./notifications/Notifications.js")
    );

    const StatsComponent = lazy(() =>
        //delay(100).then(() => import("./stats/Stats.js"))
        import("./stats/Stats.js")
    );

    const showMessage = (msg) => {
        setMessage(msg);
    };

    const clearMessage = () => {
        setMessage("");
    };

    return (
        <div className="main">
            {currView == '' && <span></span> }
            {currView == 'add-products' && <Suspense fallback={<></>}>
                    <AddProductsComponent />
                </Suspense>}
            {currView == 'view-products' && <Suspense fallback={<></>}>
                <ViewProductsComponent />
            </Suspense>}
            {currView == 'online-orders' && <Suspense fallback={<></>}>
                <OnlineOrdersComponent />
            </Suspense>}
            {currView == 'notifications' && <Suspense fallback={<></>}>
                <NotificationsComponent />
            </Suspense>}
            {currView == 'stats' && <Suspense fallback={<></>}>
                <StatsComponent />
            </Suspense>}
        </div>
    );
}

export default MainView;
