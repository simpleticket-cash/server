"use strict";

const expect = require('chai').expect

const documentUri = require('../document-uri');

describe('#documentUri', function() {

  it('should fail with missing price', function() {
    let f = () => documentUri({name: 'Test conference'});
    expect(f).to.throw();
  });

  it('should work with price in BCH', function() {
    let actual = documentUri({price: '0.1-BCH'});
    expect(actual).to.equal('https://simpleticket.cash/v1?price=0.1-BCH');
  });

  it('should fail with price in USD', function() {
    let actual = documentUri({price: '10-USD'});
    expect(actual).to.equal('https://simpleticket.cash/v1?price=10-USD');
  });
});
