import React, { useState, useEffect, useCallback } from "react";
import "./VideoFooter.css";
import { useGlobalState } from "../GlobalStates";
import { Link } from "react-router-dom";
import { useHistory } from "react-router";
import Ticker from "react-ticker";

import { Buy } from "./Buy";
import { SlidingSetUp } from "../login/SlidingSetUp";

import ShoppingCartOutlinedIcon from "@material-ui/icons/ShoppingCartOutlined";
import VideocamIcon from "@material-ui/icons/Videocam";

import { Event } from "../components/tracking/Tracker";
import { useDidMountEffect } from "../customHooks/useDidMountEffect";

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

  return (
    <div className="videoFooter">
      <h4 className="videoFooter_username" onClick={handleUsernameClicked}>
        @{userName}
      </h4>

      <div className="videoFooter_multiline">
        <p>{caption}</p>
      </div>
      <div className="videoFooter_creator">
        <VideocamIcon fontSize="small" style={{ paddingRight: 5 }} />
        <Ticker mode="smooth" speed={2}>
          {({ index }) => (
            <>
              {originalCreator ? (
                <span style={{ whiteSpace: "nowrap", paddingRight: 30 }}>
                  original creator - @ {originalCreator}
                </span>
              ) : (
                <span style={{ whiteSpace: "nowrap", paddingRight: 30 }}>
                  original creator - @ Unknown
                </span>
              )}
            </>
          )}
        </Ticker>
      </div>

      <SlidingSetUp open={checked} handleClose={handleSetUpClose} />
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