import React, { useState, useEffect, useCallback } from "react";
import "./VideoFooter.css";
import { useGlobalState } from "../GlobalStates";
import { Link } from "react-router-dom";
import { useHistory } from "react-router";
import Ticker from "react-ticker";

import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";

import { Buy } from "./Buy";
import { StaySlidingSetUp } from "../login/StaySlidingSetUp";

import VideocamIcon from "@material-ui/icons/Videocam";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";

import { Event } from "../components/tracking/Tracker";
import LocalMallIcon from "@material-ui/icons/LocalMall";

function VideoFooter({
  id,
  userName,
  caption,
  items,
  averagePrice,
  bigButton,
  categories,
  sellerId,
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
  proTheme,
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

  // {affiliateGroupName && (
  //   <div className="videoSidebar__button">
  //     <LoyaltyIcon
  //       fontSize="default"
  //       style={{ color: "white" }}
  //       onClick={handleAffiliateOpen}
  //     />
  //   </div>
  // )}

  return (
    <div className="videoFooter">
      <div
        className="videoFooter__button"
        style={bigButton ? { minWidth: "70px" } : null}
        onClick={handleAffiliateOpen}
      >
        <div className="videoFooter_icon_and_name">
          <LocalMallIcon
            style={{
              opacity: 1,
              fontSize: 17,
              color: "orange",
            }}
          />

          {/* <ShoppingCartOutlinedIcon color="primary" fontSize="default" /> */}
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

      <h5 className="videoFooter_username">@{userName}</h5>

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
          <div style={{ backgroundImage: `url(${proTheme.background2})` }}>
            <DialogTitle
              id="simple-dialog-title"
              style={{ color: proTheme.linkBoxColor }}
            >
              {affiliateGroupName}
            </DialogTitle>
            <List style={{ overflowY: "scroll", maxHeight: "14rem" }}>
              {affiliateProducts.map((products) => (
                <ListItem
                  onClick={() => {
                    onVideoClick();
                    window.open(products.itemLink, "_blank");
                    return false;
                  }}
                  key={products.itemLinkName}
                  style={{ minWidth: "19rem" }}
                >
                  <div
                    className="sidebar_amazonlogolink"
                    style={{ backgroundColor: proTheme.linkBoxColor }}
                  >
                    <p>{products.itemLinkName}</p>
                  </div>
                </ListItem>
              ))}
            </List>
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
