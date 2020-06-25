"use strict"

function mnemonic() {
  function generate() {
    console.log("WARN: System environment variable `MNEMONIC` not set, generating...");
    return SLP.Mnemonic.generate(128);
  }

  return process.env.MNEMONIC || generate();
}

module.exports = mnemonic;
