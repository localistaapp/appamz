import React from "react";
import ReactDOMServer from "react-dom/server";
import path from "path";
import AppSSR from "./ssr-client/src/app/AppSSR";
import ShopSSR from "./ssr-client/src/shop/ShopSSR";
import StoreSSR from "./ssr-client/src/store/StoreSSR";
import express from "express";
import fs from "fs";
const { OpenAI } = require('openai');
var { Client } = require('pg');
import HomeStoreSSR from "./ssr-client/src/web/home-store/HomeStoreSSR";
const vhost = require('vhost');
const ImageKit = require('imagekit');
const runTaskRoute = require("./run-task");
const runDailyTaskRoute = require("./run-daily-task");

var axios = require('axios');

let dbConfig = {
  database: 'slimcrust',
  host: 'dpg-cc6s37pgp3jupk0q3tu0-a.singapore-postgres.render.com',
    port: 5432,
    user: 'slimcrust',
    password: '3oXJwFL9ytuMtD7ofv5uhr7LceQVBTsv',
    ssl: { rejectUnauthorized: false },
    keepAlive:true
}

const app = express();
const subApp = express();

const port = 3009;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const bootstrapScripts = [];
const bootstrapCSS = [];
const bootstrapCSSShop = [];
const bootstrapScriptsShop = [];
const staticPathRoot = "ssr-client/build/static";

const imagekit = new ImageKit({
  urlEndpoint: 'https://ik.imagekit.io/amuzely', // https://ik.imagekit.io/your_imagekit_id
  //publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  publicKey: 'public_bPVGjO7o9S+dvjn2+ZSJ6sJ8qQo=',
  //privateKey: process.env.IMAGEKIT_PRIVATE_KEY | 'private_COcANsdOUUACxS6HNCNnJV1OAj0='
  privateKey: 'private_COcANsdOUUACxS6HNCNnJV1OAj0='
});

const ReadDirectoryContentToArray = (folderPath, array) => {
  fs.readdir(path.join(__dirname, folderPath), (err, files) => {
    if (err) {
      return console.log(`Unable to scan this folder: ${folderPath}`);
    }

    files.forEach((fileName) => {
      if (
        (fileName.startsWith("main.") && fileName.endsWith(".js")) ||
        fileName.endsWith(".css")
      ) {
        array.push(`${folderPath}/${fileName}`);
      }
    });
  });
};

ReadDirectoryContentToArray(`${staticPathRoot}/js`, bootstrapScripts);
ReadDirectoryContentToArray(`${staticPathRoot}/js`, bootstrapScriptsShop);
ReadDirectoryContentToArray(`${staticPathRoot}/css`, bootstrapCSS);
ReadDirectoryContentToArray(`${staticPathRoot}/css`, bootstrapCSSShop);



// 
//create vhost to new ssr-client route

/*app.get("/", (req, res) => {
  res.socket.on("error", (error) => console.log("Fatal error occured", error));

  let didError = false;
  const stream = ReactDOMServer.renderToPipeableStream(
    <HomeStoreSSR bootStrapCSS={bootstrapCSS} />,
    {
      bootstrapScripts,
      onShellReady: () => {
        res.statusCode = didError ? 500 : 200;
        res.setHeader("Content-type", "text/html");
        stream.pipe(res);
      },
      onError: (error) => {
        didError = true;
        console.log("Error", error);
      },
    }
  );
});*/

// allow cross-origin requests
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", 
    "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(express.json());

app.get('/auth', function (req, res) {
  // Your application logic to authenticate the user
  // For example, you can check if the user is logged in or has the necessary permissions
  // If the user is not authenticated, you can return an error response
  const { token, expire, signature } = imagekit.getAuthenticationParameters();
  //res.send({ token, expire, signature, publicKey: process.env.IMAGEKIT_PUBLIC_KEY });
  res.send({ token, expire, signature, publicKey: 'public_bPVGjO7o9S+dvjn2+ZSJ6sJ8qQo=' });
});


app.get("/dashboard", (req, res) => {
  res.socket.on("error", (error) => console.log("Fatal error occured", error));

  let didError = false;
  const stream = ReactDOMServer.renderToPipeableStream(
    <StoreSSR bootStrapCSS={bootstrapCSS} />,
    {
      bootstrapScripts,
      onShellReady: () => {
        res.statusCode = didError ? 500 : 200;
        res.setHeader("Content-type", "text/html");
        stream.pipe(res);
      },
      onError: (error) => {
        didError = true;
        console.log("Error", error);
      },
    }
  );
});

app.get("/app", (req, res) => {
  res.socket.on("error", (error) => console.log("Fatal error occured", error));

  let didError = false;
  const stream = ReactDOMServer.renderToPipeableStream(
    <AppSSR bootStrapCSS={bootstrapCSS} appName="" />,
    {
      bootstrapScripts,
      onShellReady: () => {
        res.statusCode = didError ? 500 : 200;
        res.setHeader("Content-type", "text/html");
        stream.pipe(res);
      },
      onError: (error) => {
        didError = true;
        console.log("Error", error);
      },
    }
  );
});

app.get("/shop/:a", (req, res) => {
  res.socket.on("error", (error) => console.log("Fatal error occured", error));

  let didError = false;
  const stream = ReactDOMServer.renderToPipeableStream(
    <ShopSSR bootStrapCSS={bootstrapCSSShop} appName="Snugglyf" />,
    {
      bootstrapScripts,
      onShellReady: () => {
        res.statusCode = didError ? 500 : 200;
        res.setHeader("Content-type", "text/html");
        stream.pipe(res);
      },
      onError: (error) => {
        didError = true;
        console.log("Error", error);
      },
    }
  );
});

app.get("/app/:store", (req, res) => {
  res.socket.on("error", (error) => console.log("Fatal error occured", error));
  const pathName = req.params.store;
  let didError = false;
  
  const stream = ReactDOMServer.renderToPipeableStream(
    <AppSSR pathName={pathName} appName="" bootStrapCSS={bootstrapCSS} locationHref={req.url} />,
    {
      bootstrapScripts,
      onShellReady: () => {
        res.statusCode = didError ? 500 : 200;
        res.setHeader("Content-type", "text/html");
        stream.pipe(res);
      },
      onError: (error) => {
        didError = true;
        console.log("Error", error);
      },
    }
  );
});

subApp.get("/app/:store", (req, res) => {
  res.socket.on("error", (error) => console.log("Fatal error occured", error));
  const pathName = req.params.store;
  let didError = false;
  
  const stream = ReactDOMServer.renderToPipeableStream(
    <AppSSR pathName={pathName} appName="" bootStrapCSS={bootstrapCSS} locationHref={req.url} />,
    {
      bootstrapScripts,
      onShellReady: () => {
        res.statusCode = didError ? 500 : 200;
        res.setHeader("Content-type", "text/html");
        stream.pipe(res);
      },
      onError: (error) => {
        didError = true;
        console.log("Error", error);
      },
    }
  );
});

app.get("/app/:store/:ptype", (req, res) => {
  res.socket.on("error", (error) => console.log("Fatal error occured", error));
  const pathName = req.params.store;
  let didError = false;
  
  const stream = ReactDOMServer.renderToPipeableStream(
    <AppSSR pathName={pathName} appName="" bootStrapCSS={bootstrapCSS} locationHref={req.url} />,
    {
      bootstrapScripts,
      onShellReady: () => {
        res.statusCode = didError ? 500 : 200;
        res.setHeader("Content-type", "text/html");
        stream.pipe(res);
      },
      onError: (error) => {
        didError = true;
        console.log("Error", error);
      },
    }
  );
});

subApp.get("/app/:store/:ptype", (req, res) => {
  res.socket.on("error", (error) => console.log("Fatal error occured", error));
  const pathName = req.params.store;
  let didError = false;
  
  const stream = ReactDOMServer.renderToPipeableStream(
    <AppSSR pathName={pathName} appName="" bootStrapCSS={bootstrapCSS} locationHref={req.url} />,
    {
      bootstrapScripts,
      onShellReady: () => {
        res.statusCode = didError ? 500 : 200;
        res.setHeader("Content-type", "text/html");
        stream.pipe(res);
      },
      onError: (error) => {
        didError = true;
        console.log("Error", error);
      },
    }
  );
});

/*app.get("/manifest.json", (req,res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send('{"name":"lootler","short_name":"lootler","start_url":"https://lootler.com/app/shop/favourites","id":"https://lootler.com/app/shop/favourites","display":"standalone","background_color":"#ffffff","theme_color":"#ffffff","icons":[{"src":"https://cdn.pushalert.co/icons/app-icon-85687-1.png?1766997585","sizes":"192x192"}]}');
})*/

