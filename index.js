"use strict";

const wallet = "wallet.json";
const createWallet = require("./create-wallet");
const printWalletInfo = require("./print-wallet-info");
const waitForFunds = require("./wait-for-funds");
const createToken = require("./create-token");
const listen = require("./listen");

return Promise.resolve(wallet)
  .then(createWallet)
  .then(printWalletInfo)
  .then(waitForFunds)
  .then(createToken)
  .then(console.log)
  .then(listen);
