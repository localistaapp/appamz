import { useEffect } from "react";
import AppDashboard from "./AppDashboard";
import PropTypes from 'prop-types';

const AppSSR = ({ pathName='swirlyojpnagar', appName = 'quickrush', bootStrapCSS=[], locationHref='' }) => {
    console.log('Rendering Store App component on server-side');
    console.log('--bootstrapCSS--', bootStrapCSS);
    console.log('--spathName--', pathName);
    console.log('--slocationHref--', locationHref);
    let cssPaths = [];
    bootStrapCSS.map(cssPath => {
        cssPaths.push('../dashboard/'+cssPath);
    });

    const storePathNameConfig = {
        'swirlyojpnagar': {storeId: '9', placeId: ''},
        'kidsaurajpnagar': {storeId: '13', placeId: 'ChIJjSGVUwAVrjsRKuLMxFv9BYE'}
    }
    
    return (
        <html>
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
                <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet"></link>
                <link href="https://fonts.googleapis.com/css?family=Quicksand:100..900" rel="stylesheet"></link>
                <link href="https://fonts.googleapis.com/css?family=Quicksand" rel="stylesheet"></link>
                <meta property="og:title" content="Special offer on Slashify 🎉"/>
                <meta property="og:type" content="website"/>
                <meta property="og:image" content="https://wishler.in/assets/images/deals.png"/>
                <link rel="manifest" href="/manifest.json" />
                <title>{`Lootler - deals on your favourites`}</title>
                <style type="text/css">
                    {`@font-face {
                        font-family: rec;
                        src: url(../../assets/fonts/rec.otf);
                    }`}
                </style>
                {
                    pathName == 'shop' && locationHref == '/app/shop/favourites' && <script src = "https://cdn.pushalert.co/unified_9cdf8f4c010986b0df8a45f97f22b9a6.js" />
                }
                {
                    cssPaths.map(cssPath => { return <link key={cssPath} rel="stylesheet" href={cssPath}></link>})
                }
                { pathName == 'kidsaurajpnagar' && <script src="https://cdn.pushalert.co/unified_57961a2823431df0596bdc85133d8255.js" /> }
                { pathName == 'swirlyojpnagar' && <script src="https://cdn.pushalert.co/integrate_7fc3afe390f150da6b0f4f200227fabe.js" /> }
            </head>
            <body>
                <div id="root-app">
                    <AppDashboard storeConfig={storePathNameConfig[pathName]} locationHref={locationHref} />
                </div>
            </body>
        </html>
    )
}

AppSSR.propTypes = {
    bootStrapCSS: PropTypes.arrayOf(PropTypes.string).isRequired
}

export default AppSSR;