subApp.get("/sw.js", (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.send('importScripts("https://cdn.pushalert.co/sw-84215.js")');
});

subApp.get("/manifest.json", (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send('{"name":"kids aura","short_name":"kids aura","start_url":"https://kidsaurajpnagar.slashify.in/app/kidsaurajpnagar","id":"https://kidsaurajpnagar.slashify.in/app/kidsaurajpnagar","display":"standalone","background_color":"#ffffff","theme_color":"#ffffff","icons":[{"src":"https://cdn.pushalert.co/icons/app-icon-83010-1.png?1757239505","sizes":"192x192"}]}');
});

subApp.get("/manifest.json", (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send('{"name":"Lootler","short_name":"Lootler","start_url":"https://kidsaurajpnagar.lootler.com/app/kidsaurajpnagar","id":"https://kidsaurajpnagar.lootler.com/app/kidsaurajpnagar","display":"standalone","background_color":"#ffffff","theme_color":"#ffffff","icons":[{"src":"https://cdn.pushalert.co/icons/app-icon-85632-1.png?1766641195","sizes":"192x192"}]}');
});

app.use(vhost('kindjpnagar.lootler.com', express.static(path.join(__dirname, '/app/blr/kindjpnagar'))))
.use(vhost('urbansareesbroad.lootler.com', express.static(path.join(__dirname, '/app/blr/urbansareesbroad'))))
.use(vhost('swirlyojpnagar.lootler.com', subApp))
.use(vhost('kidsaurajpnagar.lootler.com', subApp));

const swirlyoSubApp = express();

swirlyoSubApp.get("/app/:store", (req, res) => {
  res.socket.on("error", (error) => console.log("Fatal error occured", error));
  const pathName = req.params.store;
  let didError = false;
  
  const stream = ReactDOMServer.renderToPipeableStream(
    <AppSSR pathName={pathName} appName="" bootStrapCSS={bootstrapCSS} locationHref={req.url} />,
    {
      bootstrapScripts,
      onShellReady: () => {
        res.statusCode = didError ? 500 : 200;
        res.setHeader("Content-type", "text/html");
        stream.pipe(res);
      },
      onError: (error) => {
        didError = true;
        console.log("Error", error);
      },
    }
  );
});


swirlyoSubApp.get("/sw.js", (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.send('importScripts("https://cdn.pushalert.co/sw-83754.js?r=5232");');
});

swirlyoSubApp.get("/manifest.json", (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send('{"name":"swirlyo","short_name":"swirlyo","start_url":"https://swirlyojpnagar.quikrush.com/app/swirlyojpnagar","id":"https://swirlyojpnagar.quikrush.com/app/swirlyojpnagar","display":"standalone","background_color":"#ffffff","theme_color":"#ffffff","icons":[{"src":"https://quikrush.com/assets/images/swirlyojpnagar/icon.png","sizes":"192x192"}]}');

});

app.use(vhost('swirlyojpnagar.wishler.in', swirlyoSubApp));


const shopSubApp = express();

shopSubApp.get("/app/:store", (req, res) => {
  res.socket.on("error", (error) => console.log("Fatal error occured", error));
  const pathName = req.params.store;
  let didError = false;
  
  const stream = ReactDOMServer.renderToPipeableStream(
    <AppSSR pathName={pathName} appName="" bootStrapCSS={bootstrapCSS} locationHref={req.url} />,
    {
      bootstrapScripts,
      onShellReady: () => {
        res.statusCode = didError ? 500 : 200;
        res.setHeader("Content-type", "text/html");
        stream.pipe(res);
      },
      onError: (error) => {
        didError = true;
        console.log("Error", error);
      },
    }
  );
});


shopSubApp.get("/sw.js", (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.send('importScripts("https://cdn.pushalert.co/sw-86897.js");');
});

shopSubApp.get("/manifest.json", (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send('{"name":"lootler","short_name":"lootler","start_url":"https://shop.lootler.com/app/shop/favourites","id":"https://shop.lootler.com/app/shop/favourites","display":"standalone","background_color":"#ffffff","theme_color":"#ffffff","icons":[{"src":"https://shop.lootler.com/assets/images/lsmall.png","sizes":"192x192"}]}');

});

app.use(vhost('shop.lootler.com', shopSubApp));


app.get("/app/:store/:id", (req, res) => {
  res.socket.on("error", (error) => console.log("Fatal error occured", error));
  const pathName = req.params.store;
  let didError = false;
  const stream = ReactDOMServer.renderToPipeableStream(
    <AppSSR pathName={pathName} appName={'Snuggly'} bootStrapCSS={bootstrapCSS} locationHref={req.url} />,
    {
      bootstrapScripts,
      onShellReady: () => {
        res.statusCode = didError ? 500 : 200;
        res.setHeader("Content-type", "text/html");
        stream.pipe(res);
      },
      onError: (error) => {
        didError = true;
        console.log("Error", error);
      },
    }
  );
});

app.get("/dashboard/:store", (req, res) => {
  res.socket.on("error", (error) => console.log("Fatal error occured", error));

  let didError = false;
  const stream = ReactDOMServer.renderToPipeableStream(
    <StoreSSR bootStrapCSS={bootstrapCSS} locationHref={req.url} />,
    {
      bootstrapScripts,
      onShellReady: () => {
        res.statusCode = didError ? 500 : 200;
        res.setHeader("Content-type", "text/html");
        stream.pipe(res);
      },
      onError: (error) => {
        didError = true;
        console.log("Error", error);
      },
    }
  );
});

runTaskRoute(app, new Client(dbConfig), fs, process.env.TASK_KEY);
runDailyTaskRoute(app, new Client(dbConfig), fs, process.env.TASK_KEY);

app.post('/push-notif', function(req, res) {
  let title = req.body.title;
  let description = req.body.description;
  let storeId = req.body.storeId;
  let pushKey = '';
  console.log('--Push Title--', title);
  console.log('--Push Description--', description);
  console.log('--Store Id--', storeId);

  const client = new Client(dbConfig);
  client.connect(err => {
    if (err) {
      console.error('error connecting', err.stack)
      res.send('{"status":"connect-error"}');
      client.end();
    } else {
      client.query("select push_key from am_store where id = "+storeId,
      [], (err, response) => {
            if (err) {
              console.log(err)
                res.send("error");
                client.end();
            } else {
              pushKey = response.rows[0]['push_key'];
              client.end();
              axios
                .post('https://api.pushalert.co/rest/v1/send', 'url=https://kidsaurajpnagar.quikrush.com/app/kidsaurajpnagar/&title='+title+'&message='+description, {headers: {'Authorization': 'api_key='+pushKey}})
                .then(res => {
                  console.log('Pushalert success: ');
                })
                .catch(error => {
                  console.log('Pushalert error: ', error);
                });
            }
      });
  }});

});


app.post('/store-user-segment/create', function(req, res) {
  let nanoId = req.body.nanoid;
  let productType = req.body.productType;
  let storeId = req.body.storeId;
  let pushKey = '';

  const client = new Client(dbConfig);
  client.connect(err => {
    if (err) {
      console.error('error connecting', err.stack)
      res.send('{"status":"connect-error"}');
      client.end();
    } else {
      client.query("select push_key from am_store where id = "+storeId,
      [], (err, response) => {
            if (err) {
              console.log(err)
                res.send("error");
                client.end();
            } else {
              client.query("select segment from am_user_fav_segments where store_id = "+storeId+" and product_type = '"+productType+"'",
              [], (err, res1) => {
                    if (err) {
                      console.log(err)
                        res.send("error");
                        client.end();
                    } else {

                        if (res1.rows.length > 0) {
                          res.send('{"status":"success", "segment": '+res1[0].segment+'}');
                          client.end();
                        } else {
                            pushKey = response.rows[0]['push_key'];
                            axios
                            .post('https://api.pushalert.co/rest/v1/segment/create', 'name=shop4'+productType, {headers: {'Authorization': 'api_key='+pushKey}})
                            .then(result => {
                              const segment = result.data.id;

                              client.query("INSERT INTO \"public\".\"am_user_fav_segments\"(nanoid, segment, product_type, store_id) VALUES($1, $2, $3, $4)",
                              [nanoId, segment, productType, storeId], (err, response) => {
                                    if (err) {
                                      console.log(err);
                                      res.send('{"status":"insert-error"}');
                                      client.end();
                                    } else {
                                      res.send('{"status":"success", "segment": '+segment+'}');
                                      client.end();
                                    }
                                  });
                            })
                            .catch(error => {
                              console.log('Pushalert error: ', error);
                            });
                        }
                    }
                  });
            }
      });
  }});

});

