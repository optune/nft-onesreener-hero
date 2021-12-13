import { useEffect, useState } from "react";
import "./App.css";
import { ReadTokens } from "./ReadTokens";

const App = ({ drizzle }) => {
  const [drizzleSub, setDrizzleSub] = useState({
    loading: true,
    drizzleState: null,
  });

  useEffect(() => {
    // subscribe to changes in the store
    const unsubscribe = drizzle.store.subscribe(() => {
      // every time the store updates, grab the state from drizzle
      const drizzleState = drizzle.store.getState();

      // check to see if it's ready, if so, update local component state
      if (drizzleState.drizzleStatus.initialized) {
        setDrizzleSub({ loading: false, drizzleState });
      }
    });

    return () => unsubscribe();
  }, [drizzle.store]);

  if (drizzleSub.loading) return <div><h1>Loading drizzle ...</h1></div>
  return (
    <ReadTokens
      drizzle={drizzle}
      drizzleState={drizzleSub.drizzleState}
    />
  );
};

export default App;
