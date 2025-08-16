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


subApp.get("/sw.js", (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.send('importScripts("https://cdn.pushalert.co/sw-83753.js?r=635315")');
});

subApp.get("/manifest.json", (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send('{"name":"Kids Aura","short_name":"Kids Aura","start_url":"https://kidsaurajpnagar.quikrush.com/app/kidsaurajpnagar","id":"https://kidsaurajpnagar.quikrush.com/app/kidsaurajpnagar","display":"standalone","background_color":"#ffffff","theme_color":"#ffffff","icons":[{"src":"https://cdn.pushalert.co/img/pushalert-square-icon-512.png","sizes":"192x192"}]}');
});

app.use(vhost('kindjpnagar.quikrush.com', express.static(path.join(__dirname, '/app/blr/kindjpnagar'))))
.use(vhost('urbansareesbroad.quikrush.com', express.static(path.join(__dirname, '/app/blr/urbansareesbroad'))))
.use(vhost('kidsaurajpnagar.quikrush.com', subApp));

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
  res.send('{"name":"swirlyo","short_name":"swirlyo","start_url":"https://swirlyojpnagar.quikrush.com/app/swirlyojpnagar","id":"https://swirlyojpnagar.quikrush.com/app/swirlyojpnagar","display":"standalone","background_color":"#ffffff","theme_color":"#ffffff","icons":[{"src":"https://cdn.pushalert.co/img/pushalert-square-icon-512.png","sizes":"192x192"}]}');

});

app.use(vhost('swirlyojpnagar.quikrush.com', swirlyoSubApp));

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

app.get("/stats/:email", (req, res) => {
  const client = new Client(dbConfig);
  let email = req.params.email;
  let supportMobile = '';
  email = email.replace('owner@','@');
  let franchiseId = '';
  let storeId = '';
  client.connect(err => {
    if (err) {
      console.error('error connecting', err.stack)
      res.send('{"status":"connect-error"}');
      client.end();
    } else {
        client.query("Select id from am_franchise where owner_email IN ('"+email+"') ",
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
                client.query("Select id, support_mobile from am_store where franchise_id IN ('"+franchiseId+"') ",
                [], (errInner, responseInner) => {
                  if (errInner) {
                    res.send('{"status":"inner-connect-error"}');
                    client.end();
                  } else {
                    storeId = responseInner.rows[0]['id'];
                    supportMobile = responseInner.rows[0]['support_mobile'];
                    res.send('{"franchiseId":'+franchiseId+',"storeId":'+storeId+',"supportMobile":'+supportMobile+'}');
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
        client.query("Select id, title, description, price, eligible_for, tags_default, tags_seasons_special, tags_new_arrival, image_url, in_stock, created_at, highlights from am_store_product where store_id IN ('"+storeId+"') ",
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
                              res.send('{"status":"success"}');
                              client.end();
                             }
                           });
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
          client.query("Select s.id, title, max_cashback_value, app_url, accepting_online_orders from am_store_viral_deals v, am_store s where v.store_id=s.id and v.place_id = $1 order by expiry desc",
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
