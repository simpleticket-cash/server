"use strict";

const port = process.env.PORT || 3000;
const network = process.env.NETWORK || "mainnet";
const restURL = (network == "mainnet") ? "https://rest.bitcoin.com/v2/" : "https://trest.bitcoin.com/v2/"

module.exports = { port, restURL, network };
