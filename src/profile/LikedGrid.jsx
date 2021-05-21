import React, { useState, useEffect } from "react";
import "./VideoGrid.css";
import PhotoLibraryIcon from "@material-ui/icons/PhotoLibrary";
import VideoLibraryIcon from "@material-ui/icons/VideoLibrary";

import axios from "../axios";

export const LikedGrid = ({
  likedVideoIds,
  handleChangeView,
  likedVideos,
  setLikedVideos,
}) => {
  useEffect(() => {
    const likedVideoIdsRemoveRepeats = [...new Set(likedVideoIds)];

    if (!(likedVideoIdsRemoveRepeats.length == likedVideos.length)) {
      let promiseArray = likedVideoIdsRemoveRepeats.map((videoId) =>
        axios.get("/v1/video/getByVideoId/" + videoId)
      );

      Promise.all(promiseArray).then((results) => {
        let data = results
          .map((el) => el.data[0])
          .filter((result) => result != undefined);
        setLikedVideos(data);
      });
    }
  }, [likedVideoIds]);
  const displayPreviewFile = (mediaType, url, coverImageUrl) => {
    if (mediaType === "video") {
      return (
        <div
          className="profile_bottom_grid_video"
          style={{ position: "relative" }}
        >
          <VideoLibraryIcon className="profile_bottom_imageOrVideoIcon" />
          <img className="profile_bottom_grid_video" src={coverImageUrl} />
        </div>
      );
    } else if (mediaType === "image") {
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

  if (likedVideos.length === 0) {
    return (
      <div className="Purchases_NoInfo">
        <p>Like away!</p>
      </div>
    );
  }
  return (
    <div className="profile_bottom_container">
      <div className="profile_bottom_grid">
        {likedVideos.map((eachVideo, i) => (
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
