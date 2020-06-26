const SLPSDK = require("slp-sdk");
const qrcode = require('qrcode-terminal');
const pWaitFor = require('p-wait-for');

const { restURL } = require("./config");

const SLP = new SLPSDK({ restURL });

async function getBalance(wallet) {
  try {
    const details = await SLP.Address.details(wallet.cashAddress)

    console.log(`BCH Balance information for ${wallet.slpAddress}:`)
    console.log(details)

    if((details.balance + details.unconfirmedBalance) <= 0) {
      qrcode.generate(wallet.cashAddress, function (qrcode) {
        console.log("Balance is zero, please transfer funds to:");
        console.log(wallet.cashAddress);
        console.log(qrcode);
      });
    }

    function balanceGreaterThanZero() {
      return SLP.Address.details(wallet.cashAddress)
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
