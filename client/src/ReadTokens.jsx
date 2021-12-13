import React, { useEffect, useState } from "react";
import { MintToken } from "./MintToken";

export const ReadTokens = ({ drizzle, drizzleState }) => {
  console.log(drizzle);
  console.log(drizzleState);
  const [tokensKey, setTokensKey] = useState(null);

  useEffect(() => {
    const contract = drizzle.contracts.OnescreenerHeroToken;

    // let drizzle know we want to watch the `getTokens` method
    const tokensKey = contract.methods["getTokens"].cacheCall();

    // save the `tokensKey` to local component state for later reference
    setTokensKey(tokensKey);
  }, [drizzle]);

  // get the contract state from drizzleState
  const { OnescreenerHeroToken } = drizzleState.contracts;

  // using the saved `dataKey`, get the variable we're interested in
  const tokens = OnescreenerHeroToken.getTokens[tokensKey];

  return (
    <div>
      <h1>Onescreener Hero Tokens</h1>
      <div className="flex mt-12">
        <div className="flex-1">
          <code>{tokens && JSON.stringify(tokens.value, null, 2)}</code>
        </div>
        <div className="flex-auto">
          <MintToken drizzle={drizzle} drizzleState={drizzleState} />
        </div>
      </div>
    </div>
  );
};
