const OnescreenerHeroToken = artifacts.require("OnescreenerHeroToken");

require("truffle-test-utils").init();

const shouldThrow = require("./utils/shouldThrow").shouldThrow;
const testEvent = require("./utils/testEvent").testEvent;

contract("OnescreenerHeroToken", (accounts) => {
  let [alice, bob, fred] = accounts;
  let contractInstance;
  let tokenId;
  const domain = "my-awesome-domain.com";

  beforeEach(async () => {
    contractInstance = await OnescreenerHeroToken.new();
  });
  context("mint token", () => {
    it("contract-owner should be able to mint new token and approve token transfer", async () => {
      let result = await contractInstance.mint(domain, { from: alice });
      assert.equal(result.receipt.status, true);
      const tokenId = result.logs[0].args.tokenId.toNumber();
      assert.equal(tokenId, 0);
      testEvent(result, "NewToken", {
        tokenId,
        domain,
      });

      result = await contractInstance.approve(bob, tokenId, { from: alice });
      assert.equal(result.receipt.status, true);
      testEvent(result, "Approval", {
        owner: alice,
        approved: bob,
        tokenId,
      });
    });

    it("contract-owner should not be able to mint twice a token for the same domain", async () => {
      const result = await contractInstance.mint(domain, { from: alice });

      assert.equal(result.receipt.status, true);
      await shouldThrow(
        () => contractInstance.mint(domain, { from: alice }),
        "Domain exists already",
      );
    });

    it("non-contract-owner should not be able to mint a new token", async () => {
      await shouldThrow(
        () => contractInstance.mint(domain, { from: bob }),
        "caller is not the owner",
      );
    });

    it("non-contract-owner should not be able to approve token transfer of token", async () => {
      let result = await contractInstance.mint(domain, { from: alice });
      assert.equal(result.receipt.status, true);
      const tokenId = result.logs[0].args.tokenId.toNumber();
      assert.equal(tokenId, 0);

      await shouldThrow(
        () => contractInstance.approve(bob, tokenId, { from: bob }),
        "approve caller is not owner",
      );
    });
  });

  context("claim token", () => {
    it("approved token owner should be able to claim token", async () => {
      await contractInstance.mint("something-else.org", { from: alice });
      let result = await contractInstance.mint(domain, { from: alice });
      tokenId = result.logs[0].args.tokenId.toNumber();

      // Approve transfer as Alice (contract owner) to Fred
      result = await contractInstance.approve(fred, tokenId, { from: alice });
      assert.equal(result.receipt.status, true);
      testEvent(result, "Approval", {
        owner: alice,
        approved: fred,
        tokenId: 1,
      });

      // Transfer as new owner Fred
      tokenId = await contractInstance.getApprovedTokenForOwner(fred, {
        from: fred,
      });
      assert.equal(tokenId, 1);

      result = await contractInstance.transferFrom(alice, fred, tokenId, {
        from: fred,
        gas: 140000,
        value: web3.utils.toWei("0.001", "ether"),
      });

      assert.equal(result.receipt.status, true);
      testEvent(result, "Transfer", {
        from: alice,
        to: fred,
        tokenId: 1,
      });
    });
  });

  context("transfer token", () => {
    it("approved token owner should be able to claim token", async () => {
      await contractInstance.mint("something-else.org", { from: alice });
      let result = await contractInstance.mint(domain, { from: alice });
      tokenId = result.logs[0].args.tokenId.toNumber();

      // Approve transfer as Alice (contract owner) for Fred
      result = await contractInstance.approve(fred, tokenId, { from: alice });
      assert.equal(result.receipt.status, true);
      
      // Transfer as new owner Fred
      tokenId = await contractInstance.getApprovedTokenForOwner(fred, {
        from: fred,
      });
      assert.equal(tokenId, 1);

      result = await contractInstance.transferFrom(alice, fred, tokenId, {
        from: fred,
        gas: 140000,
        value: web3.utils.toWei("0.001", "ether"),
      });

      assert.equal(result.receipt.status, true);

      // Approve transfer as Fred (owner) for Bob
      result = await contractInstance.approve(fred, tokenId, { from: alice });
      assert.equal(result.receipt.status, true);
      

      // Transfer as new owner Bob (paying + 1 ETH)
    });
  });

  contact('change domain', () => {
    it('allowed as owner of token', () => {

    })

    it("denied for other accounts than token owner", () => {});
  })
});
