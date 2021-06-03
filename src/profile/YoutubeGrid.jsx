import React, { useState, useEffect, useCallback } from "react";
import { useDidMountEffect } from "../customHooks/useDidMountEffect";

import { ImageLoad } from "../components/ImageLoad";
import { ProductImagesCarousel } from "../components/ProductImagesCarousel";
import "./VideoGrid.css";
import { useHistory } from "react-router";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import ShopIcon from "@material-ui/icons/Shop";

import axios from "../axios";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const YoutubeGrid = ({
  youtubeVideos,
  size,
  proTheme,
  showYoutubeVideos,
  setShowYoutubeVideos,
  scrolledBottomCount,
}) => {
  const history = useHistory();

  useEffect(() => {
    setShowYoutubeVideos(youtubeVideos.slice(0, 3));
  }, []);

  const getHistoryFeed = (scrolledBottomCount) => {
    setShowYoutubeVideos((prevState) => [
      ...prevState,
      ...youtubeVideos.slice(
        scrolledBottomCount * 3,
        scrolledBottomCount * 3 + 3
      ),
    ]);
  };

  useDidMountEffect(() => {
    if (scrolledBottomCount != 0) {
      getHistoryFeed(scrolledBottomCount);
    }
  }, [scrolledBottomCount]);

  // if (videos.length === 0) {
  //   return (
  //     <div className="Purchases_NoInfo">
  //       <div
  //         className="Video_Grid_redirect_button"
  //         onClick={() => {
  //           history.push("/ContentTagging");
  //         }}
  //       >
  //         <p>Import & Tag Your TikToks</p>
  //       </div>
  //     </div>
  //   );
  // }

  const [header, setHeader] = React.useState("");
  const [reading, setReading] = React.useState("");

  const [open, setOpen] = React.useState(false);
  const handleClickOpen = (name, desc) => {
    setHeader(name);
    setReading(desc);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const [clickedAffiliateGroupName, setClickedAffiliateGroupName] =
    useState("");
  const [clickedAffiliateProducts, setClickedAffiliateProducts] = useState([]);

  const [openAffiliate, setOpenAffiliate] = useState(false);
  // affiliate
  const handleAffiliateOpen = () => {
    setOpenAffiliate(true);
    window.history.pushState(
      {
        affiliate: "affiliate",
      },
      "",
      ""
    );
  };
  const handleAffiliateClose = () => {
    window.history.back();
  };
  const handleAffiliatePop = useCallback(() => {
    setOpenAffiliate(false);
  }, []);
  useEffect(() => {
    window.addEventListener("popstate", handleAffiliatePop);
    // cleanup this component
    return () => {
      window.removeEventListener("popstate", handleAffiliatePop);
    };
  }, []);

  return (
    <div className="profile_bottom_container">
      {showYoutubeVideos.map((eachVideo) => (
        <div className="profile_bottom_container_youtube_row_frame">
          <div
            className="profile_bottom_container_youtube_row"
            style={{ height: size.width / 2 }}
          >
            <iframe
              width={size.width - 40}
              height={size.width / 2}
              allowfullscreen={true}
              frameborder="0"
              src={"https://www.youtube.com/embed/" + eachVideo.videoId}
            ></iframe>
          </div>
          {eachVideo.affiliateProducts.length > 0 && (
            <div
              className="profile_bottom_container_youtube_row_items"
              style={{ position: "absolute", bottom: 0 }}
            >
              <div className="profile_bottom_container_youtube_row_item">
                <div className="videoFooter_icon_and_name">
                  <ShopIcon
                    style={{
                      opacity: 1,
                      fontSize: 30,
                      color: "white",
                    }}
                    onClick={() => {
                      setClickedAffiliateGroupName(
                        eachVideo.affiliateGroupName
                      );
                      setClickedAffiliateProducts(eachVideo.affiliateProducts);
                      handleAffiliateOpen();
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      ))}

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

      {openAffiliate && (
        <Dialog
          onClose={handleAffiliateClose}
          aria-labelledby="simple-dialog-title"
          open={openAffiliate}
          style={{
            zIndex: 10001,
          }}
        >
          <div
            style={{
              backgroundImage: `url(${proTheme.background1})`,
              minWidth: "16rem",
              height: "60%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            <h3
              id="simple-dialog-title"
              style={{ color: proTheme.linkBoxColor, margin: "1.3rem" }}
            >
              {clickedAffiliateGroupName}
            </h3>
            <div
              style={{
                width: "90%",
                overflowY: "scroll",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                paddingBottom: "1rem",
              }}
            >
              {clickedAffiliateProducts.map((product) => (
                <div
                  className="sidebar_amazonlogolink"
                  style={{ backgroundColor: proTheme.linkBoxColor }}
                  onClick={() => {
                    window.open(product.itemLink, "_blank");
                    axios.post("/v1/metrics/incrementMetrics", {
                      id: localStorage.getItem("USER_ID"),
                      unqiueIdentifier: product.id,
                    });

                    return false;
                  }}
                  key={product.itemLinkName}
                >
                  {product.itemImage ? (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        width: "95%",
                      }}
                    >
                      <ImageLoad
                        src={product.itemImage}
                        className="SlidingEdit_TypeLeft_Image_Placeholder"
                        style={{ margin: "5px 20px 5px 10px" }}
                      />

                      <p
                        style={{
                          color: proTheme.linkWordsColor,
                        }}
                      >
                        {product.itemLinkName}
                      </p>
                    </div>
                  ) : (
                    <p
                      style={{
                        color: proTheme.linkWordsColor,
                      }}
                    >
                      {product.itemLinkName}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
};
