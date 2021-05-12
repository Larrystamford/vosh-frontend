import React from "react";
import "./VideoGrid.css";
import PhotoLibraryIcon from "@material-ui/icons/PhotoLibrary";
import VideoLibraryIcon from "@material-ui/icons/VideoLibrary";
import { DisplayPreviewFile } from "./DisplayPreviewFile";
import { useHistory } from "react-router";

import OnImagesLoaded from "react-on-images-loaded";

export const VideoGrid = ({ videos, handleChangeView }) => {
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
        {videos.map((eachVideo, i) => (
          <DisplayPreviewFile
            mediaType={eachVideo.mediaType}
            url={eachVideo.url}
            coverImageUrl={eachVideo.coverImageUrl}
            onClick={() => handleChangeView(i)}
          />
        ))}
      </div>
      <div style={{ height: "3rem" }}></div>
    </div>
  );
};
