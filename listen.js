"use strict";

const express = require('express')
const mustacheExpress = require('mustache-express');

const slp = require('./slp');
const slpRegister = require('./slp-register');

function listen(wallet) {
  const app = express();
  app.use(express.json());
  app.set('view engine', 'mustache');
  app.engine('mustache', mustacheExpress());

  const port = process.env.PORT || 3000;

  app.get('/', (req, res) => {
    slp.list(wallet)
      .then(render);

      function render(tickets) {
        console.log("Tickets", tickets);
        res.render('index', { tickets });
      }
  });

  app.get('/admin', (req, res) => {
    res.render('admin', { ticket: ticket })
  });

  app.get('/cashid/request', (req, res) => {
    const request = `cashid:${req.hostname}/cashid/auth?x=123`;
    res.json({ request });
  });

  app.post('/cashid/auth', (req, res) => {
    console.log("REQ: ", req);
    res.json({"status": 0});
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

  app.listen(port, () => console.log(`simpleticket-cash-server listening on port ${port}!`))

  console.log("LISTEN");
  return app;
}

module.exports = listen;
