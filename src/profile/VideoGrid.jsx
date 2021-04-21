import React from "react";
import "./VideoGrid.css";
import PhotoLibraryIcon from "@material-ui/icons/PhotoLibrary";
import VideoLibraryIcon from "@material-ui/icons/VideoLibrary";

export const VideoGrid = ({ videos, handleChangeView }) => {
  const displayPreviewFile = (mediaType, url, coverImageUrl) => {
    if (mediaType == "video") {
      return (
        <div
          className="profile_bottom_grid_video"
          style={{ position: "relative" }}
        >
          <VideoLibraryIcon className="profile_bottom_imageOrVideoIcon" />
          <img className="profile_bottom_grid_video" src={coverImageUrl} />
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

  return (
    <div className="profile_bottom_container">
      <div className="profile_bottom_grid">
        {videos.map((eachVideo, i) => (
          <div
            className="profile_bottom_grid_container"
            onClick={() => handleChangeView(i)}
          >
            {displayPreviewFile(
              eachVideo.mediaType,
              eachVideo.url,
              eachVideo.coverImageUrl
            )}
          </div>
        ))}
      </div>
      <div style={{ height: "3rem" }}></div>
    </div>
  );
};
