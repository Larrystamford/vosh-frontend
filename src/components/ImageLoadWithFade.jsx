import React, { useState } from "react";
import OnImagesLoaded from "react-on-images-loaded";

export const ImageLoadWithFade = ({
  src,
  className,
  style,
  onClick,
  fadeIn,
}) => {
  const [showImage, setShowImage] = useState(false);

  return (
    <OnImagesLoaded
      onLoaded={() => setShowImage(true)}
      onTimeout={() => setShowImage(true)}
      timeout={7000}
    >
      <img
        style={{
          opacity: showImage && fadeIn ? 1 : 0,
          transition: "all 1s",
          ...style,
        }}
        className={className}
        src={src}
        onClick={onClick}
      />
    </OnImagesLoaded>
  );
};
