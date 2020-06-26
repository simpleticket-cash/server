"use strict";

const SLPSDK = require("slp-sdk");

const { restURL } = require("./config");

const SLP = new SLPSDK({ restURL });

const documentUri = "https://simpleticket.cash/v1";

async function list(wallet) {
  const mnemonic = wallet.mnemonic

  const rootSeed = SLP.Mnemonic.toSeed(mnemonic)
  const masterHDNode = SLP.HDNode.fromSeed(rootSeed)

  // HDNode of BIP44 account
  const account = SLP.HDNode.derivePath(masterHDNode, "m/44'/145'/0'")

  const change = SLP.HDNode.derivePath(account, "0/0")

  const slpAddress = SLP.HDNode.toSLPAddress(change)

  const tokens = await SLP.Utils.balancesForAddress(slpAddress);

  return tokens;
}

module.exports = {list}
