const Test = artifacts.require('Test');

const deploy = async (deployer, network, accounts) => {
  await deployer.deploy(Test);
};

module.exports = deploy;
