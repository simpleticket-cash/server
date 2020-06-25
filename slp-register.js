"use strict";

const SLPSDK = require("slp-sdk");
const sendToken = require("./send-token");

const { restURL, lang } = require("./config");

const SLP = new SLPSDK({ restURL });

const map = {};
var d = 1;

function register(slpAddress, wallet) {
  if(!wallet) {
    throw new Error("Missing argument wallet!");
  }

  const mnemonic = wallet.mnemonic;

  const rootSeed = SLP.Mnemonic.toSeed(mnemonic);
  const masterHDNode = SLP.HDNode.fromSeed(rootSeed);

  const address = masterHDNode.derivePath(`m/44'/145'/0'/0/${d}`);
  d = d + 1;

  const cashAddress = SLP.HDNode.toCashAddress(address);
  map[cashAddress] = slpAddress
  console.log("Added ", slpAddress);
  console.log("MAP: %j", map);

  return cashAddress;
}

function get(cashAddress) {
  return map[cashAddress];
}

function addresses() {
  return Object.keys(map);
}

async function checkBalances() {
  const addresses = Object.keys(map);
  console.log("Checking %d addresses", addresses.length);
  const sent = [];

  for(const cashAddress in map) {
    console.log("Checking ", cashAddress);
    const details = await SLP.Address.details(cashAddress);
    const confirmed = details.balanceSat;
    const unconfirmed = details.unconfirmedBalanceSat;
    if(confirmed + unconfirmed  >= 1000) {
      const slpAddress = map[cashAddress];
      console.log("Got payment!! '%s' -> '%s'", cashAddress, slpAddress)
      await sendToken(slpAddress, wallet);
      sent.push(cashAddress);
    }
  }

  sent.forEach(s => {delete map[s]});
}

setInterval(checkBalances, 10000);

module.exports = {addresses, register, get};
