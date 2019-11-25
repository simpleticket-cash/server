const SLPSDK = require("slp-sdk");
const walletFile = require("./wallet-file");
const config = require("./config");

const SLP = new SLPSDK(config);



async function sendToken(tokenReceiverAddress) {
  try {
    const wallet = await walletFile.read();
    const mnemonic = wallet.mnemonic

    const rootSeed = SLP.Mnemonic.toSeed(mnemonic)
    const masterHDNode = SLP.HDNode.fromSeed(rootSeed)

    // HDNode of BIP44 account
    const account = SLP.HDNode.derivePath(masterHDNode, "m/44'/145'/0'")

    const change = SLP.HDNode.derivePath(account, "0/0")

    // get the cash address
    const cashAddress = SLP.HDNode.toCashAddress(change)
    const slpAddress = SLP.HDNode.toSLPAddress(change)

    const fundingAddress = slpAddress
    const fundingWif = SLP.HDNode.toWIF(change) // <-- compressed WIF format
    const bchChangeReceiverAddress = cashAddress

    const tokenId = wallet.genesisTxId;
    console.log("Wallet: ", wallet);

    // Exit if user did not update the tokenId.
    if (!tokenId || tokenId === "") {
      console.log(
        `tokenId value is empty. Update the code with the tokenId of your token.`
      )
      return
    }

    const AMOUNT = 1;

    // Create a config object for minting
    const sendConfig = {
      fundingAddress,
      fundingWif,
      tokenReceiverAddress,
      bchChangeReceiverAddress,
      tokenId: tokenId,
      amount: AMOUNT
    }

    //console.log(`createConfig: ${util.inspect(createConfig)}`)

    // Generate, sign, and broadcast a hex-encoded transaction for sending
    // the tokens.
    const sendTxId = await SLP.TokenType1.send(sendConfig)

    console.log(`sendTxId: %j`, sendTxId)

    console.log(`\nView this transaction on the block explorer:`)
    console.log(`https://explorer.bitcoin.com/bch/tx/${sendTxId}`)
  } catch (err) {
    console.error(`Error in sendToken: `, err)
    console.log(`Error message: ${err.message}`)
    throw err
  }
}

module.exports = sendToken;
