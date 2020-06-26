const mnemonic = require('../mnemonic');
const createWallet = require('../create-wallet');
const waitForFunds = require('../wait-for-funds');

describe('Integrating with the testnet', function() {
  let wallet;

  it('should generate random mnemonic and wallet', function() {
    this.slow(500);
    
    const m = mnemonic();
    wallet = createWallet(m);
  });

  it('should wait for funds', function() {
    this.timeout(0);

    return waitForFunds(wallet);
  });

  it('should create a ticket', function() {

  });

  it('should send 1 ticket', () => {

  });

  it('should return left over funds', () => {
    //bchtest:qqmd9unmhkpx4pkmr6fkrr8rm6y77vckjvqe8aey35
  });
});
