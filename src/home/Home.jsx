import React, { useState } from "react";
import "./Home.css";

import { useHistory } from "react-router";
import { ImageLoad } from "../components/ImageLoad";

import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";

import axios from "../axios";

export const Home = ({}) => {
  const history = useHistory();
  return (
    <div className="home_phone_body">
      <div className="home_header">
        <div
          className="pro_profile_icon_and_name"
          onClick={() => {
            history.push("/");
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
              history.push("/login");
            }}
          >
            Sign In
          </div>
          <div
            className="home_header_button"
            onClick={() => {
              history.push("/getStarted");
            }}
          >
            Sign Up
          </div>
        </div>
      </div>
      <div className="home_phone_blocks" style={{ minHeight: "13rem" }}>
        <p className="home_phone_blocks_text">
        Connect all your audiences and shoppable content with a single website
        </p>
      </div>
      <div className="home_phone_blocks" style={{ minHeight: "3rem" }}>
        <div
          className="home_header_button"
          onClick={() => {
            history.push("/getStarted");
          }}
          style={{ width: "8.5rem" }}
        >
          Get Started
        </div>
      </div>
      <div
        className="home_phone_blocks"
        style={{ minHeight: "45rem", position: "relative" }}
      >
        <iframe
          src="/josephxtan"
          height="570"
          width="300"
          title="Iframe Example"
          style={{ borderRadius: 20, border: "6px solid grey" }}
        ></iframe>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            bottom: 0,
          }}
          onClick={() => {
            history.push("/josephxtan");
          }}
        >
          <img
            src="https://dciv99su0d7r5.cloudfront.net/1622786851626_photo_2021-06-04_01-33-19.jpg"
            className="pro_profile_top_image_circular"
            style={{
              border: "4px solid white",
              height: "100px",
              width: "100px",
            }}
          />
          <p
            className="home_phone_blocks_smaller_text"
            style={{ marginTop: "0.5rem", fontWeight: 600, color: "grey" }}
          >
            vosh.club/josephxtan
          </p>
        </div>
      </div>

      <div className="home_phone_blocks" style={{ minHeight: "25rem" }}>
        <ImageLoad
          src="https://dciv99su0d7r5.cloudfront.net/social+icons.jpg"
          style={{ width: "100%" }}
        />
        <p className="home_phone_blocks_text" style={{ fontSize: "22px" }}>
          Import your content from your socials with one click
        </p>
      </div>
      <div className="home_phone_blocks" style={{ minHeight: "25rem" }}>
        <ImageLoad
          src="https://dciv99su0d7r5.cloudfront.net/growth_monetise_4.png"
          style={{ width: "100%" }}
        />
        <p className="home_phone_blocks_text" style={{ fontSize: "22px" }}>
          Grow your businesses with Vosh
        </p>
      </div>

      <div
        className="home_phone_blocks"
        style={{ minHeight: "6rem", paddingBottom: "4rem" }}
      >
        <div
          className="home_header_button"
          onClick={() => {
            history.push("/getStarted");
          }}
          style={{ width: "8.5rem" }}
        >
          Get Started
        </div>
      </div>
    </div>
  );
};

{
  /* <div className="computer_QrWrapper">
  <img
    src="https://dciv99su0d7r5.cloudfront.net/vosh_qr.png"
    alt="qr_code"
    style={{ height: 150 }}
  />
  <p>Scan with mobile</p>
</div>; */
}