app.get("/stats/:email", (req, res) => {
  const client = new Client(dbConfig);
  let email = req.params.email;
  let supportMobile = '';
  let businessType = '';
  email = email.replace('owner@','@');
  let franchiseId = '';
  let storeId = '';
  client.connect(err => {
    if (err) {
      console.error('error connecting', err.stack)
      res.send('{"status":"connect-error"}');
      client.end();
    } else {
        client.query("Select id, business_type from am_franchise where owner_email IN ('"+email+"') ",
        [], (err, response) => {
          if (err) {
            console.log(err)
              res.send('{"status":"response-error"}');
              client.end();
          } else {
              //res.send(response.rows);
              if (response.rows.length == 0) {
                res.send('{"status":"no-results"}');
                client.end();
              } else {
                franchiseId = response.rows[0]['id'];
                businessType = response.rows[0]['business_type'];
                client.query("Select id, support_mobile from am_store where franchise_id IN ('"+franchiseId+"') ",
                [], (errInner, responseInner) => {
                  if (errInner) {
                    res.send('{"status":"inner-connect-error"}');
                    client.end();
                  } else {
                    storeId = responseInner.rows[0]['id'];
                    supportMobile = responseInner.rows[0]['support_mobile'];
                    res.send('{"franchiseId":'+franchiseId+',"storeId":'+storeId+',"supportMobile":'+supportMobile+',"businessType":"'+businessType+'"}');
                  }
                });
              }
              //res.send('{"franchiseId":'+franchiseId+',"storeId":'+storeOrders+'}');
          }
        });
  }});
});

app.get("/products/:storeId", (req, res) => {
  const client = new Client(dbConfig);
  let storeId = req.params.storeId;
  console.log('---products api storeId--', storeId);
  client.connect(err => {
    if (err) {
      console.error('error connecting', err.stack)
      res.send('{"status":"connect-error"}');
      client.end();
    } else {
        client.query("Select margin, id, title, description, price, eligible_for, tags_default, tags_seasons_special, tags_new_arrival, image_url, in_stock, created_at, highlights from am_store_product where store_id IN ('"+storeId+"') ",
        [], (err, response) => {
          if (err) {
            console.log(err)
              res.send('{"status":"response-error"}');
              client.end();
          } else {
              //res.send(response.rows);
              if (response.rows.length == 0) {
                res.send('{"status":"no-results"}');
                client.end();
              } else {
                const products = getEffectiveSavings(response.rows);
                res.send(products);
                client.end();
              }
          }
        });
  }});
});

app.get("/products/search/:storeId/:productType", (req, res) => {
  const client = new Client(dbConfig);
  let storeId = req.params.storeId;
  let productType = req.params.productType;
  productType = productType.toLocaleLowerCase();
  console.log('---products search api storeId--', storeId);
  client.connect(err => {
    if (err) {
      console.error('error connecting', err.stack)
      res.send('{"status":"connect-error"}');
      client.end();
    } else {
        client.query("Select margin, id, title, description, price, eligible_for, tags_default, tags_seasons_special, tags_new_arrival, image_url, in_stock, created_at, highlights from am_store_product where store_id IN ('"+storeId+"') and (LOWER(description) like '%"+productType+"%' or LOWER(title) like '%"+productType+"%')",
        [], (err, response) => {
          if (err) {
            console.log(err)
              res.send('{"status":"response-error"}');
              client.end();
          } else {
              //res.send(response.rows);
              if (response.rows.length == 0) {
                res.send('{"status":"no-results"}');
                client.end();
              } else {
                const products = getEffectiveSavings(response.rows);
                res.send(products);
                client.end();
              }
          }
        });
  }});
});

app.get("/store/get-all/:storeId", (req, res) => {
  const client = new Client(dbConfig);
  let storeId = req.params.storeId;
  console.log('---store api storeId--', storeId);
  client.connect(err => {
    if (err) {
      console.error('error connecting', err.stack)
      res.send('{"status":"connect-error"}');
      client.end();
    } else {
      client.query("select online_orders_timings,accepting_online_orders,online_orders_pincodes from am_store where id = "+storeId,
      [], (err, response) => {
            if (err) {
              console.log(err)
                res.send("error");
                client.end();
            } else {
              res.send(response.rows);
              client.end();
            }
      });
  }});
});

app.get("/store-stats/:storeId/:type", (req, res) => {
  const client = new Client(dbConfig);
  let storeId = req.params.storeId;
  let type = req.params.type;
  console.log('---store api storeId--', storeId);
  client.connect(err => {
    if (err) {
      console.error('error connecting', err.stack)
      res.send('{"status":"connect-error"}');
      client.end();
    } else {
      client.query("select metric, value from am_store_stats where type = '"+type+"' and store_id = "+storeId,
      [], (err, response) => {
            if (err) {
              console.log(err)
                res.send("error");
                client.end();
            } else {
              res.send(response.rows);
              client.end();
            }
      });
  }});
});

function formatDate(date) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0'); // months are 0-based
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function parseNestedJson(obj) {
  if (Array.isArray(obj)) {
    return obj.map(parseNestedJson);
  } else if (obj && typeof obj === 'object') {
    const result = {};
    for (const key in obj) {
      let val = obj[key];
      if (typeof val === 'string') {
        try {
          val = JSON.parse(val); // attempt to parse string as JSON
        } catch (e) {
          // leave as string if parse fails
        }
      }
      result[key] = parseNestedJson(val);
    }
    return result;
  }
  return obj;
}

app.post('/user-favs/create', async function(req, res) {

  const client = new Client(dbConfig)
  var title = req.body.title;
  var nanoid = req.body.nanoid;
  var highlights = req.body.highlights;
  var price = req.body.price;
  var url = req.body.url;
  var imgUrl = req.body.imgUrl;
  var searchQuery = req.body.searchQuery;
  var related = [];
  var query = '';
  let productType = '';

  let qArr = []; 
  highlights.split(',').forEach((i)=>{if(i.indexOf(':')!=-1){qArr.push(i.split(':')[1]);} else {qArr.push(i);}});
  query = qArr[0] + ' ' + title;
  qArr.unshift();
  query += qArr.join().replaceAll(',', ' ');

  console.log('--ser query--', query);

  const serpApiRes = await axios.get(`https://serpapi.com/search.json?engine=google_shopping&q=${query}&location=India&google_domain=google.co.in&hl=en&gl=in&api_key=${process.env.SERP_API_KEY}`);
  console.log('--serpApiRes--', serpApiRes.data.shopping_results);
  let thumbnails = serpApiRes.data.shopping_results.map((o)=>{return o.thumbnail; });
  let canonical = imgUrl;
  const imageURLs = thumbnails;
  const topK = 4;
    
  // Call OpenAI to get ranking
  const result = await getSimilarityRanking(canonical, imageURLs);
  let ranked = result.rankings;
  let items = [];
  let rest = [];
  for(var i=0; i<ranked.length-1; i++) {
    serpApiRes.data.shopping_results.forEach((item, index) => {
      if(index == ranked[i]) {
        if(!items.find(it=>item.position==it.position)) {
          items.push(item);
        }
      } else {
        if(!rest.find(rt=>item.position==rt.position)) {
          rest.push(item);
        }
      }
    })
  };

  var allItems = items.concat(rest);

  client.query("select product_type from am_store_promo_search where query like '"+searchQuery+"'",
      [], async (err, response) => {
            if (err) {
              console.log(err)
                res.send("error");
                client.end();
            } else {
                      if (response.rows.length > 0) {
                        productType =  response.rows[0].product_type;
                        const client3 = new Client(dbConfig);
                      client3.connect(async (err) => {
                        client3.query("INSERT INTO \"public\".\"am_shop_intent\"(query, product_type, type, product) VALUES($1, $2, $3, $4)",
                          [searchQuery, productType, 'fav', title], (err2) => {
                                if (err2) {
                                  console.log(err2);
                                  client3.end();
                                } else {
                                  client3.end();
                                }
                              });
                            });
                          
                      } } });

  client.connect(err => {
   if (err) {
     console.error('error connecting', err.stack)
   } else {
     console.log('connected')
 
     client.query("INSERT INTO \"public\".\"am_user_favs\"(nanoid, title, price, url, highlights, img_url, related, product_type) VALUES($1, $2, $3, $4, $5, $6, $7, $8)",
                       [nanoid, title, price, url, highlights, imgUrl, JSON.stringify(allItems), productType], (err, response) => {
                             if (err) {
                               console.log(err);
                               res.send('{"status":"insert-error"}');
                               client.end();
                             } else {


                              client.query("select segment from am_user_fav_segments where store_id = 0 and product_type = '"+productType+"'",
                              [], (err, res1) => {
                                    if (err) {
                                      console.log(err)
                                        res.send("error");
                                        client.end();
                                    } else {
                
                                        if (res1.rows.length > 0) {
                                          console.log('--res1--', res1.rows[0]);
                                          res.send('{"status":"success", "segment": '+res1.rows[0].segment+'}');
                                          client.end();
                                        } else {
                                            const pushKey = '8702af38ad1e22d91f8bdd9398b0c7a8';
                                            axios
                                            .post('https://api.pushalert.co/rest/v1/segment/create', 'name=shop4'+productType, {headers: {'Authorization': 'api_key='+pushKey}})
                                            .then(result => {
                                              const segment = result.data.id;
                
                                              client.query("INSERT INTO \"public\".\"am_user_fav_segments\"(nanoid, segment, product_type, store_id) VALUES($1, $2, $3, $4)",
                                              [nanoid, segment, productType, 0], (err, response) => {
                                                    if (err) {
                                                      console.log(err);
                                                      res.send('{"status":"insert-error"}');
                                                      client.end();
                                                    } else {
                                                      res.send('{"status":"success", "segment": '+segment+'}');
                                                      client.end();
                                                    }
                                                  });
                                            })
                                            .catch(error => {
                                              console.log('Pushalert error: ', error);
                                            });
                                        }
                                    }
                                  });
                             }
                           });
   }
 });
 });


 app.post('/user-fav-segments/create', function(req, res) {

  const client = new Client(dbConfig)
  var nanoId = req.body.nanoid;
  var segment = req.body.segment;
  
  client.connect(err => {
   if (err) {
     console.error('error connecting', err.stack)
   } else {
     console.log('connected')
 
     client.query("INSERT INTO \"public\".\"am_user_fav_segments\"(nanoid, segment) VALUES($1, $2)",
                       [nanoId, segment], (err, response) => {
                             if (err) {
                               console.log(err);
                               res.send('{"status":"insert-error"}');
                               client.end();
                             } else {
                              res.send('{"status":"success"}');
                              client.end();
                             }
                           });
   }
 });
 });


 app.get("/user-fav-segments/:nanoId", (req, res) => {
  const client = new Client(dbConfig);
  let nanoId = req.params.nanoId;

  client.connect(err => {
    if (err) {
      console.error('error connecting', err.stack)
      res.send('{"status":"connect-error"}');
      client.end();
    } else {
        client.query("Select segment from \"public\".\"am_user_fav_segments\" where nanoid = '"+nanoId+"'",
        [], (err, response) => {
          if (err) {
            console.log(err)
              res.send('{"status":"response-error"}');
              client.end();
          } else {
              //res.send(response.rows);
              if (response.rows.length == 0) {
                res.send('{"status":"no-results"}');
                client.end();
              } else {
                res.send(response.rows);
                client.end();
              }
          }
        });
  }});
});



