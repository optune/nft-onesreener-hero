import React, { useState } from "react";

export const MintToken = ({ drizzle, drizzleState }) => {
  const [stackId, setStackId] = useState(null);
  const [domain, setDomain] = useState("");
  const [to, setTo] = useState("");

  const onChangeDomain = (e) => {
    setDomain(e.target.value);
  };
  const onChangeTo = (e) => {
    setTo(e.target.value);
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const contract = drizzle.contracts.OnescreenerHeroToken;

    // let drizzle know we want to call the `set` method with `value`
    const stackId = contract.methods["mint"].cacheSend(to, domain, {
      from: drizzleState.accounts[0],
      gas: 4000000,
    });

    // save the `stackId` for later reference
    setStackId(stackId);
  };

  const getTxStatus = () => {
    // get the transaction states from the drizzle state
    const { transactions, transactionStack } = drizzleState;

    // get the transaction hash using our saved `stackId`
    const txHash = transactionStack[stackId];

    // if transaction hash does not exist, don't display anything
    if (!txHash) return null;

    // otherwise, return the transaction status
    return `Transaction status: ${
      transactions[txHash] && transactions[txHash].status
    }`;
  };

  return (
    <div className="w-1/2">
      <form className="mb-12" onSubmit={onSubmit}>
        <div className="flex flex-col mb-4">
          <label
            className="mb-2 uppercase font-bold text-lg text-grey-darkest"
            htmlFor="wallet"
          >
            Onescreener Domain
          </label>
          <input
            className="border py-2 px-3 text-grey-darkest"
            name="domain"
            id="domain"
            type="text"
            onChange={onChangeDomain}
          />
        </div>

        <div className="flex flex-col mb-12">
          <label
            className="mb-2 uppercase font-bold text-lg text-grey-darkest"
            htmlFor="wallet"
          >
            To (Address)
          </label>
          <input
            className="border py-2 px-3 text-grey-darkest"
            name="wallet"
            id="wallet"
            type="text"
            onChange={onChangeTo}
          />
        </div>

        <button
          className="block bg-green-700 hover:bg-green-900 text-white text-lg p-4 rounded-xl"
          type="submit"
        >
          Create Token
        </button>
      </form>

      <p>{getTxStatus()}</p>
    </div>
  );
};
