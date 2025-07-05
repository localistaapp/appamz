import React from "react";
import ReactDOMServer from "react-dom/server";
import path from "path";
import AppSSR from "./ssr-client/src/app/AppSSR";
import StoreSSR from "./ssr-client/src/store/StoreSSR";
import express from "express";
import fs from "fs";
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
const port = 3009;

const bootstrapScripts = [];
const bootstrapCSS = [];
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
ReadDirectoryContentToArray(`${staticPathRoot}/css`, bootstrapCSS);


app.use(vhost('kindjpnagar.amuzely.com', express.static(path.join(__dirname, '/app/blr/kindjpnagar'))))
.use(vhost('urbansareesbroad.amuzely.com', express.static(path.join(__dirname, '/app/blr/urbansareesbroad'))))
.use(vhost('snugglefitsjpnagar.amuzely.com', express.static(path.join(__dirname, '/app/blr/snugglefitsjpnagar'))))
.use(vhost('swirlyojpnagar.amuzely.com', express.static(path.join(__dirname, '/app/blr/swirlyojpnagar'))));

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
    <AppSSR bootStrapCSS={bootstrapCSS} appName="Snugglyf" />,
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
                client.query("Select id from am_store where franchise_id IN ('"+franchiseId+"') ",
                [], (errInner, responseInner) => {
                  if (errInner) {
                    res.send('{"status":"inner-connect-error"}');
                    client.end();
                  } else {
                    storeId = responseInner.rows[0]['id'];
                    res.send('{"franchiseId":'+franchiseId+',"storeId":'+storeId+'}');
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

  console.log('--price--', price);
  console.log('--items--', items);

  const client = new Client(dbConfig)
  client.connect(err => {
    if (err) {
      console.error('error connecting', err.stack)
    } else {
      console.log('connected');

      client.query("INSERT INTO \"public\".\"am_online_order\"(name, mobile, address, delivery_pincode, delivery_schedule, delivery_timeslot, \"order\", price, store_id) VALUES('"+name+"', '"+mobile+"', '"+address+"', '"+pincode+"', '"+schedule+"', '"+slot+"', '"+items+"', '"+price+"', "+storeId+")",
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

app.get("/web-orders/:storeId", function(req, res) {
  let storeId = req.params.storeId;
  const client = new Client(dbConfig)

    client.connect(err => {
        if (err) {
          console.error('error connecting', err.stack)
          res.send('{}');
          client.end();
        } else {
            client.query("Select o.id, o.name, o.mobile, o.status, o.address, o.delivery_pincode, o.delivery_schedule, o.delivery_timeslot, o.price, o.created_at, o.order, o.tracking_link from am_online_order o where o.store_id = $1 order by o.created_at desc",
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
  "/app/*/ssr-client/build/static",
  express.static(__dirname + "/ssr-client/build/static")
);

app.use(
  "/app/ssr-client/build/static",
  express.static(__dirname + "/ssr-client/build/static")
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
  "/store/",
  express.static(path.join(__dirname, 'store'))
);

app.use(
  "/",
  express.static(path.join(__dirname, ''))
);


app.listen(port, () => {
    console.log(`Application started on port ${port}`);
})
