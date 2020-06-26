const SLPSDK = require("slp-sdk");
const qrcode = require('qrcode-terminal');
const pWaitFor = require('p-wait-for');

const { restURL } = require("./config");

const SLP = new SLPSDK({ restURL });

async function getBalance(wallet) {
  try {
    const mnemonic = wallet.mnemonic

    const rootSeed = SLP.Mnemonic.toSeed(mnemonic)
    const masterHDNode = SLP.HDNode.fromSeed(rootSeed)

    // HDNode of BIP44 account
    const account = SLP.HDNode.derivePath(masterHDNode, "m/44'/145'/0'")

    const change = SLP.HDNode.derivePath(account, "0/0")

    // get the cash address
    const cashAddress = SLP.HDNode.toCashAddress(change)
    const slpAddress = SLP.Address.toSLPAddress(cashAddress)

    // first get BCH balance
    const details = await SLP.Address.details(cashAddress)

    console.log(`BCH Balance information for ${slpAddress}:`)
    console.log(details)

    if((details.balance + details.unconfirmedBalance) <= 0) {
      qrcode.generate(cashAddress, function (qrcode) {
        console.log("Balance is zero, please transfer funds to:");
        console.log(cashAddress);
        console.log(qrcode);
      });
    }

    function balanceGreaterThanZero() {
      console.log("balance?");
      return SLP.Address.details(cashAddress)
        .then(details => (details.balance + details.unconfirmedBalance) > 0);
    }

    return pWaitFor(balanceGreaterThanZero, {interval: 10000})
      .then(() => wallet);
  } catch (err) {
    console.error(`Error in getBalance: `, err)
    console.log(`Error message: ${err.message}`)
    throw err
  }
}

module.exports = getBalance;
