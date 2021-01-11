const Watchlist = artifacts.require("./Watchlist.sol");

module.exports = function(deployer) {
  deployer.deploy(Watchlist);
};
