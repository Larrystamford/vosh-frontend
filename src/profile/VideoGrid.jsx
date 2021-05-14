import React, { useRef, useEffect } from "react";
import { useDidMountEffect } from "../customHooks/useDidMountEffect";

import "./VideoGrid.css";
import PhotoLibraryIcon from "@material-ui/icons/PhotoLibrary";
import VideoLibraryIcon from "@material-ui/icons/VideoLibrary";
import LocalMallIcon from "@material-ui/icons/LocalMall";

import { DisplayPreviewFile } from "./DisplayPreviewFile";
import { useHistory } from "react-router";

import OnImagesLoaded from "react-on-images-loaded";

export const VideoGrid = ({
  videos,
  showVideos,
  setShowVideos,
  handleChangeView,
  scrolledBottomCount,
  selectedCategoryName,
}) => {
  useEffect(() => {
    setShowVideos(videos.slice(0, 6));
  }, [selectedCategoryName]);

  console.log(scrolledBottomCount);

  const getHistoryFeed = (scrolledBottomCount) => {
    setShowVideos((prevState) => [
      ...prevState,
      ...videos.slice(scrolledBottomCount * 6, scrolledBottomCount * 6 + 6),
    ]);
  };

  useDidMountEffect(() => {
    if (scrolledBottomCount != 0) {
      getHistoryFeed(scrolledBottomCount);
    }
  }, [scrolledBottomCount]);

  const history = useHistory();
  if (videos.length == 0) {
    return (
      <div className="Purchases_NoInfo">
        <div
          className="Video_Grid_redirect_button"
          onClick={() => {
            history.push("/ContentTagging");
          }}
        >
          <p>Import & Tag Your TikToks</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile_bottom_container">
      <div className="profile_bottom_grid">
        {showVideos.map((eachVideo, i) => (
          <div
            className="profile_bottom_grid_video"
            style={{ position: "relative" }}
          >
            <LocalMallIcon
              className="profile_bottom_imageOrVideoIcon"
              style={{
                opacity: 0.9,
                zIndex: 10000,
              }}
            />
            <DisplayPreviewFile
              mediaType={eachVideo.mediaType}
              url={eachVideo.url}
              coverImageUrl={eachVideo.coverImageUrl}
              onClick={() => handleChangeView(i)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
