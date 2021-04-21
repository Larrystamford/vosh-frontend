import React from "react";
import App from "./App";
import { GlobalStateProvider } from "./customHooks/useGlobalState";

const WrappedApp = (props) => {
  return (
    <GlobalStateProvider>
      <App />
    </GlobalStateProvider>
  );
};

export default WrappedApp;
