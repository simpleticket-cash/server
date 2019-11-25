"use strict";

function printWalletInfo(wallet) {
  console.log("Funding address: " + wallet.cashAddress);

  return wallet;
}

module.exports = printWalletInfo;
