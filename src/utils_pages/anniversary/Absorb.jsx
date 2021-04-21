import React, { useEffect, useState } from "react";
import "./IntroText.css";

import FavoriteIcon from "@material-ui/icons/Favorite";

export const Absorb = () => {
  const allHearts = [];
  const colors = [
    "red",
    "pink",
    "aliceblue",
    "aqua",
    "Aquamarine",
    "cyan",
    "purple",
  ];
  let i;
  for (i = 0; i < 300; i++) {
    let heart = {};
    let colorIndex = Math.floor(Math.random() * 7);
    heart.color = colors[colorIndex];

    let randomMargin1 = Math.random() * 800;
    let randomMargin2 = Math.random() * 800;
    let randomMargin3 = Math.random() * 800;
    let randomMargin4 = Math.random() * 800;
    heart.marginLeft = randomMargin1;
    heart.marginRight = randomMargin2;
    heart.marginUp = randomMargin3;
    heart.marginDown = randomMargin4;

    const animations = [
      "animate__fadeInRightBig",
      "animate__fadeInUpBig",
      "animate__fadeInDownBig",
      "animate__fadeInLeftBig",
      "animate__backInDown",
      "animate__backInLeft",
      "animate__backInRight",
      "animate__backInUp",
      "animate__bounceIn",
      "animate__rotateInDownRight",
      "animate__zoomInLeft",
      "animate__zoomInRight",
      "animate__zoomInDown",
      "animate__zoomInUp",
    ];

    let animatonIndex = Math.floor(Math.random() * 13);
    heart.animation = animations[animatonIndex];

    heart.duration = Math.random() * 8 + 1 + "s";
    allHearts.push(heart);
  }

  return (
    <div className="CenterAbsoluteHearts">
      {allHearts.map(
        ({
          color,
          marginLeft,
          marginRight,
          marginUp,
          marginDown,
          animation,
          duration,
          animationOut,
        }) => (
          <FavoriteIcon
            className={"CenterAbsoluteItems " + animation}
            style={{
              color: color,
              transform: "rotate(60deg)",
              marginTop: marginUp,
              marginBottom: marginDown,
              marginRight: marginRight,
              marginLeft: marginLeft,
              animationDuration: duration,
            }}
          />
        )
      )}
      {allHearts.map(
        ({
          color,
          marginLeft,
          marginRight,
          marginUp,
          marginDown,
          animation,
          duration,
        }) => (
          <FavoriteIcon
            className={"CenterAbsoluteItems " + animation}
            style={{
              color: color,
              transform: "rotate(300deg)",
              marginTop: marginUp,
              marginBottom: marginDown,
              marginRight: marginRight,
              marginLeft: marginLeft,
              animationDuration: duration,
            }}
          />
        )
      )}
      {allHearts.map(
        ({
          color,
          marginLeft,
          marginRight,
          marginUp,
          marginDown,
          animation,
          duration,
        }) => (
          <FavoriteIcon
            className={"CenterAbsoluteItems " + animation}
            style={{
              color: color,
              marginTop: marginUp,
              marginBottom: marginDown,
              marginRight: marginRight,
              marginLeft: marginLeft,
              animationDuration: duration,
            }}
          />
        )
      )}
    </div>
  );
};
