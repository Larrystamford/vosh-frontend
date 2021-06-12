import React, { useState } from "react";
import "./Home.css";

export const GetStartedDesktop = ({}) => {
  return (
    <div className="home_phone_body">
      <div className="home_header">
        <div
          className="pro_profile_icon_and_name"
          onClick={() => {
            window.open("/", "_self");
          }}
        >
          <img
            src="https://dciv99su0d7r5.cloudfront.net/whale+black.png"
            style={{ height: "16px" }}
          />
        </div>
        <div style={{ display: "flex" }}>
          <div
            className="home_header_button"
            style={{ color: "black", backgroundColor: "transparent" }}
            onClick={() => {
              window.open("/login", "_self");
            }}
          >
            Sign In
          </div>
          <div
            className="home_header_button"
            onClick={() => {
              window.open("/getStarted", "_self");
            }}
          >
            Sign Up
          </div>
        </div>
      </div>
      <div className="home_dekstop_blocks" style={{ minHeight: "50rem" }}>
        <div className="home_dekstop_blocks_left">
          <iframe
            src="/getStarted"
            height="650"
            width="500"
            title="Iframe Example"
            style={{
              borderRadius: 0,
              border: "none",
            }}
          ></iframe>
        </div>
        <div
          className="home_dekstop_blocks_right"
          style={{ position: "relative" }}
        >
          <iframe
            src="/sample"
            height="620"
            width="320"
            title="Iframe Example"
            style={{
              borderRadius: 20,
              border: "6px solid grey",
              marginBottom: "80px",
            }}
          ></iframe>
        </div>
      </div>
    </div>
  );
};
