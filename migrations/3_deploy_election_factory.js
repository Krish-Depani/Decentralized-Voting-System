const ElectionFactory = artifacts.require("ElectionFactory");

module.exports = function(deployer) {
  deployer.deploy(ElectionFactory);
};
