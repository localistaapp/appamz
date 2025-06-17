import {Suspense, lazy, useState} from "react";
import "./MainView.css";
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const MainView = ({storeConfig}) => {
    let view = '';
    if(typeof window !== 'undefined' && window.location.href) {
        if (window.location.href.indexOf('?') >= 0) {
            view = window.location.href.substring(window.location.href.indexOf('?view=')+6, window.location.href.length);
        }
    }
    const [message, setMessage] = useState("");
    const AddProductsComponent = lazy(() =>
        //delay(100).then(() => import("./addproducts/AddProducts.js"))
        import("./addproducts/AddProducts.js")
    );

    const ViewProductsComponent = lazy(() =>
        //delay(100).then(() => import("./viewproducts/ViewProducts.js"))
        import("./viewproducts/ViewProducts.js")
    );

    const showMessage = (msg) => {
        setMessage(msg);
    };

    const clearMessage = () => {
        setMessage("");
    };

    return (
        <div className="main">
            {view == '' && <ViewProductsComponent storeConfig={storeConfig} /> }
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
