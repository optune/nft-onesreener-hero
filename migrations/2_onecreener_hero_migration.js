var OnescreenerHeroToken = artifacts.require(
  "./OnescreenerHero/OnescreenerHeroToken.sol"
);
module.exports = function (deployer) {
  deployer.deploy(OnescreenerHeroToken);
};
