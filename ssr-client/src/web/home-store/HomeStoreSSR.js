import HomeStore from "./homeStore";
import PropTypes from 'prop-types';

const HomeStoreSSR = ({ bootStrapCSS=[] }) => {
    console.log('Rendering Home Store App component on server-side');
    return (
        <html>
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <title>Amuzely | Store</title>
                <link rel="preconnect" href="https://fonts.gstatic.com" />
                <link href="https://fonts.cdnfonts.com/css/general-sans?styles=135312,135310,135313,135303" rel="stylesheet" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
                <link rel="stylesheet" href="css/tailwind/tailwind.min.css" />
                <link rel="stylesheet" href="css/main.css" />
                <link rel="icon" type="image/png" sizes="32x32" href="shuffle-for-tailwind.png" />
                <script src="https://cdn.jsdelivr.net/npm/alpinejs@3.13.3/dist/cdn.min.js" defer></script>
                {
                    bootStrapCSS.map(cssPath => <link key={cssPath} rel="stylesheet" href={cssPath}></link>)
                }
            </head>
            <body>
                <div id="root-store">
                    <HomeStore />
                </div>
            </body>
        </html>
    )
}

HomeStoreSSR.propTypes = {
    bootStrapCSS: PropTypes.arrayOf(PropTypes.string).isRequired
}

export default HomeStoreSSR;
