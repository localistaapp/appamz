import {Suspense, lazy, useState, useEffect} from "react";
import "./MainView.css";
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const MainView = ({storeConfig}) => {
    let view = '';
    let storeConfigVal = {};
    const [isClient, setIsClient] = useState(false);
    useEffect(() => {
        setIsClient(true);
      }, []);
    //if(typeof window !== 'undefined' && window.location.href) {
        if (isClient) {
            window.storeConfig = storeConfig
        }
        
        const storePathNameConfig = {
            'swirlyojpnagar': {storeId: '9'},
            'snugglefitsjpnagar': {storeId: '13'}
        }
        if (isClient) {
            storeConfigVal = storePathNameConfig[window?.location.pathname.split('/')[2]];
            if (window && window?.location.href.indexOf('?') >= 0) {
                view = window?.location.href.substring(window?.location.href.indexOf('?view=')+6, window.location.href.length);
            } else {
                view = 'default';
            }
        }
        
    //}
    const [message, setMessage] = useState("");
    const AddProductsComponent = lazy(() =>
        //delay(100).then(() => import("./addproducts/AddProducts.js"))
        import("./addproducts/AddProducts.js")
    );

    const ViewProductsComponent = lazy(() =>
        //delay(100).then(() => import("./viewproducts/ViewProducts.js"))
        import("./viewproducts/ViewProductsApp.js")
    );

    const showMessage = (msg) => {
        setMessage(msg);
    };

    const clearMessage = () => {
        setMessage("");
    };

    return (
        <div className="main">
            {view == 'default' &&  <Suspense fallback={<></>}>
                    <ViewProductsComponent storeConfig={storeConfigVal} />
                </Suspense>}
            {view == 'add-products' && <Suspense fallback={<></>}>
                    <AddProductsComponent />
                </Suspense>}
            {view == 'view-products' && <Suspense fallback={<></>}>
                <ViewProductsComponent />
            </Suspense>}
            
        </div>
    );
}

export default MainView;
