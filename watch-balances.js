const SLPSDK = require("slp-sdk");
const wallletFile = require("./wallet-file");
const config = require("./config");

const SLP = new SLPSDK(config);

async function getBalance() {
  try {
    const walletInfo = walletFile.read();
    const mnemonic = walletInfo.mnemonic

    // root seed buffer
    const rootSeed = SLP.Mnemonic.toSeed(mnemonic)
    // master HDNode
    const masterHDNode = SLP.HDNode.fromSeed(rootSeed)

    // HDNode of BIP44 account
    const account = SLP.HDNode.derivePath(masterHDNode, "m/44'/145'/0'")

    const change = SLP.HDNode.derivePath(account, "0/0")

    // get the cash address
    const cashAddress = SLP.HDNode.toCashAddress(change)
    const slpAddress = SLP.Address.toSLPAddress(cashAddress)

    // first get BCH balance
    const balance = await SLP.Address.details(cashAddress)

    console.log(`BCH Balance information for ${slpAddress}:`)
    console.log(balance)
    console.log(`SLP Token information:`)

    // get token balances
    try {
      const tokens = await SLP.Utils.balancesForAddress(slpAddress)

      console.log(JSON.stringify(tokens, null, 2))
    } catch (error) {
      if (error.message === "Address not found") console.log(`No tokens found.`)
      else console.log(`Error: `, error)
    }
  } catch (err) {
    console.error(`Error in getBalance: `, err)
    console.log(`Error message: ${err.message}`)
    throw err
  }
}
getBalance()
