import React, { useState, useEffect } from "react";
import "./Landing.css";
import CircularProgress from "@material-ui/core/CircularProgress";

export const Landing = ({
  showStartButton,
  setIsMuted,
  landingClicked,
  setLandingClicked,
  setChecked,
}) => {
  const [disappear, setDisappear] = useState(false);

  const handleOnReadyClick = () => {
    setLandingClicked(true);
    setIsMuted(false);
    setTimeout(() => setDisappear(true), 590);
    if (!localStorage.getItem("USER_ID")) {
      setChecked(true);
    }
  };

  // left: 37, up: 38, right: 39, down: 40,
  // spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
  var keys = { 37: 1, 38: 1, 39: 1, 40: 1 };
  function preventDefault(e) {
    e.preventDefault();
  }
  function preventDefaultForScrollKeys(e) {
    if (keys[e.keyCode]) {
      preventDefault(e);
      return false;
    }
  }
  // modern Chrome requires { passive: false } when adding event
  var supportsPassive = false;
  try {
    window.addEventListener(
      "test",
      null,
      Object.defineProperty({}, "passive", {
        get: function () {
          supportsPassive = true;
        },
      })
    );
  } catch (e) {}
  var wheelOpt = supportsPassive ? { passive: false } : false;
  var wheelEvent =
    "onwheel" in document.createElement("div") ? "wheel" : "mousewheel";
  // call this to Disable
  const disableScroll = () => {
    document
      .getElementById("landing_body")
      .addEventListener("DOMMouseScroll", preventDefault, false); // older FF
    document
      .getElementById("landing_body")
      .addEventListener(wheelEvent, preventDefault, wheelOpt); // modern desktop
    document
      .getElementById("landing_body")
      .addEventListener("touchmove", preventDefault, wheelOpt); // mobile
    document
      .getElementById("landing_body")
      .addEventListener("keydown", preventDefaultForScrollKeys, false);
  };
  // call this to Enable
  // const enableScroll = () => {
  //   console.log("hello");
  //   document
  //     .getElementById("landing_body")
  //     .removeEventListener("DOMMouseScroll", preventDefault, false);
  //   document
  //     .getElementById("landing_body")
  //     .removeEventListener(wheelEvent, preventDefault, wheelOpt);
  //   document
  //     .getElementById("landing_body")
  //     .removeEventListener("touchmove", preventDefault, wheelOpt);
  //   document
  //     .getElementById("landing_body")
  //     .removeEventListener("keydown", preventDefaultForScrollKeys, false);
  // };

  useEffect(() => {
    disableScroll();
  }, []);

  return (
    <>
      {disappear ? null : (
        <div
          id="landing_body"
          className="landing_body"
          onClick={() => {
            showStartButton ? handleOnReadyClick() : console.log("not ready");
          }}
          style={
            landingClicked
              ? {
                  display: "none",
                }
              : {}
          }
        >
          <div className="landing_WelcomeMessageWrapper">
            <p className="landing_WelcomeWord">Vosh</p>
          </div>

          {showStartButton ? (
            <p
              className="landing_WelcomeText animate__animated animate__zoomIn"
              style={{ position: "absolute", bottom: "9rem" }}
            >
              .Club
            </p>
          ) : (
            // <Button className="landing_loading_icons">Start</Button>
            <CircularProgress
              className="landing_loading_icons"
              style={{ color: "white", position: "absolute", bottom: "9rem" }}
            />
          )}
        </div>
      )}
    </>
  );
};
