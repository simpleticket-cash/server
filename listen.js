"use strict";

const express = require('express')
const mustacheExpress = require('mustache-express');

const slpRegister = require('./slp-register');

const { ticket } = require("./config");

function listen(wallet) {
  const app = express();
  app.use(express.json());
  app.set('view engine', 'mustache');
  app.engine('mustache', mustacheExpress());

  const port = 3000;

  app.get('/', (req, res) => {
    res.render('index', { ticket: ticket })
  });

  app.post('/register', (req, res) => {
    console.log("REQ :%j", req.body);
    const { slpReceiveAddress } = req.body;

    if(slpReceiveAddress == undefined) {
      return res.send(400, "Missing query slpReceiveAddress\n");
    }

    const cashAddress = slpRegister.register(slpReceiveAddress);
    console.log("RES :%j", cashAddress);
    res.send(cashAddress);
  });

  app.listen(port, () => console.log(`Example app listening on port ${port}!`))

  console.log("LISTEN");
  return app;
}

module.exports = listen;
