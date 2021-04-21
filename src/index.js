import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

import ReactPixel from "react-facebook-pixel";
import ReactGA from "react-ga";

ReactGA.initialize("UA-190770249-1");
ReactGA.plugin.require("ecommerce");

const advancedMatching = {}; // optional, more info: https://developers.facebook.com/docs/facebook-pixel/advanced/advanced-matching
const options = {
  autoConfig: true, // set pixel's autoConfig. More info: https://developers.facebook.com/docs/facebook-pixel/advanced/
  debug: false, // enable logs
};
ReactPixel.init("1150904565356573", advancedMatching, options);
ReactPixel.track("PageView", {});

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA

// serviceWorker.register({
//   onUpdate: (registration) => {
//     const waitingServiceWorker = registration.waiting;

//     if (waitingServiceWorker) {
//       waitingServiceWorker.addEventListener("statechange", (event) => {
//         if (event.target.state === "activated") {
//           window.location.reload();
//         }
//       });
//       waitingServiceWorker.postMessage({ type: "SKIP_WAITING" });
//     }
//   },
// });
