import React, { useState, useEffect } from "react";
import "./AboutUs.css";
import { useHistory } from "react-router";
import ArrowBackIosOutlinedIcon from "@material-ui/icons/ArrowBackIosOutlined";
import { Event } from "../components/tracking/Tracker";

export const AboutUs = (props) => {
  // file in props.location.state.file
  const history = useHistory();

  return (
    <div className="AboutUs_body">
      <div className="AboutUs_header">
        <ArrowBackIosOutlinedIcon
          onClick={() =>
            history.push({
              pathname: "/profile",
            })
          }
        />
        <span
          style={{
            position: "absolute",
            fontWeight: 700,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          About Us
        </span>
      </div>

      <div className="AboutUs_body_wrapper">
        <div className="aboutUs_top_image_name">
          <div className="aboutUs_top_image">
            <img
              src="https://dciv99su0d7r5.cloudfront.net/favicon-96x96.png"
              className="aboutUs_top_image_circular"
              alt="temp avatar"
            />
          </div>
          <div className="aboutUs_top_name">
            <p style={{ fontWeight: 600 }}>@Vosh.Club</p>
          </div>
        </div>
        <div className="aboutUs_bottomDesc">
          <p>
            Vosh.Club is a video-first e-commerce platform that aims to make
            shopping more entertaining, social, and fun.
          </p>
          <p>
            Come with us on our journey as we continue to bring you more new and
            exciting products! Follow us now on instagram & tiktok
            <span style={{ fontWeight: "600" }}> @vosh.club</span> !
          </p>
        </div>
      </div>
    </div>
  );
};
