// const OnescreenerHeroToken = artifacts.require("OnescreenerHeroToken");
// const shouldThrow = require("./utils/shouldThrow").shouldThrow;
// contract("OnescreenerHeroToken", (accounts) => {
//   let [alice, bob] = accounts;
//   let contractInstance;
//   beforeEach(async () => {
//     contractInstance = await OnescreenerHeroToken.new();
//   });
//   context("transfer token to new onescreener", () => {
//     it("token-owner should be able to approve token transfer", async () => {
//       const result = await contractInstance.approve(bob, "my-awesome-domain.com", {
//         from: alice,
//       });
//       console.log("RESULT", result);
//       assert.equal(result.receipt.status, true);
//       // assert.equal(result.logs[0].args.name, zombieNames[0]);
//     });
//     it("receiving account should not be able to approve token transfer", (done) => {
//       shouldThrow(
//         () =>
//           contractInstance.mint(bob, "my-awesome-domain.com", {
//             from: bob,
//           }),
//         "caller is not the owner",
//         done
//       );
//     });

//     it("receiving account should not be able to transfer token once approved", (done) => {
      
//           contractInstance.transfer(bob, "my-awesome-domain.com", {
//             from: bob,
//           }),
      
//     });
//   });
//   context("claim token", () => {
//     it("accepted token owner should be able to claim token", async () => {
//       const token = await contractInstance.getApprovedTokenForOwner(bob, {
//         from: bob,
//       });
//       console.log("TOKENS", token);

//       const result = await contractInstance.accept(alice, bob, token.logs[0].args.id, {
//         from: bob,
//         gas: 140000,
//       });
//       console.log("RESULT", result);
//       assert.equal(result.receipt.status, true);
//       // assert.equal(result.logs[0].args.name, zombieNames[0]);
//     });
//   });
// });
