import React, { useEffect, useState } from "react";
import "./IntroText.css";

export const IntroText = () => {
  var textArray = [
    "Software Engineering",
    "full-stack development",
    "searching for the best Tom Yam Goong",
  ];

  const [typedText, setTypedText] = useState([]);

  const typingDelay = 100;
  const erasingDelay = 50;
  const newTextDelay = 1000;
  let textIndex = 0;
  let charIndex = 0;

  function type() {
    if (charIndex < textArray[textIndex].length) {
      setTypedText((prevState) => [
        ...prevState,
        textArray[textIndex][charIndex],
      ]);

      charIndex++;
      setTimeout(type, typingDelay);
    } else {
      setTimeout(erase, newTextDelay);
    }
  }

  function erase() {
    if (charIndex > 0) {
      setTypedText((prevState) => [
        ...prevState.splice(0, prevState.length - 2),
      ]);
      charIndex--;
      setTimeout(erase, erasingDelay);
    } else {
      textIndex++;
      if (textIndex >= textArray.length) {
        textIndex = 0;
      }
      setTimeout(type, typingDelay);
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    setTimeout(type, newTextDelay + 500);
  });

  return (
    <div>
      <div className="IntroText_headers animate__animated animate__backInUp">
        <p>Hi,</p>
      </div>
      <div
        style={{ animationDelay: "1s", paddingBottom: "5rem" }}
        className="IntroText_headers animate__animated animate__backInUp"
      >
        <p
          style={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          Tan Jie Hui
          <h4
            style={{
              animationDelay: "1.5s",
              paddingLeft: "1rem",
              color: "pink",
            }}
            className="animate__animated animate__bounce"
          >
            .
          </h4>
          <h4
            style={{
              animationDelay: "2s",
              paddingLeft: "0.7rem",
              color: "aliceblue",
            }}
            className="animate__animated animate__bounce"
          >
            .
          </h4>
          <h4
            style={{
              animationDelay: "2.5s",
              paddingLeft: "0.7rem",
              color: "aqua",
            }}
            className="animate__animated animate__bounce"
          >
            .
          </h4>
          <h4
            style={{
              animationDelay: "3s",
              paddingLeft: "0.7rem",
              color: "Aquamarine",
            }}
            className="animate__animated animate__bounce"
          >
            .
          </h4>
        </p>
      </div>
      <div
        style={{ animationDelay: "4s" }}
        className="IntroText_headers animate__animated animate__backInLeft"
      >
        <p>I made this</p>
      </div>
      <div
        style={{ animationDelay: "5s" }}
        className="IntroText_headers animate__animated animate__backInLeft"
      >
        <p>to thank you</p>
      </div>
      <div
        style={{ animationDelay: "6s" }}
        className="IntroText_headers animate__animated animate__backInLeft"
      >
        <p>for the past</p>
      </div>
      <div
        style={{ animationDelay: "7s" }}
        className="IntroText_headers animate__animated animate__backInLeft"
      >
        <p>two years!</p>
      </div>

      {/* <div className="typewriter">
        <p>
          {typedText}
          <span className="cursor">&nbsp;</span>
        </p>
      </div> */}
    </div>
  );
};