/**
* Ask OpenAI to compare images and return JSON with scores.
* Expects canonical first, then list of candidate image URLs.
*/
async function getSimilarityRanking(canonicalUrl, candidateUrls) {
  const instruction = `
  You are given one reference image followed by N candidate images.

  Return ONLY a JSON object:
  {
    "rankings": [
      { "image": "matching image index", "score": 0-100, "explanation": "short reason" }
    ]
  }

  Score 0 = totally different, 100 = visually identical.
  Sort by highest score first.
  `;

  const content = [
    {
      type: "text",
      text: instruction
    },
    {
      type: "image_url",
      image_url: { url: canonicalUrl }
    },
    ...candidateUrls.map(u => ({
      type: "image_url",
      image_url: { url: u }
    }))
  ];
  

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content
      }
    ],
    max_tokens: 800
  });

  const raw = response.choices?.[0]?.message?.content;
  if (!raw) throw new Error("No content from model");

  try {
    return JSON.parse(raw);
  } catch (err) {
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
    return { raw };
  }
}

async function getShoppingIntent(phrase) {
  const instruction = `In the search phrase "${phrase}" on an ecommerce search, identify and create a string of the prodyct_type that the user is looking for - return strictly only product type as a string which is just the main 1 word string that identifies the product query for eg in the query “green sling bag" only return "bag". Don't return any descriptive text in response - only the product type as string`;

  const content = [
    {
      type: "text",
      text: instruction
    }
  ];
  

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content
      }
    ],
    max_tokens: 800
  });

  const raw = response.choices?.[0]?.message?.content;
  if (!raw) throw new Error("No content from model");

  return raw;
  
}


  app.post("/compare", async (req, res) => {
    try {
    const { canonicalURL, imageURLs, topK = 4 } = req.body;
    if (!imageURLs || !Array.isArray(imageURLs) || imageURLs.length === 0) {
    return res.status(400).json({ error: "imageURLs must be a non-empty array" });
    }
    
    
    const canonical = canonicalURL || DEFAULT_CANONICAL;
    
    
    // Call OpenAI to get ranking
    const result = await getSimilarityRanking(canonical, imageURLs);
    
    
    // result may contain 'rankings' array
    if (result.rankings && Array.isArray(result.rankings)) {
    // limit to topK
    const top = result.rankings.slice(0, topK);
    return res.json({ canonical, top, raw: result });
    }
    
    
    // if result is unexpected shape, return it raw
    return res.json({ canonical, raw: result });
    } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "internal error" });
    }
    });

app.get("/feed/search/keyword/:query", async (req, res) => {
  let query = req.params.query;
  let type = req.params.type;

  if(query.indexOf('Under')!==-1) {
    res.send('-error-');
    return;
  }

  const client = new Client(dbConfig);

  client.connect(async (err) => {
    if (err) {
      console.error('error connecting', err.stack);
      client.end();
      return reject(err);
    } else {
      client.query("select results from am_feed_trending where query = '"+query+"'",
      [], async (err, response) => {
            if (err) {
              console.log(err)
                res.send("error");
                client.end();
            } else {
              console.log('--response.rows.length--', response.rows.length);
              if(response.rows.length == 0) {
                const response = await axios.get(`https://affiliate-api.flipkart.net/affiliate/1.0/search.json?resultCount=12&query=${query}`,
                  {headers: {
                    'Fk-Affiliate-Id': 'attiristf',
                    'Fk-Affiliate-Token': process.env.AFF_TOKEN,
                    'Content-Type': 'application/json' 
                  }
              });
                
                
                console.log('--typeof response.data.products--', typeof response.data.products)
                client.query("INSERT INTO \"public\".\"am_feed_trending\"(query, results) VALUES($1, $2)",
                       [query, JSON.stringify(response.data.products)], (err, response) => {
                             if (err) {
                               console.log(err);
                               client.end();
                             } else {
                              client.end();
                             }
                           });
              
                //console.log('--Trending products--', response.data.products);
                res.send(response.data.products);
              } else {
                client.end();
                res.send(response.rows[0]['results']);
              }
            }
      });
    }
  });
});

const applyMarginProtection = (margin, tier) => {
    let effectiveMargin = 0;

    if (margin == '5-10%' && tier == 'Low') {
      effectiveMargin = 0.02;
    } else if (margin == '5-10%' && tier == 'Medium') {
      effectiveMargin = 0.03;
    } else if (margin == '5-10%' && tier == 'High') {
      effectiveMargin = 0.04;
    }

    if (margin == '10-15%' && tier == 'Low') {
      effectiveMargin = 0.05;
    } else if (margin == '10-15%' && tier == 'Medium') {
      effectiveMargin = 0.06;
    } else if (margin == '10-15%' && tier == 'High') {
      effectiveMargin = 0.07;
    }

    if (margin == '15-20%' && tier == 'Low') {
      effectiveMargin = 0.08;
    } else if (margin == '15-20%' && tier == 'Medium') {
      effectiveMargin = 0.09;
    } else if (margin == '15-20%' && tier == 'High') {
      effectiveMargin = 0.1;
    }

    if (margin == '20-30%' && tier == 'Low') {
      effectiveMargin = 0.15;
    } else if (margin == '20-30%' && tier == 'Medium') {
      effectiveMargin = 0.16;
    } else if (margin == '20-30%' && tier == 'High') {
      effectiveMargin = 0.18;
    }

    if (margin == '30-40%' && tier == 'Low') {
      effectiveMargin = 0.2;
    } else if (margin == '30-40%' && tier == 'Medium') {
      effectiveMargin = 0.22;
    } else if (margin == '30-40%' && tier == 'High') {
      effectiveMargin = 0.24;
    }

    if (margin == '40-50%' && tier == 'Low') {
      effectiveMargin = 0.25;
    } else if (margin == '40-50%' && tier == 'Medium') {
      effectiveMargin = 0.27;
    } else if (margin == '40-50%' && tier == 'High') {
      effectiveMargin = 0.3;
    }
    return effectiveMargin;
}

