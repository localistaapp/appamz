import AppDashboard from "./AppDashboard";
import PropTypes from 'prop-types';

const AppSSR = ({ pathName='swirlyojpnagar', appName = 'Amuzely', bootStrapCSS=[], locationHref='' }) => {
    console.log('Rendering Store App component on server-side');
    console.log('--bootstrapCSS--', bootStrapCSS);
    let cssPaths = [];
    bootStrapCSS.map(cssPath => {
        cssPaths.push('../dashboard/'+cssPath);
    });

    const storePathNameConfig = {
        'swirlyojpnagar': {storeId: '9'},
        'snugglefitsjpnagar': {storeId: '13'}
    }
    
    return (
        <html>
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
                <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet"></link>
                <title>{`${appName} Store`}</title>
                
                {
                    cssPaths.map(cssPath => { return <link key={cssPath} rel="stylesheet" href={cssPath}></link>})
                }
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
