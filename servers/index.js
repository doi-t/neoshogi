const { Nuxt } = require("nuxt");
const express = require("express");

const app = express();

const config = {
  dev: false
};

const nuxt = new Nuxt(config);

let isReady = false;
const readyPromise = nuxt
  .ready()
  .then(() => {
    isReady = true;
  })
  .catch(() => {
    process.exit(1);
  });

async function handleRequest(req, res) {
  console.log(`Received a request: ${req}`);
  console.log(req);
  if (!isReady) {
    await readyPromise;
  }
  res.set("Cache-Control", "public, max-age=1, s-maxage=1");
  await nuxt.render(req, res);
}

app.get("*", handleRequest);

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log("neoshogi server listening on port", port);
});