const getEffectiveSavings = (products) => {
  let prodArr = [];
  let cashbackPc = 0.2;
  let tier = 'Low';
  if (cashbackPc == 0.2) {
    tier = 'Medium';
  } else if (cashbackPc > 0.2) {
    tier = 'High';
  }

  products.forEach((product) => {
    let p = product;
    let margin = product.margin;
    let origPrice = parseInt(product.price,10) * 1.2;
    let price = origPrice;
    let offAmount = 0;
    let savingsPc = 0;

    let marginPc = applyMarginProtection(margin, tier);
    let cashbackAmount = cashbackPc * 300;
    let discountedAmount = marginPc * price;
    let totalSavings = cashbackAmount + discountedAmount;
    offAmount = price - totalSavings;
    savingsPc = Math.round((totalSavings/price) * 100);

    p['offAmount'] = Math.round(offAmount);
    p['savingsPc'] = savingsPc;
    p['price'] = origPrice;
    p['margin'] = 0;
    prodArr.push(p);
  });
  return prodArr;
}

app.get("/feed/store-search/keyword/:query", async (req, res) => {
  let searchQuery = req.params.query.trim();
  let productType = '';

  let matching = '';
  const client = new Client(dbConfig);
  
  client.connect(async (err) => {
    if (err) {
      console.error('error connecting', err.stack);
      client.end();
      return reject(err);
    } else {
      client.query("select product_type from am_store_promo_search where query like '"+searchQuery+"'",
      [], async (err, response) => {
            if (err) {
              console.log(err)
                res.send("error");
                client.end();
            } else {
                      console.log('--promo response.rows.length--', response.rows.length);
                      if (response.rows.length > 0) {
                        productType =  response.rows[0].product_type;
                      } else {
                              productType = await getShoppingIntent(searchQuery);
                              const client1 = new Client(dbConfig);
                              client1.connect(async (err) => {
                                client1.query("INSERT INTO \"public\".\"am_store_promo_search\"(query, product_type) VALUES($1, $2)",
                                  [searchQuery, productType], (err2) => {
                                        if (err2) {
                                          console.log(err2);
                                          client1.end();
                                        } else {
                                          client1.end();
                                        }
                                      });
                                    });
                      }

                      const client3 = new Client(dbConfig);
                      client3.connect(async (err) => {
                        client3.query("INSERT INTO \"public\".\"am_shop_intent\"(query, product_type, type) VALUES($1, $2, $3)",
                          [searchQuery, productType, 'search'], (err2) => {
                                if (err2) {
                                  console.log(err2);
                                  client3.end();
                                } else {
                                  client3.end();
                                }
                              });
                            });
                

                      matching = "p.description like \'%"+productType+"%\' or LOWER(p.title) like \'%"+productType.toLocaleLowerCase()+"%\' or LOWER(p.description) like \'%"+productType.toLocaleLowerCase()+"%\' or p.title like \'%"+productType+"%\'";
                    
                      const client2 = new Client(dbConfig);

                      console.log('-match query-', "select p.title, p.image_url, p.price, s.name, s.locality, s.app_url from am_store_product p, am_store s where p.store_id = s.id and ("+matching+") order by name limit 4");
                    
                      client2.connect(async (err) => {
                        if (err) {
                          console.error('error connecting', err.stack);
                          client2.end();
                          return reject(err);
                        } else {
                          client2.query("select p.price, p.margin, p.title, p.image_url, p.price, s.name, s.locality, s.app_url from am_store_product p, am_store s where p.store_id = s.id and ("+matching+") order by name limit 4",
                          [], async (err, response2) => {
                                if (err) {
                                  console.log(err)
                                    res.send("error");
                                    client2.end();
                                } else {
                                  console.log('--response.rows.length--', response2.rows.length);
                                  const products = getEffectiveSavings(response2.rows);

                                  res.send({"meta":{"intent": productType},"results":products});
                                  client2.end();
                                }
                          });
                        }
                      });
              }
      });
    }
  });


});

app.get("/feed/search/favourites/:nanoId", async (req, res) => {
  var nanoId = req.params.nanoId;
  const client = new Client(dbConfig);
  console.log('--favourites nanoid--', nanoId);
  console.log(`select img_url, highlights, related from am_user_favs where nanoid = '${nanoId}' order by created_at desc`);
  client.connect(async (err) => {
    if (err) {
      console.error('error connecting', err.stack);
      client.end();
      return reject(err);
    } else {
      client.query(`select img_url, highlights, related from am_user_favs where nanoid = '${nanoId}' order by created_at desc`,
      [], async (err, response) => {
            if (err) {
              console.log(err)
                res.send("error");
                client.end();
            } else {

              console.log('--Fav response.rows--', response.rows);
              res.send(response.rows);
            }
          }
        );
        }
  });
      
});

app.get("/feed/search/trending/:query", async (req, res) => {
  let query = req.params.query;
  let type = req.params.type;

  if(query.indexOf('Under')!==-1) {
    res.send('-error-');
    return;
  }

  const client = new Client(dbConfig);

  client.connect(async (err) => {
    if (err) {
      console.error('error connecting', err.stack);
      client.end();
      return reject(err);
    } else {
      client.query("select results from am_feed_trending where query = '"+query+"'",
      [], async (err, response) => {
            if (err) {
              console.log(err)
                res.send("error");
                client.end();
            } else {
              console.log('--response.rows.length--', response.rows.length);
              if(response.rows.length == 0) {
                const response = await axios.get(`https://affiliate-api.flipkart.net/affiliate/1.0/search.json?resultCount=12&query=${query}`,
                  {headers: {
                    'Fk-Affiliate-Id': 'attiristf',
                    'Fk-Affiliate-Token': process.env.AFF_TOKEN,
                    'Content-Type': 'application/json' 
                  }
              });
                
                
                console.log('--typeof response.data.products--', typeof response.data.products)
                client.query("INSERT INTO \"public\".\"am_feed_trending\"(query, results) VALUES($1, $2)",
                       [query, JSON.stringify(response.data.products)], (err, response) => {
                             if (err) {
                               console.log(err);
                               client.end();
                             } else {
                              client.end();
                             }
                           });
              
                //console.log('--Trending products--', response.data.products);
                res.send(response.data.products);
              } else {
                client.end();
                res.send(response.rows[0]['results']);
              }
            }
      });
    }
  });
});

app.get("/feed/categories/:cat", async (req, res) => {
  const client = new Client(dbConfig);
  const now = new Date();
  const cat = req.params.cat;
  const currDate = formatDate(new Date());

  console.log('--currDate--', currDate);
  client.connect(async (err) => {
    if (err) {
      console.error('error connecting', err.stack);
      client.end();
      return reject(err);
    } else {
      client.query("select id, searches from am_feed_categories where type = 'trending - "+cat+"' and created_at::date = '"+currDate+"'",
      [], async (err, response) => {
            if (err) {
              console.log(err)
                res.send("error");
                client.end();
            } else {
              console.log('--response.rows.length--', response.rows.length);
              if(response.rows.length == 0) {
                const response = await axios.get(`https://serpapi.com/search.json?engine=google_shopping&q=${cat}&location=India&google_domain=google.co.in&hl=en&gl=in&api_key=${process.env.SERP_API_KEY}`);
                let searches = [];
                searches = response.data.filters.find((f)=>f.type=='Carousel Filters').options.map((o)=>o.text);

                client.query("INSERT INTO \"public\".\"am_feed_categories\"(searches, type) VALUES($1, $2)",
                       [searches.join(), 'trending - '+cat], (err, response) => {
                             if (err) {
                               console.log(err);
                               client.end();
                             } else {
                              client.end();
                             }
                           });
              
                console.log('--Trending searches#1--', searches);
                searches = searches.filter((f)=> f.indexOf('Under')==-1)
                searches.unshift('all');
                res.send(searches.join());
              } else {
                client.end();
                let newArr = response.rows[0]['searches'].split(',');
                newArr.unshift('all');
                res.send(newArr.join());
              }
            }
      });
    }
  });

  
});

