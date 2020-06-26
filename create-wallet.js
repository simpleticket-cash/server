const SLPSDK = require("slp-sdk");

const { network, restURL } = require("./config");

const SLP = new SLPSDK({ restURL });

function createWallet(mnemonic) {
  const wallet = {}

  console.log("BIP44 $BCH Wallet")
  console.log(`Mnemonic: `, mnemonic)
  wallet.mnemonic = mnemonic

  const rootSeed = SLP.Mnemonic.toSeed(mnemonic)

  const masterHDNode = SLP.HDNode.fromSeed(rootSeed, network);

  // HDNode of BIP44 account
  const account = SLP.HDNode.derivePath(masterHDNode, "m/44'/145'/0'")
  console.log(`BIP44 Account: "m/44'/145'/0'"`)

  const i = 0;
  const childNode = masterHDNode.derivePath(`m/44'/145'/0'/0/${i}`)
  console.log(`m/44'/145'/0'/0/${i}: ${SLP.HDNode.toCashAddress(childNode)}`)

  wallet.cashAddress = SLP.HDNode.toCashAddress(childNode)
  wallet.slpAddress = SLP.Address.toSLPAddress(wallet.cashAddress)

  // derive the first external change address HDNode which is going to spend utxo
  const change = SLP.HDNode.derivePath(account, "0/0")

  // get the cash address
  SLP.HDNode.toCashAddress(change)

  return wallet;
}

module.exports = createWallet;
