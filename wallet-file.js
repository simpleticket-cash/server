"use strict";

const fs = require("fs-extra");
const path = require("path");

const file = path.join(process.cwd(), "wallet.json");

function exists() {
  return fs.pathExists(file);
}

function read() {
  return fs.readJson(file);
}

function write(wallet) {
  console.log("Write wallet to file");
  return fs.writeJson(file, wallet, {spaces: 2})
    .then(() => wallet);
}

module.exports = {exists, read, write};
