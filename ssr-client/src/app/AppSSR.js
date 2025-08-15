import AppDashboard from "./AppDashboard";
import PropTypes from 'prop-types';

const AppSSR = ({ pathName='swirlyojpnagar', appName = 'quickrush', bootStrapCSS=[], locationHref='' }) => {
    console.log('Rendering Store App component on server-side');
    console.log('--bootstrapCSS--', bootStrapCSS);
    let cssPaths = [];
    bootStrapCSS.map(cssPath => {
        cssPaths.push('../dashboard/'+cssPath);
    });

    const storePathNameConfig = {
        'swirlyojpnagar': {storeId: '9'},
        'kidsaurajpnagar': {storeId: '13'}
    }
    
    return (
        <html>
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
                <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet"></link>
                <link href="https://fonts.googleapis.com/css?family=Quicksand:300,400" rel="stylesheet"></link>
                <meta property="og:title" content="Special offer on Quikrush 🎉"/>
                <meta property="og:type" content="website"/>
                <meta property="og:image" content="https://quikrush.com/assets/images/deals.png"/>
                <title>{`quickrush | hyperlocal deals marketplace`}</title>
                
                {
                    cssPaths.map(cssPath => { return <link key={cssPath} rel="stylesheet" href={cssPath}></link>})
                }
                <script type="text/javascript" src="../../assets/scripts/pa.js"></script>
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
