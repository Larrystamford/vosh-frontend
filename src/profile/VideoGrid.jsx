import React, { useEffect } from "react";
import { useDidMountEffect } from "../customHooks/useDidMountEffect";

import "./VideoGrid.css";
import LocalMallIcon from "@material-ui/icons/LocalMall";

import { DisplayPreviewFile } from "./DisplayPreviewFile";
import { useHistory } from "react-router";

export const VideoGrid = ({
  videos,
  showVideos,
  setShowVideos,
  handleChangeView,
  scrolledBottomCount,
  selectedCategoryId,
}) => {
  useEffect(() => {
    setShowVideos(videos.slice(0, 9));
  }, [selectedCategoryId]);

  const getHistoryFeed = (scrolledBottomCount) => {
    setShowVideos((prevState) => [
      ...prevState,
      ...videos.slice(scrolledBottomCount * 9, scrolledBottomCount * 9 + 9),
    ]);
  };

  useDidMountEffect(() => {
    if (scrolledBottomCount != 0) {
      getHistoryFeed(scrolledBottomCount);
    }
  }, [scrolledBottomCount]);

  const history = useHistory();
  if (videos.length === 0) {
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
                zIndex: 2000,
              }}
            />

            <DisplayPreviewFile
              mediaType={eachVideo.mediaType}
              url={eachVideo.url}
              coverImageUrl={eachVideo.coverImageUrl}
              tiktokCoverImageUrl={eachVideo.tiktokCoverImageUrl}
              onClick={() => handleChangeView(i)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
