import React, { useState, useEffect } from "react";
import "./Landing.css";

export const ComputerLanding = ({ }) => {

  return (
        <div
          className="computer_landing_body"
        >
          <div className="computer_MessageBox">
      
            <p className="computer_WordHeader">VOSH</p>
            <p className="computer_WelcomeText">Watch genuine shopping recommendations from the internet!</p>
            <p
              className="computer_NormalText"
            >
            Say goodbye to general product advice and random online reviews. Comment on videos and start discussions with people that share similar interests!
            </p>

            <div className="computer_QrWrapper">
            <img
              src="https://dciv99su0d7r5.cloudfront.net/vosh_qr.png"
              alt="qr_code"
              style={{ height: 150 }}

            />
            <p>Scan with mobile</p>
          </div>
          </div>

          <div className="computer_MessageBox">
          <img
            src="https://dciv99su0d7r5.cloudfront.net/computer_no_bg.png"
            alt="computer landing phones"
            style={{ height: 450 }}
          />
        </div>

        <img
        className="computer_bottom_right_logo"
        src="https://dciv99su0d7r5.cloudfront.net/ShopLocoLoco+Small+Symbol+White.png"
        alt="loco logo"
        style={{ height: 25, padding: 20 }}
      />
        </div>
  );
};
