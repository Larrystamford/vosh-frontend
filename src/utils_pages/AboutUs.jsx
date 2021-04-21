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
              src="https://media2locoloco-us.s3.amazonaws.com/icon-192x192.png"
              className="aboutUs_top_image_circular"
              alt="temp avatar"
            />
          </div>
          <div className="aboutUs_top_name">
            <p style={{ fontWeight: 600 }}>@Shoplocoloco</p>
          </div>
        </div>
        <div className="aboutUs_bottomDesc">
          <p>
            Shoplocoloco is a video-first e-commerce platform that aims to make
            shopping more entertaining, social, and fun.
          </p>
          <p>
            When it comes to fulfilling your orders, we know that quality, price
            and delivery speed matters. Hence, we work with various e-commerce
            players to provide you with the best possible experience.
          </p>
          <p>
            Come with us on our journey as we continue to bring you more new and
            exciting products! Follow us now on facebook, instagram & tiktok
            <span style={{ fontWeight: "600" }}> @shoplocoloco</span> !
          </p>

          <img
            alt="google play button"
            src="./google-play-badge.png"
            style={{ height: 60, width: 170, paddingTop: 30 }}
            onClick={() => {
              window.open(
                "https://play.google.com/store/apps/details?id=com.shoplocoloco.www.twa",
                "_blank"
              );
              Event(
                "google-play",
                "google play app store clicked",
                "google play app button"
              );
              return false;
            }}
          />
        </div>
      </div>
    </div>
  );
};
