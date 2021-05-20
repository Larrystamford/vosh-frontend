import React, { useState, useEffect, useCallback } from "react";
import "./VideoFooter.css";
import { useGlobalState } from "../GlobalStates";
import { Link } from "react-router-dom";
import { useHistory } from "react-router";
import Ticker from "react-ticker";

import { ImageLoad } from "../components/ImageLoad";
import { ProductImagesCarousel } from "../components/ProductImagesCarousel";

import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";

import { Buy } from "./Buy";
import { StaySlidingSetUp } from "../login/StaySlidingSetUp";

import VideocamIcon from "@material-ui/icons/Videocam";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";

import { Event } from "../components/tracking/Tracker";
import LocalMallIcon from "@material-ui/icons/LocalMall";

import axios from "../axios";

function VideoFooter({
  id,
  userName,
  caption,
  items,
  averagePrice,
  bigButton,
  categories,
  sellerId,
  amazons,
  amazonOrInternal,
  selectCategory,
  productImages,
  buyOpen,
  setBuyOpen,
  openSlider,
  setOpenSlider,
  originalCreator,
  proCategories,
  affiliateGroupName,
  affiliateProducts,
  onVideoClick,
  onVideoTouch,
  proTheme,
  smallShopLink,
  userId,
  location,
}) {
  const [sliderGlobal, setSliderGlobal] = useState(false);

  const [globalModalOpened, setGlobalModalOpened] = useGlobalState(
    "globalModalOpened"
  );
  const history = useHistory();

  const handleBuyPop = useCallback(() => {
    // setGlobalModalOpened(false);
    setChecked(false);
    setBuyOpen(false);
  }, []);

  useEffect(() => {
    if (sliderGlobal) {
      window.removeEventListener("popstate", handleBuyPop);
    } else {
      window.addEventListener("popstate", handleBuyPop);
    }

    // cleanup this component
    return () => {
      window.removeEventListener("popstate", handleBuyPop);
    };
  }, [sliderGlobal]);

  const [checked, setChecked] = useState(false);
  const handleSetUpOpen = () => {
    localStorage.setItem("LOGIN_VIDEO_ID", id);

    setChecked(true);
    window.history.pushState(
      {
        foo: "bar",
      },
      "",
      ""
    );
  };
  const handleSetUpClose = () => {
    setChecked(false);
  };

  const handleBuyOpen = () => {
    setGlobalModalOpened(true);
    setBuyOpen(true);
    window.history.pushState(
      {
        foo: "bar",
      },
      "",
      ""
    );
    Event(
      "ecommerce",
      "Clicked the cart button for videoId: " + id,
      "Cart Button"
    );
  };
  const handleBuyClose = () => {
    window.history.back();
  };

  const handleUsernameClicked = () => {
    if (window.location.pathname.indexOf(userName) < 0) {
      history.push({
        pathname: `/profile/${userName}`,
      });
    }
  };

  const [openAffiliate, setOpenAffiliate] = useState(false);

  // affiliate
  const handleAffiliateOpen = () => {
    setOpenAffiliate(true);
    setGlobalModalOpened(true);
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

  const hasProductImages = (products) => {
    for (const product of products) {
      if (product.itemImage) {
        return true;
      }
    }
    return false;
  };

  return (
    <div
      className="videoFooter"
      onClick={onVideoClick}
      onTouchStart={onVideoTouch}
    >
      <div
        className="videoFooter__button"
        style={bigButton ? { minWidth: "70px" } : null}
        onClick={handleAffiliateOpen}
      >
        <div className="videoFooter_icon_and_name">
          {hasProductImages(affiliateProducts) ? (
            <ProductImagesCarousel
              affiliateProducts={affiliateProducts}
              className="profile_bottom_productImages_video"
            />
          ) : (
            <LocalMallIcon
              style={{
                opacity: 1,
                fontSize: 17,
                color: "orange",
              }}
            />
          )}
        </div>

        {bigButton ? (
          <p
            className="videoFooter__button_temp_words"
            style={{ opacity: 0.9 }}
          >
            LINKS
          </p>
        ) : null}
      </div>

      <h5
        className="videoFooter_username"
        onClick={() => {
          if (!(location == "main feed")) {
            history.push({
              pathname: `/${userName}`,
              state: {
                showBoughtItems: true,
              },
            });
          }
        }}
      >
        @{userName}
      </h5>

      <div className="videoFooter_multiline">
        <p>{caption}</p>
      </div>
      <div className="videoFooter_creator">
        <VideocamIcon fontSize="small" style={{ paddingRight: 5 }} />
        <Ticker mode="smooth" speed={2}>
          {({ index }) => (
            <div>
              {originalCreator ? (
                <span style={{ whiteSpace: "nowrap", paddingRight: 30 }}>
                  original creator - @ {originalCreator}
                </span>
              ) : (
                <span style={{ whiteSpace: "nowrap", paddingRight: 30 }}>
                  original creator - @ Unknown
                </span>
              )}
            </div>
          )}
        </Ticker>
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
            style={
              affiliateGroupName
                ? {
                    backgroundImage: `url(${proTheme.background2})`,
                    minWidth: "16rem",
                    height: "60%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "flex-start",
                  }
                : {
                    backgroundColor: "white",
                    minWidth: "16rem",
                    height: "60%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "flex-start",
                  }
            }
          >
            <h3
              id="simple-dialog-title"
              style={
                affiliateGroupName
                  ? { color: proTheme.linkBoxColor, margin: "1.3rem" }
                  : { color: "teal", margin: "1.3rem" }
              }
            >
              {affiliateGroupName ? affiliateGroupName : "Products"}
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
              {affiliateGroupName
                ? affiliateProducts.map((product) => (
                    <div
                      className="sidebar_amazonlogolink"
                      style={
                        proTheme.linkBoxColor
                          ? { backgroundColor: proTheme.linkBoxColor }
                          : { backgroundColor: "teal" }
                      }
                      onClick={() => {
                        onVideoClick();
                        window.open(product.itemLink, "_blank");
                        axios.post("/v1/metrics/incrementMetrics", {
                          id: userId,
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
                              minWidth: "70%",
                            }}
                          >
                            {product.itemLinkName}
                          </p>
                        </div>
                      ) : (
                        <p>{product.itemLinkName}</p>
                      )}
                    </div>
                  ))
                : amazons.map((amazon) => (
                    <div
                      className="sidebar_amazonlogolink"
                      style={{ backgroundColor: "teal" }}
                      onClick={() => {
                        onVideoClick();
                        window.open(amazon.amazon_link, "_blank");
                        return false;
                      }}
                      key={amazon.amazon_name}
                    >
                      <p>{amazon.amazon_name}</p>
                    </div>
                  ))}

              {smallShopLink && (
                <div
                  className="sidebar_amazonlogolink"
                  style={{ backgroundColor: "teal" }}
                  onClick={() => {
                    onVideoClick();
                    window.open(smallShopLink, "_blank");
                    return false;
                  }}
                  key={smallShopLink}
                >
                  <p>{smallShopLink}</p>
                </div>
              )}
            </div>
          </div>
        </Dialog>
      )}

      <StaySlidingSetUp open={checked} handleClose={handleSetUpClose} />
    </div>
  );
}