app.get("/feed/categories", async (req, res) => {
  const client = new Client(dbConfig);
  const now = new Date();
  const fromDateObj = new Date(now.getFullYear(), now.getMonth() - 4, now.getDate());
  const toDateObj = new Date(now.getFullYear(), now.getMonth() - 2, now.getDate());
  const currDate = formatDate(new Date());
  // Format as YYYY-MM-DD
  const fromDate = formatDate(fromDateObj);
  const toDate = formatDate(toDateObj);

  console.log('--currDate--', currDate);
  client.connect(async (err) => {
    if (err) {
      console.error('error connecting', err.stack);
      client.end();
      return reject(err);
    } else {
      client.query("select id, searches from am_feed_categories where type = 'trending' and created_at::date = '"+currDate+"'",
      [], async (err, response) => {
            if (err) {
              console.log(err)
                res.send("error");
                client.end();
            } else {
              console.log('--response.rows.length--', response.rows.length);
              if(response.rows.length == 0) {
                const response = await axios.get(`https://serpapi.com/search?engine=google_trends&cat=18&date=${fromDate} ${toDate}&geo=IN-KA&gprop=froogle&data_type=RELATED_QUERIES&api_key=${process.env.SERP_API_KEY}`);
                let searches = []
                for(var o in response.data.related_queries.rising) {
                  searches.push(response.data.related_queries.rising[o].query);
                }

                client.query("INSERT INTO \"public\".\"am_feed_categories\"(searches, type) VALUES($1, $2)",
                       [searches.join(), 'trending'], (err, response) => {
                             if (err) {
                               console.log(err);
                               client.end();
                             } else {
                              client.end();
                             }
                           });
              
                console.log('--Trending searches#1--', searches);
                searches.unshift('all');
                res.send(searches.join());
              } else {
                client.end();
                let newArr = response.rows[0]['searches'].split(',');
                newArr.unshift('all');
                res.send(newArr.join());
              }
            }
      });
    }
  });

  

  
});

app.post('/track', function(req, res) {
  let storeId = req.body.storeId;
  let metric = req.body.metric;
  let metricValue = '';
  console.log('--metric--', metric);
  console.log('--Store Id--', storeId);

  const client = new Client(dbConfig);
  client.connect(err => {
    if (err) {
      console.error('error connecting', err.stack)
      res.send('{"status":"connect-error"}');
      client.end();
    } else {
      client.query("select value from am_store_stats where store_id = "+storeId+" and metric = '"+metric+"'",
      [], (err, response) => {
            if (err) {
              console.log(err)
                res.send("error");
                client.end();
            } else {
              metricValue = response.rows[0]['value'];
              console.log('--metricValue--', metricValue);
              metricValue = parseInt(metricValue,10) + 1;
              client.query("UPDATE \"public\".\"am_store_stats\" SET value = "+metricValue+" where store_id = "+storeId+" and metric = '"+metric+"'",
                [], (err, response) => {
                      if (err) {
                        console.log(err)
                          res.send("error");
                          client.end();
                      } else {
                          //res.send(response);
                          res.send('success');
                          client.end();
                      }

                    });
              //client.end();
            }
      });
  }});

});

app.get("/notif-config/:businessType", (req, res) => {
  const client = new Client(dbConfig);
  let businessType = req.params.businessType;
  const fs = require('fs');
  let rawdata = fs.readFileSync(`./ssr-client/src/store/mainview/notifications/${businessType}/festive.json`);
  res.send(rawdata);
});

app.get("/user/cashback/:nanoId/:webPathName", (req, res) => {
  const client = new Client(dbConfig);
  let nanoId = req.params.nanoId;
  let webPathName = req.params.webPathName;
  console.log('---nanoId--', nanoId);
  console.log('---webPathName--', webPathName);
  let cashBackValue = 0;

  client.connect(err => {
    if (err) {
      console.error('error connecting', err.stack)
      res.send('{"status":"connect-error"}');
      client.end();
    } else {
      client.query("select v.collected_over, u.cashback_pc, v.max_cashback_value from am_store_viral_deals v, am_store_user u where v.store_id=u.store_id and v.deal_type = 'viral_cashback' and u.nanoid = $1 and v.app_url LIKE $2",
      [nanoId, webPathName], (err, response) => {
            if (err) {
              console.log(err)
                res.send("error");
                client.end();
            } else {
              if (response.rows && response.rows.length > 0) {
                cashBackValue = response.rows[0]['cashback_pc'];
                cashBackValue = cashBackValue * response.rows[0]['max_cashback_value']/response.rows[0]['collected_over'];
              } 
              res.send('{"cashBackValue": '+cashBackValue+'}');
              client.end();
            }
      });
  }});
});

app.get("/user/st-cashback/:nanoId/:storeId", (req, res) => {
  const client = new Client(dbConfig);
  let nanoId = req.params.nanoId;
  let storeId = req.params.storeId;
  console.log('---nanoId--', nanoId);
  console.log('---storeId--', storeId);
  let cashBackValue = 0;
  let maxCashBackValue = 0;

  client.connect(err => {
    if (err) {
      console.error('error connecting', err.stack)
      res.send('{"status":"connect-error"}');
      client.end();
    } else {
      client.query("select v.collected_over, u.cashback_pc, v.max_cashback_value from am_store_viral_deals v, am_store_user u where v.store_id=u.store_id and v.deal_type = 'viral_cashback' and u.nanoid = $1 and v.store_id = $2",
      [nanoId, storeId], (err, response) => {
            if (err) {
              console.log(err)
                res.send("error");
                client.end();
            } else {
              if (response.rows && response.rows.length > 0) {
                cashBackValue = response.rows[0]['cashback_pc'];
                maxCashBackValue =  response.rows[0]['max_cashback_value']/response.rows[0]['collected_over'];
                cashBackValue = cashBackValue * response.rows[0]['max_cashback_value']/response.rows[0]['collected_over'];
              } 
              res.send('{"cashBackValue": '+cashBackValue+', "maxCashBackValue": '+maxCashBackValue+'}');
              client.end();
            }
      });
  }});
});

app.get("/products/:storeId/:type", (req, res) => {
  const client = new Client(dbConfig);
  let type = req.params.type;
  let storeId = req.params.storeId;

  client.connect(err => {
    if (err) {
      console.error('error connecting', err.stack)
      res.send('{"status":"connect-error"}');
      client.end();
    } else {
        client.query("Select id, title, description, price, eligible_for, tags_default, tags_seasons_special, tags_new_arrival, image_url, in_stock, created_at, highlights from am_store_product where "+type+" IN ('TRUE') AND store_id IN ('"+storeId+"') ",
        [], (err, response) => {
          if (err) {
            console.log(err)
              res.send('{"status":"response-error"}');
              client.end();
          } else {
              //res.send(response.rows);
              if (response.rows.length == 0) {
                res.send('{"status":"no-results"}');
                client.end();
              } else {
                res.send(response.rows);
                client.end();
              }
          }
        });
  }});
});

