import React, { useState, useEffect } from "react";
import "./SwipeUp.css";
import { useWindowSize } from "../customHooks/useWindowSize";

import TouchAppIcon from "@material-ui/icons/TouchApp";

export const SwipeUp = () => {
  const size = useWindowSize();
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    setTimeout(() => setShowAnimation(true), 3000);
  }, []);

  if (showAnimation && size.width < 1100) {
    return (
      <>
        <TouchAppIcon
          className="SwipeUpIcon animate__animated animate__zoomIn"
          fontSize="large"
          onAnimationEnd={() => setShowAnimation(false)}
        />
      </>
    );
  } else if (showAnimation && size.width > 1100) {
    return (
      <>
        <TouchAppIcon
          className="SwipeUpIcon animate__animated animate__zoomIn"
          fontSize="large"
          onAnimationEnd={() => setShowAnimation(false)}
        />
        <TouchAppIcon
          className="SwipeUpIcon2 animate__animated animate__zoomIn"
          fontSize="large"
          onAnimationEnd={() => setShowAnimation(false)}
        />
        <p className="SwipeUpIcon3 animate__animated animate__zoomIn">
          Scroll with Touch Pad
        </p>
      </>
    );
  } else {
    return null;
  }
};
