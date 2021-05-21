import React from "react";
import "./Landing.css";

export const PageNoExist = () => {
  return (
    <div
      id="landing_body"
      className="landing_body"
      onClick={() => {
        window.location.assign("https://www.vosh.club/");
      }}
    >
      <div className="landing_WelcomeMessageWrapper">
        <img
          src="https://dciv99su0d7r5.cloudfront.net/ShopLocoLoco+Small+Symbol+White.png"
          alt="loco logo"
          style={{ height: 60 }}
        />
        <p className="landing_WelcomeWord">No Internet Connection</p>
        <p className="landing_WelcomeText">Tap anywhere to refresh</p>
      </div>
    </div>
  );
};
