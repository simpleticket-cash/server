"use strict";

require('dotenv').config();

const mnemonic = require("./mnemonic");
const createWallet = require("./create-wallet");
const printWalletInfo = require("./print-wallet-info");
const waitForFunds = require("./wait-for-funds");
const listen = require("./listen");

return Promise.resolve(mnemonic())
  .then(createWallet)
  .then(printWalletInfo)
  .then(waitForFunds)
  .then(listen);
