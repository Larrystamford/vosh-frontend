import React, { useState, useEffect, useRef } from "react";
import "./VideoGrid.css";
import { useDidMountEffect } from "../customHooks/useDidMountEffect";

import PhotoLibraryIcon from "@material-ui/icons/PhotoLibrary";
import VideoLibraryIcon from "@material-ui/icons/VideoLibrary";
import CircularProgress from "@material-ui/core/CircularProgress";

import axios from "../axios";

export const HistoryGrid = ({
  userId,
  handleChangeView,
  seenVideos,
  setSeenVideos,
  scrolledBottomCount,
  historyRef,
}) => {
  const [isFetching, setIsFetching] = useState(false);

  const getHistoryFeed = async () => {
    const response = await axios.get("/v1/feed/getHistoryFeed/", {
      params: { userId: userId, skip: historyRef.current.skip },
    });

    if (response.data.videos.length > 0) {
      historyRef.current.skip = response.data.count;
      setSeenVideos((prevState) => [...prevState, ...response.data.videos]);
    } else {
      historyRef.current.end = true;
    }

    setIsFetching(false);
  };

  useEffect(() => {
    if (seenVideos.length == 0) {
      setIsFetching(true);
      getHistoryFeed();
    }
  }, []);

  useDidMountEffect(() => {
    if (historyRef.current.end == false) {
      setIsFetching(true);
      getHistoryFeed();
    }
  }, [scrolledBottomCount]);

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

  if (seenVideos.length == 0) {
    return (
      <div className="Purchases_NoInfo">
        <p>
          To keep things fresh, we won't show you the same video twice. But
          worry not, your watch history shows up here!
        </p>

        {isFetching ? (
          <CircularProgress
            style={{
              position: "absolute",
              bottom: "3.4rem",
              color: "#ff8b00",
            }}
          />
        ) : null}
      </div>
    );
  }

  return (
    <div className="profile_bottom_container">
      <div className="profile_bottom_grid_history">
        {seenVideos.map((eachVideo, i) => (
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

      {isFetching ? (
        <CircularProgress
          style={{
            position: "absolute",
            bottom: "3.4rem",
            color: "#ff8b00",
          }}
        />
      ) : null}
    </div>
  );
};
