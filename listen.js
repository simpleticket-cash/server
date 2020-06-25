"use strict";

const express = require('express')
const slpRegister = require('./slp-register');

const { ticket } = require("./config");

function listen(wallet) {
  const app = express();
  app.use(express.json());
  const port = 3000
  const html = `
  <html>
  <head>
      <script type="text/javascript" src="https://developer.bitcoin.com/badger/badgerButton-1.0.1.js"></script>
  </head>
  <body>
    <p>Buy ticket to ${ticket.name}</p>
    <p>Receive address <div id="receive"></div></p>
    <p>Send Bitcoin cash to address <div id="sendTo">...</div></p>

    <p>Pay for ticket</p>
    <p>
      <button id="badger-button">
        Pay 1000 Satoshis to buy a ticket!
      </button>
    </p>

    <script src="https://polyfill.io/v3/polyfill.min.js?features=Array.from%2CPromise%2CSymbol%2CObject.setPrototypeOf%2CObject.getOwnPropertySymbols"></script>
    <script src="https://cdn.jsdelivr.net/npm/superagent"></script>

      <script>
        var badgerButton = document.getElementById("badger-button")

        console.log("HEI");

        var a = new Web4Bch(web4bch.currentProvider)

        setTimeout(() => {
          const wallet = new Web4Bch(web4bch.currentProvider)
          console.log("REC: ", wallet.bch.defaultSlpAccount);
          document.getElementById('receive').innerHTML = wallet.bch.defaultSlpAccount;
        }, 100);

        function sendTo(address) {
          var txParams = {
            to: address,
            from: web4bch.bch.defaultAccount,
            value: "1000"
          }
          web4bch.bch.sendTransaction(txParams, (err, res) => {
            if (err) {
              console.log('send err', err)
            } else {
              console.log('send success, transaction id:', res)

              superagent
                .post('/watch')
                .send(txParams)
                .end((err, res) => {
                  if(err) {
                    return cosole.log("ERR: ", err);
                  }
                  const address = res.text;
                  console.log("RES: ", address);
                  document.getElementById('sendTo').innerHTML = address;
                  sendTo(address);
                });

            }
          })
        }

        badgerButton.addEventListener('click', function(event) {
          if (typeof web4bch !== 'undefined') {
            web4bch = new Web4Bch(web4bch.currentProvider)

            superagent
              .post('/register')
              .send({ slpReceiveAddress: web4bch.bch.defaultSlpAccount})
              .end((err, res) => {
                if(err) {
                  return cosole.log("ERR: ", err);
                }
                const address = res.text;
                console.log("RES: ", address);
                document.getElementById('sendTo').innerHTML = address;
                sendTo(address);
              });
          } else {
            console.log("Ensure Badger Wallet is installed and unlocked, then refresh this page")
          }
        })
      </script>

  </body>
  </html>
  `

  app.get('/', (req, res) => res.send(html))

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
