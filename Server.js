import React from "react";
import ReactDOMServer from "react-dom/server";
import path from "path";
import AppSSR from "./ssr-client/src/AppSSR";
import StoreSSR from "./ssr-client/src/store/StoreSSR";
import express from "express";
import fs from "fs";
import HomeStoreSSR from "./ssr-client/src/web/home-store/HomeStoreSSR";
const vhost = require('vhost');

const app = express();
const port = 3009;

const bootstrapScripts = [];
const bootstrapCSS = [];
const staticPathRoot = "ssr-client/build/static";

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
.use(vhost('swirlyojpnagar.amuzely.com', express.static(path.join(__dirname, '/app/blr/swirlyojpnagar'))));

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
