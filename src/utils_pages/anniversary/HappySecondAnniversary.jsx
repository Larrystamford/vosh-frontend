import React, { useState, useEffect, useRef } from "react";
import "./HappySecondAnniversary.css";

import { MusicPlayer } from "./MusicPlayer";
import { IntroText } from "./IntroText";
import { FastText } from "./FastText";
import { Absorb } from "./Absorb";

import HomeOutlinedIcon from "@material-ui/icons/HomeOutlined";
import Button from "@material-ui/core/Button";

import Confetti from "react-confetti";

import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";

export const HappySecondAnniversary = () => {
  const [startShow, setStartShow] = useState(false);
  const [part2, setPart2] = useState(false);

  const [videoFly1, setVideoFly1] = useState(false);
  const [videoFly2, setVideoFly2] = useState(false);
  const [videoFly3, setVideoFly3] = useState(false);
  const [videoFly4, setVideoFly4] = useState(false);
  const [fastWords, setFastWords] = useState(false);
  const [absorb, setAbsorb] = useState(false);
  const [burst, setBurst] = useState(false);
  const [home, setHome] = useState(false);

  useEffect(() => {
    if (startShow) {
      setTimeout(() => {
        setPart2(true);
      }, 10000);
    }
  }, [startShow]);

  if (burst) {
    setTimeout(() => {
      setHome(true);
    }, 7000);
    return (
      <div
        className="HappySecond_LandingBody3 animate__heartBeat"
        style={{
          animationDuration: "1s",
        }}
      >
        <Confetti minWidth="30rem" minHeight="30rem" />

        <div className="HappySecond_flexColumn">
          <p style={{ fontWeight: "bold" }}>I</p>
          <p style={{ fontWeight: "bold" }}>LOCO LOCO</p>
          <p style={{ fontWeight: "bold" }}>YOU</p>
        </div>

        <p
          style={{
            fontFamily: "Verdana",
            fontSize: "12px",
            width: "80%",
            textAlign: "center",
          }}
        >
          Thank you for bringing out the best in me!
        </p>

        {home && (
          <div
            className="happysecond_icon_and_name"
            style={{ position: "absolute", bottom: "3rem" }}
            onClick={(e) => {
              e.preventDefault();
              window.location.href = "https://www.shoplocoloco.com/";
            }}
          >
            <HomeOutlinedIcon />
            <p
              style={{
                fontFamily: "Verdana",
                fontWeight: "bold",
                fontSize: "10px",
                textAlign: "center",
              }}
            >
              Home
            </p>
          </div>
        )}
      </div>
    );
  }

  if (part2) {
    setTimeout(() => {
      setVideoFly1(true);
    }, 1000);
    setTimeout(() => {
      setVideoFly2(true);
    }, 1500);
    setTimeout(() => {
      setVideoFly3(true);
    }, 2000);
    setTimeout(() => {
      setVideoFly4(true);
    }, 2500);
    setTimeout(() => {
      setFastWords(true);
    }, 3500);
    setTimeout(() => {
      setAbsorb(true);
    }, 7500);
    setTimeout(() => {
      setBurst(true);
    }, 15600);

    return (
      <div
        className="HappySecond_LandingBody2 animate__wobble"
        style={{
          animationDuration: "1s",
        }}
      >
        <div className="HappySecond_Row2">
          {videoFly1 ? (
            <video
              autoPlay={true}
              muted={true}
              playsInline
              className="HappySecond_VideoPlayerLeft animate__slideInLeft"
              loop
              src="https://media2locoloco.s3-ap-southeast-1.amazonaws.com/happy1.mp4"
              style={{
                animationDuration: "0.5s",
              }}
            ></video>
          ) : null}
          <div className="HappySecond_VideoPlayerFillerLeft"></div>

          {videoFly2 ? (
            <video
              autoPlay={true}
              muted={true}
              playsInline
              className="HappySecond_VideoPlayerRight animate__slideInRight"
              loop
              src="https://media2locoloco.s3-ap-southeast-1.amazonaws.com/hap2.mp4"
              style={{
                animationDuration: "0.5s",
              }}
            ></video>
          ) : null}
          <div className="HappySecond_VideoPlayerFillerRight"></div>
        </div>
        <div className="HappySecond_Row2">
          {videoFly3 ? (
            <video
              autoPlay={true}
              muted={true}
              playsInline
              className="HappySecond_VideoPlayerLeft animate__slideInLeft"
              loop
              src="https://media2locoloco.s3-ap-southeast-1.amazonaws.com/hap3.mp4"
              style={{
                animationDuration: "0.5s",
              }}
            ></video>
          ) : null}
          <div className="HappySecond_VideoPlayerFillerLeft"></div>

          {videoFly4 ? (
            <video
              autoPlay={true}
              muted={true}
              playsInline
              className="HappySecond_VideoPlayerRight animate__slideInRight"
              loop
              src="https://media2locoloco.s3-ap-southeast-1.amazonaws.com/happy5.mp4"
              style={{
                animationDuration: "0.5s",
              }}
            ></video>
          ) : null}
          <div className="HappySecond_VideoPlayerFillerRight"></div>
        </div>
        {/* {fastWords ? (
          <div className="CenterAbsoluteItems">
            <FastText />
          </div>
        ) : null} */}
        {absorb ? <Absorb /> : null}
      </div>
    );
  }

  return (
    <div className="HappySecond_LandingBody">
      {startShow ? (
        <div className="HappySecond_LandingBody">
          <div id="part1" className="HappySecond_LandingBody">
            {startShow ? <IntroText /> : null}

            <FavoriteIcon
              fontSize="large"
              className="CenterAbsoluteItemsBottom"
              style={{ color: "red", zIndex: "1100" }}
            />
            <FavoriteIcon
              fontSize="large"
              className="CenterAbsoluteItemsBottom animate__animated animate__fadeIn"
              style={{
                animationDelay: "9.2s",
                animationDuration: "0.1s",
                color: "pink",
                height: "9rem",
                width: "9rem",
                zIndex: "1000",
              }}
            />
            <FavoriteIcon
              fontSize="large"
              className="CenterAbsoluteItemsBottom animate__animated animate__fadeIn"
              style={{
                animationDelay: "9.3s",
                animationDuration: "0.1s",
                color: "aliceblue",
                height: "19rem",
                width: "19rem",
                zIndex: "900",
              }}
            />
            <FavoriteIcon
              fontSize="large"
              className="CenterAbsoluteItemsBottom animate__animated animate__fadeIn"
              style={{
                animationDelay: "9.4s",
                animationDuration: "0.1s",
                color: "aqua",
                height: "25rem",
                width: "25rem",
                zIndex: "800",
              }}
            />
            <FavoriteIcon
              fontSize="large"
              className="CenterAbsoluteItemsBottom animate__animated animate__fadeIn"
              style={{
                animationDelay: "9.5s",
                animationDuration: "0.1s",
                color: "cyan",
                height: "30rem",
                width: "30rem",
                zIndex: "700",
              }}
            />
            <FavoriteIcon
              fontSize="large"
              className="CenterAbsoluteItemsBottom animate__animated animate__fadeIn"
              style={{
                animationDelay: "9.6s",
                animationDuration: "0.1s",
                color: "Aquamarine",
                height: "40rem",
                width: "40rem",
                zIndex: "600",
              }}
            />
          </div>
        </div>
      ) : (
        <FavoriteBorderIcon
          fontSize="large"
          className="CenterAbsoluteItemsBottom"
        />
      )}

      <MusicPlayer
        url="https://media2locoloco.s3-ap-southeast-1.amazonaws.com/Electric+Love+-+B%C3%98RNS+(Lyrics)-%5BAudioTrimmer.com%5D+(1).mp3"
        setStartShow={setStartShow}
      />
    </div>
  );
};