export default VideoFooter;

// these are for showing the shopping cart button
// {amazonOrInternal == "both" || amazonOrInternal == "internal" ? (
//   <div
//     className="videoFooter__button"
//     style={bigButton ? { minWidth: "70px" } : null}
//     onClick={handleBuyOpen}
//   >
//     <div className="videoFooter_icon_and_name">
//       <ShoppingCartOutlinedIcon
//         style={{ color: "#222222" }}
//         fontSize="default"
//       />

//       {/* <ShoppingCartOutlinedIcon color="primary" fontSize="default" /> */}
//     </div>

//     {bigButton ? (
//       // <p className="videoFooter__button_temp_words">{categories[0]}</p>
//       <p className="videoFooter__button_temp_words">Buy</p>
//     ) : null}
//   </div>
// ) : (
//   <div className="videoFooter__button_fake"></div>
// )}

// {(amazonOrInternal == "both" || amazonOrInternal == "internal") && (
//   <Buy
//     buyOpen={buyOpen}
//     handleClose={handleBuyClose}
//     id={id}
//     items={items}
//     averagePrice={averagePrice}
//     setBuyOpen={setBuyOpen}
//     sellerId={sellerId}
//     handleSetUpOpen={handleSetUpOpen}
//     selectCategory={selectCategory}
//     productImages={productImages}
//     setSliderGlobal={setSliderGlobal}
//     openSlider={openSlider}
//     setOpenSlider={setOpenSlider}
//   />
// )}