app.post('/createProduct', function(req, res) {
  //response.send(pages.startYourOwn);

  console.log('--req.body--', req.body);
  const client = new Client(dbConfig)
  var title = req.body.title;
  var highlights = req.body.highlights;
  var description = req.body.description;
  var price = req.body.price;
  var eligibleFor = req.body.eligibleFor;
  var primaryCat = req.body.primaryCat;
  var thumbnailUrl = req.body.thumbnailUrl;
  var storeId = req.body.storeId;
  var tagsSeasonsSpecial = false;
  var tagsNewArrival = false;
  var tagsDefault = false;

  if (primaryCat == "Season's Special") {
    tagsSeasonsSpecial = true;
  } else if (primaryCat == "New Arrival") {
    tagsNewArrival = true;
  } else {
    tagsDefault = true;
  }
 //res.send(pages.getQuote);*/
  client.connect(err => {
   if (err) {
     console.error('error connecting', err.stack)
   } else {
     console.log('connected')
 
     client.query("INSERT INTO \"public\".\"am_store_product\"(title, description, price, eligible_for, tags_default, tags_seasons_special, tags_new_arrival, image_url, highlights, store_id) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)",
                       [title, description, price, eligibleFor, tagsDefault, tagsSeasonsSpecial, tagsNewArrival, thumbnailUrl, highlights, storeId], (err, response) => {
                             if (err) {
                               console.log(err);
                               res.send('{"status":"insert-error"}');
                               client.end();
                             } else {

                                    const client = new Client(dbConfig);
                                  
                                    let pushKey = '';

                                    client.connect(err => {
                                      if (err) {
                                        console.error('error connecting', err.stack)
                                        res.send('{"status":"connect-error"}');
                                        client.end();
                                      } else {
                                        
                                        client.query("select distinct(product_type), segment from am_user_fav_segments where product_type != ''",
                                        [], (err, res1) => {
                                              if (err) {
                                                console.log(err)
                                                  res.send("error");
                                                  client.end();
                                              } else {
                                                        if (res1.rows.length > 0) {
                                                            res1.rows.forEach((item) => {
                                                              if (item['product_type'] != null && item['product_type'] != 'NULL' && item['product_type'] != '' && highlights.indexOf(item['product_type']) >= 0) {
                                                                client.query("select push_key from am_store where id = "+storeId,
                                                                  [], (err, response) => {
                                                                      if (err) {
                                                                        console.log(err)
                                                                          res.send("error");
                                                                          client.end();
                                                                      } else {
                                                                        pushKey = response.rows[0]['push_key'];
                                                                        pushKey = '8702af38ad1e22d91f8bdd9398b0c7a8';
                                                                        client.end();
                                                                        let headline = 'New deal unlocked on '+item['product_type'];
                                                                        let detail = 'Check out this new arrival'
                                                                        axios
                                                                          .post('https://api.pushalert.co/rest/v1/segment/'+item.segment+'/send', 'url=https://kidsaurajpnagar.lootler.com/app/kidsaurajpnagar/'+item['product_type']+'&title='+headline+'&message='+detail, {headers: {'Authorization': 'api_key='+pushKey}})
                                                                          .then(res => {
                                                                            console.log('Pushalert success: ');
                                                                            res.send('{"status":"push success"}');
                                                                            client.end();
                                                                          })
                                                                          .catch(error => {
                                                                            console.log('Pushalert error: ', error);
                                                                            res.send('{"status":"push error"}');
                                                                            client.end();
                                                                          });
                                                                      }
                                                                });
                                                              } else {
                                                                res.send('{"status":"success"}');
                                                              }
                                                            });
                                                            
                                                        } else {
                                                          res.send('{"status":"success"}');
                                                        }
                                                    
                                                }
                                              });
                             
                             }
                           });
   }});
   
 }
 
});

});

 app.use(express.urlencoded({ extended: true }));
 app.post('/store/web-order', function(req, res) {
  
  const price = req.body.price;
  const mobile = req.body.mobile;
  const name = req.body.name;
  const slot = req.body.slot;
  const items = req.body.items;
  const pincode = req.body.pincode;
  const schedule = req.body.schedule;
  const address = req.body.address;
  const storeId = req.body.storeId;
  const fromUrl = req.body.fromUrl;

  console.log('--price--', price);
  console.log('--items--', items);

  const client = new Client(dbConfig)
  client.connect(err => {
    if (err) {
      console.error('error connecting', err.stack)
    } else {
      console.log('connected');

      client.query("INSERT INTO \"public\".\"am_online_order\"(name, mobile, address, delivery_pincode, delivery_schedule, delivery_timeslot, \"order\", price, store_id, from_url, status) VALUES('"+name+"', '"+mobile+"', '"+address+"', '"+pincode+"', '"+schedule+"', '"+slot+"', '"+items+"', '"+price+"', "+storeId+", '"+fromUrl+"', 'PENDING')",
          [], (err, response) => {
                if (err) {
                  console.log(err)
                  res.send("error");
                  client.end();
                } else {
                    client.query("select id,name,mobile,price from am_online_order where mobile=$1 order by created_at desc",
                      [mobile], (err, responseSelect) => {
                            if (err) {
                              console.log(err)
                              res.send("error");
                            } else {
                              if(responseSelect.rows && responseSelect.rows.length > 0) {
                                  let onlineOrderId = responseSelect.rows[0].id;
                                  let onlineOrderName = responseSelect.rows[0].name;
                                  let onlineOrderMobile = responseSelect.rows[0].mobile;
                                  let onlineOrderPrice = responseSelect.rows[0].price;
                                  res.send('{"onlineOrderId":"'+onlineOrderId+'", "onlineOrderName":"'+onlineOrderName+'", "onlineOrderMobile":"'+onlineOrderMobile+'", "onlineOrderPrice":"'+onlineOrderPrice+'"}');
                                } else {
                                  res.send("error");
                                }
                            }
                            client.end();
                    })
                    //res.send("success--");
                    /*const mailOptions = {
                      from: "slimcrustbskowner@gmail.com",
                      to: "slimcrustbsk@gmail.com",
                      cc: 'sampath.oops@gmail.com',
                      subject: "New Web Order",
                      text: "There is a new Web Order. Please check your dashboard.",
                    };
                    transporter.sendMail(mailOptions, (error, info) => {
                      if (error) {
                        console.error("Error sending email: ", error);
                      } else {
                        console.log("Email sent: ", info.response);
                      }
                    });*/
                    
                }

              });
              }
          });
        }
);

app.get("/store/web-order/:onlineOrderId", function(req, res) {
  let onlineOrderId = req.params.onlineOrderId;
  const client = new Client(dbConfig)

    client.connect(err => {
        if (err) {
          console.error('error connecting', err.stack)
          res.send('{}');
          client.end();
        } else {
            client.query("Select id, name, mobile, price, tracking_link, status from am_online_order where id = "+onlineOrderId,
              [], (err, response) => {
                    if (err) {
                      console.log(err);
                      res.send("error");
                      client.end();
                    } else {
                        //res.send(response.rows);
                        if (response.rows.length == 0) {
                          res.send("error");
                          client.end();
                        } else {
                        let onlineOrderId = response.rows[0].id;
                        let onlineOrderName = response.rows[0].name;
                        let onlineOrderMobile = response.rows[0].mobile;
                        let onlineOrderPrice = response.rows[0].price;
                        let trackingLink = response.rows[0].tracking_link;
                        let status = response.rows[0].status;
                        res.send('{"tracking_link":"'+trackingLink+'","onlineOrderId":"'+onlineOrderId+'", "onlineOrderName":"'+onlineOrderName+'", "onlineOrderMobile":"'+onlineOrderMobile+'", "onlineOrderPrice":"'+onlineOrderPrice+'", "status": "'+status+'"}');
                    
                          client.end();
                        }
                    }
                  });
         }
    });
});

app.get('/shops/search/:cat/:q/:lat/:long', async (req, res) => {
  const query = encodeURIComponent(req.params.q);
  const cat = encodeURIComponent(req.params.cat);
  let catValue = cat;
  const apiKey = process.env.GOOGLE_API_KEY;

  let lat = req.params.lat;
  let long = req.params.long;

  console.log('--lat--', lat);
  console.log('--long--', long);
  console.log('--req.params.q--', req.params.q);

  /*if (cat == 'fashion') {
    catValue = encodeURIComponent('fashion boutique');
  } else if (cat == 'essentials') {
    catValue = encodeURIComponent('essential stores');
  } else if (cat == 'cafes') {
    catValue = encodeURIComponent('cafes');
  } else if (cat == 'saloons') {
    catValue = encodeURIComponent('saloons');
  }*/
  let url = `https://maps.googleapis.com/maps/api/place/textsearch/json?fields=formatted_address%2Cname%2Crating%2Copening_hours%2Cgeometry&query=${catValue}%in%20${query}&inputtype=textquery&key=%20AIzaSyA38gnkeYsgyTgs4vAXt2r10Vlgg1R2-ec`;
  
  if (lat != 'undefined' && long != 'undefined' && req.params.q == 'undefined') {
    url = `https://maps.googleapis.com/maps/api/place/textsearch/json?fields=formatted_address%2Cname%2Crating%2Copening_hours%2Cgeometry&query=${catValue}&inputtype=textquery&key=%20AIzaSyA38gnkeYsgyTgs4vAXt2r10Vlgg1R2-ec&location=${lat},${long}&radius=7000`;
  }

  const response = await fetch(url);
  const data = await response.json();
  res.json(data); // Send back to browser
});

app.get('/shops/place/:placeId', async (req, res) => {
  const apiKey = process.env.GOOGLE_API_KEY;
  let placeId = req.params.placeId;

  let url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address,review,rating,user_ratings_total,geometry&key=AIzaSyA38gnkeYsgyTgs4vAXt2r10Vlgg1R2-ec`;

  const response = await fetch(url);
  response.json().then(async (data) => {
    let reviewIndex = 1;
    let reviewStr = '';
    let reviewPrompt = 'Can you share upto top 5 topics as comma-separated (with emojis) these reviews are sharing about to add to the section "whats the rush about" (only consider positive comments) - ';
    data.result.reviews.forEach((review) => {
      reviewStr += `${reviewIndex}.${review.text}`;
      reviewIndex++;
    });
    reviewPrompt += reviewStr;

    try {
      const prompt = reviewPrompt;
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
      });
  
      const messages = response.choices[0].message.content;
      res.json(messages);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error generating review summary");
    }
    //res.json(data); // Send back to browser
  });
  
});

app.get('/shops/place-detail/:placeId', async (req, res) => {
  const apiKey = process.env.GOOGLE_API_KEY;
  let placeId = req.params.placeId;

  let url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,place_id,formatted_address,rating,user_ratings_total,geometry&key=AIzaSyA38gnkeYsgyTgs4vAXt2r10Vlgg1R2-ec`;

  const response = await fetch(url);
  response.json().then(async (data) => {
    res.json(data.result);
  });
  
});

