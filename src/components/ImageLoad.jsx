import React, { useState } from "react";
import OnImagesLoaded from "react-on-images-loaded";

export const ImageLoad = ({ src, className, style, onClick }) => {
  const [showImage, setShowImage] = useState(false);

  return (
    <OnImagesLoaded
      onLoaded={() => setShowImage(true)}
      onTimeout={() => setShowImage(true)}
      timeout={7000}
    >
      <img
        style={{
          opacity: showImage ? 1 : 0,
          transition: "all 1.3s",
          ...style,
        }}
        className={className}
        src={src}
        onClick={onClick}
      />
    </OnImagesLoaded>
  );
};
