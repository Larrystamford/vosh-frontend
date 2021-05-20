import React, { useState, useEffect } from "react";
import { useDidMountEffect } from "../customHooks/useDidMountEffect";

import "./VideoGrid.css";
import PhotoLibraryIcon from "@material-ui/icons/PhotoLibrary";
import VideoLibraryIcon from "@material-ui/icons/VideoLibrary";
import LocalMallIcon from "@material-ui/icons/LocalMall";

import { DisplayPreviewFile } from "./DisplayPreviewFile";
import { ProductImagesCarousel } from "../components/ProductImagesCarousel";
import { useHistory } from "react-router";

import OnImagesLoaded from "react-on-images-loaded";

export const VideoGrid = ({
  videos,
  showVideos,
  setShowVideos,
  handleChangeView,
  scrolledBottomCount,
  selectedCategoryId,
}) => {
  useEffect(() => {
    setShowVideos(videos.slice(0, 6));
  }, [selectedCategoryId]);

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

  const hasProductImages = (products) => {
    for (const product of products) {
      if (product.itemImage) {
        return true;
      }
    }
    return false;
  };

  return (
    <div className="profile_bottom_container">
      <div className="profile_bottom_grid">
        {showVideos.map((eachVideo, i) => (
          <div
            className="profile_bottom_grid_video"
            style={{ position: "relative" }}
          >
            {hasProductImages(eachVideo.affiliateProducts) ? (
              <ProductImagesCarousel
                affiliateProducts={eachVideo.affiliateProducts}
                className="profile_bottom_productImages"
              />
            ) : (
              <LocalMallIcon
                className="profile_bottom_imageOrVideoIcon"
                style={{
                  opacity: 0.9,
                  zIndex: 2000,
                }}
              />
            )}

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
