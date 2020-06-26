"use strict"

const SLPSDK = require("slp-sdk");

const { restURL } = require('./config');

const SLP = new SLPSDK({ restURL });

function mnemonic() {
  function generate() {
    console.log("WARN: System environment variable `MNEMONIC` not set, generating...");
    return SLP.Mnemonic.generate(128);
  }

  return process.env.MNEMONIC || generate();
}

module.exports = mnemonic;
