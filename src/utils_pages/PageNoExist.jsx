import React from "react";
import "./Landing.css";

export const PageNoExist = (props) => {
  if (props.location.pathname === "/") {
    return <></>;
  }
  return (
    <div
      id="landing_body"
      className="landing_body"
      onClick={() => {
        window.location.assign("https://www.vosh.club/");
      }}
    >
      <div className="landing_WelcomeMessageWrapper">
        <p className="landing_WelcomeWord" style={{ fontSize: 40 }}>
          Opps, nothing here...
        </p>
        <p className="landing_WelcomeText" style={{ marginTop: 40 }}>
          Tap anywhere to go back home
        </p>
      </div>
    </div>
  );
};
