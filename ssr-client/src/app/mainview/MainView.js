import {Suspense, lazy, useState, useEffect} from "react";
import "./MainView.css";
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const MainView = ({storeConfig}) => {
    let view = '';
    let storeConfigVal = {};
    const [isClient, setIsClient] = useState(false);
    const [curView, setCurView] = useState('');
    useEffect(() => {
        setIsClient(true);
            window.storeConfig = storeConfig;
            storeConfigVal = storePathNameConfig[window?.location.pathname.split('/')[2]];
            if (window && window?.location.href.indexOf('?') >= 0) {
                view = window?.location.href.substring(window?.location.href.indexOf('?view=')+6, window.location.href.length);
            } else if (window && window?.location.href.indexOf('/app/shop/id=') >= 0) {
                view = 'shop-detail';
            } else if (window && window?.location.href.indexOf('/app/shop') >= 0) {
                view = 'shop-stores';
            } else {
                view = 'default';
            }
            setCurView(view);
      }, []);
        
        
        const storePathNameConfig = {
            'swirlyojpnagar': {storeId: '9'},
            'kidsaurajpnagar': {storeId: '13'},
            'mumnminijpnagar': {storeId: '15'}
        }
        
    const [message, setMessage] = useState("");

    const ViewProductsComponent = lazy(() =>
        //delay(100).then(() => import("./viewproducts/ViewProducts.js"))
        import("./viewproducts/ViewProductsApp.js")
    );

    const ViewShopsComponent = lazy(() =>
        //delay(100).then(() => import("./viewproducts/ViewProducts.js"))
        import("./viewshops/ViewShopsApp.js")
    );

    const ViewFeedComponent = lazy(() =>
        //delay(100).then(() => import("./viewproducts/ViewProducts.js"))
        import("./viewshops/ViewFeedApp.js")
    );

    const ViewShopDetailComponent = lazy(() =>
        //delay(100).then(() => import("./viewproducts/ViewProducts.js"))
        import("./viewshops/ViewShopDetail.js")
    );

    const showMessage = (msg) => {
        setMessage(msg);
    };

    const clearMessage = () => {
        setMessage("");
    };

    return (
        <div className="main">
            {curView == 'default' &&  <Suspense fallback={<></>}>
                    <ViewProductsComponent storeConfig={storeConfigVal} />
                </Suspense>}
            {curView == 'shop-detail' &&  <Suspense fallback={<></>}>
                <ViewShopDetailComponent storeConfig={storeConfigVal} />
            </Suspense>}
            {curView == 'shop-stores' &&  <Suspense fallback={<></>}>
                <ViewFeedComponent storeConfig={storeConfigVal} />
            </Suspense>}
        </div>
    );
}

export default MainView;
