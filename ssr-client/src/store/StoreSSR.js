import Dashboard from "./Dashboard";
import PropTypes from 'prop-types';

const StoreSSR = ({ bootStrapCSS=[], locationHref='' }) => {
    console.log('Rendering Store App component on server-side');
    return (
        <html>
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <title>Amuzely | Store Dashboard</title>
                {
                    bootStrapCSS.map(cssPath => <link key={cssPath} rel="stylesheet" href={cssPath}></link>)
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
