"use strict";

const SLPSDK = require("slp-sdk");

const { restURL } = require("./config");

const SLP = new SLPSDK({ restURL });

const documentUri = "https://simpleticket.cash/v1";

async function createTicket(wallet, ticket) {
  try {
    const mnemonic = wallet.mnemonic;

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

    const fundingAddress = slpAddress
    const fundingWif = SLP.HDNode.toWIF(change) // <-- compressed WIF format
    const tokenReceiverAddress = slpAddress
    const batonReceiverAddress = slpAddress
    const bchChangeReceiverAddress = cashAddress

    const createConfig = {
      fundingAddress,
      fundingWif,
      tokenReceiverAddress,
      batonReceiverAddress,
      bchChangeReceiverAddress,
      decimals: 0,
      name: ticket.name,
      documentUri: documentUri + "?price=" + ticket.price,
      documentHash: null,
      initialTokenQty: ticket.initialTokenQty
    }

    const genesisTxId = await SLP.TokenType1.create(createConfig);
    wallet.genesisTxId = genesisTxId;
    console.log(`genesisTxID: ${genesisTxId}`)

    console.log(`View this transaction on the block explorer:`)
    console.log(`https://explorer.bitcoin.com/bch/tx/${genesisTxId}`)

    return wallet;
  } catch (err) {
    console.error(`Error in createTicket: `, err)
    console.log(`Error message: ${err.message}`)
    throw err
  }
}

module.exports = createTicket;
