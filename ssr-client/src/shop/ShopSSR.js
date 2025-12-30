import ShopDashboard from "./ShopDashboard";
import PropTypes from 'prop-types';

const ShopSSR = ({ pathName='swirlyojpnagar', appName = 'Amuzely', bootStrapCSS=[], locationHref='' }) => {
    console.log('Rendering Store App component on server-side');
    console.log('--bootstrapCSS--', bootStrapCSS);
    let cssPaths = [];
    bootStrapCSS.map(cssPath => {
        console.log('---cssPat1h---', cssPath);
        cssPaths.push('../store/'+cssPath);
    });

    const storePathNameConfig = {
        'swirlyojpnagar': {storeId: '9'},
        'kidsaurajpnagar': {storeId: '13'},
        'mumnminijpnagar': {storeId: '15'}
    }
    
    return (
        <html>
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
                <link rel="stylesheet" href="assets/css/tailwind/tailwind.min.css"></link>
                <link rel="stylesheet" href="assets/css/main.css"></link>
                <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet"></link>
                <link href="https://fonts.googleapis.com/css?family=Quicksand:300,400" rel="stylesheet"></link>
                <title>quickrush - shop now</title>
                
                {
                    cssPaths.map(cssPath => { return <link key={cssPath} rel="stylesheet" href={cssPath}></link>})
                }
            </head>
            <body>
                <div id="root-shop">
                    <ShopDashboard storeConfig={storePathNameConfig[pathName]} locationHref={locationHref} />
                </div>
            </body>
        </html>
    )
}

ShopSSR.propTypes = {
    bootStrapCSS: PropTypes.arrayOf(PropTypes.string).isRequired
}

export default ShopSSR;
