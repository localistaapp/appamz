import Dashboard from "./Dashboard";
import PropTypes from 'prop-types';

const StoreSSR = ({ bootStrapCSS=[], locationHref='' }) => {
    console.log('Rendering Store App component on server-side');
    
    return (
        <html>
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
                <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet"></link>
                <title>Amuzely | Store Dashboard</title>
                {
                    bootStrapCSS.map(cssPath => { return <link key={cssPath} rel="stylesheet" href={cssPath}></link>})
                }
            </head>
            <body>
                <div id="root-store">
                    <Dashboard locationHref={locationHref} />
                </div>
            </body>
        </html>
    )
}

StoreSSR.propTypes = {
    bootStrapCSS: PropTypes.arrayOf(PropTypes.string).isRequired
}

export default StoreSSR;
