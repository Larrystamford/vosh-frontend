import React, { useEffect } from "react";
import { useDidMountEffect } from "../customHooks/useDidMountEffect";

import "./VideoGrid.css";
import ShopIcon from "@material-ui/icons/Shop";

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
          <p>Import & Tag Your Content</p>
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
            <ShopIcon
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

      <div
        className="pro_profile_icon_and_name profile_bottom_container_logo"
        onClick={() => {
          history.push("/getStarted");
        }}
      >
        <p style={{ color: "white", fontSize: "14px" }}>Vosh</p>
        <img
          src="https://dciv99su0d7r5.cloudfront.net/ShopLocoLoco+Small+Symbol+White.png"
          style={{ height: "16px" }}
        />
      </div>
    </div>
  );
};
