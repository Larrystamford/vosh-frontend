import React, { useState } from "react";
import "./VideoGrid.css";
import PhotoLibraryIcon from "@material-ui/icons/PhotoLibrary";
import VideoLibraryIcon from "@material-ui/icons/VideoLibrary";

import OnImagesLoaded from "react-on-images-loaded";

export const DisplayPreviewFile = ({
  mediaType,
  url,
  coverImageUrl,
  tiktokCoverImageUrl,
  onClick,
}) => {
  const [showImage, setShowImage] = useState(false);

  if (mediaType == "video") {
    return (
      <div
        className="profile_bottom_grid_video"
        style={{ position: "relative" }}
        onClick={onClick}
      >
        <OnImagesLoaded
          onLoaded={() => setShowImage(true)}
          onTimeout={() => setShowImage(true)}
          timeout={7000}
        >
          <img
            style={{
              opacity: showImage ? 1 : 0,
              transition: "all 1.3s",
              borderRadius: 10,
            }}
            className="profile_bottom_grid_video"
            src={tiktokCoverImageUrl ? tiktokCoverImageUrl : coverImageUrl}
          />
        </OnImagesLoaded>
      </div>
    );
  } else if (mediaType == "image") {
    return (
      <div
        className="profile_bottom_grid_video"
        style={{ position: "relative" }}
      >
        <PhotoLibraryIcon className="profile_bottom_imageOrVideoIcon" />
        <img className="profile_bottom_grid_video" src={url} />
      </div>
    );
  }
};
