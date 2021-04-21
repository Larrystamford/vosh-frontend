import React, { useState, useEffect } from "react";
import "./Landing.css";

export const PageNoExist = () => {
  return (
    <div
      id="landing_body"
      className="landing_body"
      onClick={() => {
        window.location.assign("https://www.shoplocoloco.com/");
      }}
    >
      <div className="landing_WelcomeMessageWrapper">
        <img
          src="https://media2locoloco-us.s3.amazonaws.com/ShopLocoLoco+Small+Symbol+White.png"
          alt="loco logo"
          style={{ height: 60 }}
        />
        <p className="landing_WelcomeWord">No Internet Connection</p>
        <p className="landing_WelcomeText">Tap anywhere to refresh</p>
      </div>
    </div>
  );
};
