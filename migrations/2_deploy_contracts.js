var EtherTrust = artifacts.require("./EtherTrust.sol");

module.exports = function(deployer) {
  deployer.deploy(EtherTrust);
};
