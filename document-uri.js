"use strict";

const base = "https://simpleticket.cash/v1";

function documentUri(ticket) {
  if(!ticket.price) {
    throw Error("Missing property price");
  }

  const uri = new URL(base);
  uri.searchParams.set('price', ticket.price);

  return uri.href;
}

module.exports = documentUri;