app.get('/shops/deals/:placeId', async (req, res) => {
  let placeId = req.params.placeId;
  const client = new Client(dbConfig)

  client.connect(err => {
      if (err) {
        console.error('error connecting', err.stack)
        res.send('{}');
        client.end();
      } else {
          client.query("Select s.id, title, max_cashback_value, s.app_url, accepting_online_orders from am_store_viral_deals v, am_store s where v.store_id=s.id and v.place_id = $1 order by expiry desc",
                      [placeId], (err, response) => {
                            if (err) {
                              console.log(err);
                              res.send("error");
                              client.end();
                            } else {
                               //res.send(response.rows);
                               if (response.rows.length == 0) {
                                  res.send("error");
                                  client.end();
                               } else {
                                  res.send({appUrl: response.rows[0].app_url, viralDeals: response.rows, storeId:response.rows[0].id });
                                  client.end();
                               }
                            }
                          });
       }
      });
});

app.get("/web-orders/:storeId", function(req, res) {
  let storeId = req.params.storeId;
  const client = new Client(dbConfig)

    client.connect(err => {
        if (err) {
          console.error('error connecting', err.stack)
          res.send('{}');
          client.end();
        } else {
            client.query("Select o.id, o.name, o.mobile, o.status, o.address, o.delivery_pincode, o.delivery_schedule, o.delivery_timeslot, o.price, o.created_at, o.order, o.tracking_link, o.from_url from am_online_order o where o.store_id = $1 order by o.created_at desc",
                        [storeId], (err, response) => {
                              if (err) {
                                console.log(err);
                                res.send("error");
                                client.end();
                              } else {
                                 //res.send(response.rows);
                                 if (response.rows.length == 0) {
                                    res.send("error");
                                    client.end();
                                 } else {
                                    res.send(response.rows);
                                    client.end();
                                 }
                              }
                            });
         }
    });


});

app.post('/store/web-order/update', function(req, res) {
  const trackingLink = req.body.trackingLink;
  const onlineOrderId = req.body.onlineOrderId;
  
  const client = new Client(dbConfig)
  client.connect(err => {
    if (err) {
      console.error('error connecting', err.stack)
    } else {
      client.query("UPDATE \"public\".\"am_online_order\" SET tracking_link = $1 where id = $2",
          [trackingLink, onlineOrderId], (err, response) => {
                if (err) {
                  console.log(err)
                    res.send("error");
                    client.end();
                } else {
                    //res.send(response);
                    res.send('success');
                    client.end();
                }

              });
  }
 })
});

app.get('/clear', function(req, res) {
  
  const client = new Client(dbConfig)
  client.connect(err => {
    if (err) {
      console.error('error connecting', err.stack)
    } else {
      client.query("DELETE from \"public\".\"am_store_user\" where store_id = 13",
          [], (err, response) => {
                if (err) {
                  console.log(err)
                    res.send("error");
                    client.end();
                } else {
                    //res.send(response);
                    res.send('success');
                    client.end();
                }

              });
  }
 })
});

app.post('/store/user/update/', function(req, res) {
  const storeId = req.body.storeId;
  const nanoId = req.body.nanoId;
  let cashbackPc = 0.05;
  const client = new Client(dbConfig)

    client.connect(err => {
        if (err) {
          console.error('error connecting', err.stack)
          res.send('{}');
          client.end();
        } else {
            client.query("Select cashback_pc from am_store_user where store_id = $1 and nanoid = $2",
                        [storeId, nanoId], (err, response) => {
                              if (err) {
                                console.log(err);
                                res.send("error");
                                client.end();
                              } else {
                                 //res.send(response.rows);
                                 if (response.rows.length == 0) {
                                    res.send("error");
                                    client.end();
                                 } else {
                                  cashbackPc = response.rows[0].cashback_pc;
                                    console.log('--curr cashback_pc--', cashbackPc);
                                    if (cashbackPc == 0.05) {
                                      cashbackPc = 0.2;
                                    } else {
                                      if (cashbackPc < 1) {
                                        cashbackPc = cashbackPc + 0.2;
                                      }
                                    }
                                    console.log('--to cashback_pc--', cashbackPc);

                                    if (cashbackPc <= 1) {
                                      client.query("UPDATE \"public\".\"am_store_user\" SET cashback_pc = $1 where nanoid = $2 and store_id = $3",
                                        [cashbackPc, nanoId, storeId], (err1, response1) => {
                                              if (err1) {
                                                console.log(err1)
                                                res.send("error");
                                                  client.end();
                                              } else {
                                                  //res.send(response);
                                                  res.send('success');
                                                  client.end();
                                              }

                                            });
                                    } else {
                                      res.send(response.rows);
                                      client.end();
                                    }
                                 }
                              }
                            });
         }
    });
});

app.post('/store/user/create', function(req, res) {
  const storeId = req.body.storeId;
  const nanoId = req.body.nanoId;
  const cashbackPc = req.body.cashbackPc;
  const storeUrl = req.body.storeUrl;
  
  const client = new Client(dbConfig)
  client.connect(err => {
    if (err) {
      console.error('error connecting', err.stack)
    } else {
      const query = `
      INSERT INTO am_store_user (store_id, nanoid, cashback_pc)
      VALUES ($1, $2, $3)
      ON CONFLICT (store_id, nanoid) 
      DO UPDATE SET
      store_id = EXCLUDED.store_id,
      cashback_pc = EXCLUDED.cashback_pc
      RETURNING *;
    `;

    const values = [storeId, nanoId, cashbackPc];

      client.query(query, values, (err, response) => {
        if (err) {
          console.log(err)
        } else {
            //res.send(response);
        }
      });


      const query1 = `
      INSERT INTO am_store_user_follows (store_id, nanoid, store_url)
      VALUES ($1, $2, $3)
      ON CONFLICT (store_id, nanoid) 
      DO UPDATE SET
      store_id = EXCLUDED.store_id,
      store_url = EXCLUDED.store_url
      RETURNING *;
    `;

    const values1 = [storeId, nanoId, storeUrl];

      client.query(query1, values1, (err, response) => {
        if (err) {
          console.log(err)
            res.send("error");
            client.end();
        } else {
            //res.send(response);
            res.send('success');
            client.end();
        }
      });
  }
 })
});

app.get("/example", (req, res) => {
  res.socket.on("error", (error) => console.log("Fatal error occured", error));

  let didError = false;
  const stream = ReactDOMServer.renderToPipeableStream(
    <AppSSR bootStrapCSS={bootstrapCSS} />,
    {
      bootstrapScripts,
      onShellReady: () => {
        res.statusCode = didError ? 500 : 200;
        res.setHeader("Content-type", "text/html");
        stream.pipe(res);
      },
      onError: (error) => {
        didError = true;
        console.log("Error", error);
      },
    }
  );
});

app.use(
  "/ssr-client/build/static",
  express.static(__dirname + "/ssr-client/build/static")
);

app.use(
  "/dashboard/ssr-client/build/static",
  express.static(__dirname + "/ssr-client/build/static")
);

app.use(
  "/app/dashboard/ssr-client/build/static",
  express.static(__dirname + "/ssr-client/build/static")
);

app.use(
  "/store/dashboard/ssr-client/build/static",
  express.static(__dirname + "/ssr-client/build/static")
);

app.use(
  "/store/ssr-client/build/static",
  express.static(__dirname + "/ssr-client/build/static")
);

app.use(
  "/app/*/ssr-client/build/static",
  express.static(__dirname + "/ssr-client/build/static")
);

app.use(
  "/shop/*/ssr-client/build/static",
  express.static(__dirname + "/ssr-client/build/static")
);

app.use(
  "/app/ssr-client/build/static",
  express.static(__dirname + "/ssr-client/build/static")
);

app.use(
  "/shop/ssr-client/build/static",
  express.static(__dirname + "/shop/ssr-client/build/static")
);


app.use(
  "/app/",
  express.static(path.join(__dirname, 'app'))
);

app.use(
  "/assets/",
  express.static(path.join(__dirname, 'assets'))
);

app.use(
  "/",
  express.static(path.join(__dirname, 'app/js/kidsaurajpnagar/'))
);

app.get(
  "/store/"
  , function(req, res) {
    res.redirect('/store.html');
  }
);

app.use(
  "/",
  express.static(path.join(__dirname, ''))
);


app.listen(port, () => {
    console.log(`Application started on port ${port}`);
})
