import React, { useState, useEffect } from "react";
import "./Landing.css";

export const PageNoExist = (props) => {
  if (props.location.pathname == "/") {
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
        <img
          src="https://dciv99su0d7r5.cloudfront.net/ShopLocoLoco+Small+Symbol+White.png"
          alt="loco logo"
          style={{ height: 60 }}
        />
        <p className="landing_WelcomeWord">Nothing Here</p>
        <p className="landing_WelcomeText">
          Look's like this page does not exist
        </p>
        <p className="landing_WelcomeText">Tap anywhere to go back home</p>
      </div>
    </div>
  );
};
