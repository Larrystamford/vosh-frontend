import React, { useState, useEffect, useCallback, useRef } from "react";
import "./Profile.css";
import { useGlobalState } from "../GlobalStates";
import { useBottomScrollListener } from "react-bottom-scroll-listener";

import { useHistory } from "react-router";

import { PushNotificationPrompt } from "../notifications/PushNotificationPrompt";

import { VideoGrid } from "./VideoGrid";
import { LikedGrid } from "./LikedGrid";
import { HistoryGrid } from "./HistoryGrid";

import { CaptionEdit } from "./CaptionEdit";
import { Purchases } from "./Purchases";
import { Sell } from "./Sell";
import { Settings } from "./Settings";
import { StaySlidingSetUp } from "../login/StaySlidingSetUp";

import { ProfileFeed } from "../feed/ProfileFeed";

import { InstantPWA } from "../components/pwa/InstantPWA";
import { InstantPurchaseSuccess } from "../components/pwa/InstantPurchaseSuccess";
import { InstantGoSecondBrowser } from "../components/pwa/InstantGoSecondBrowser";

import FavoriteBorderOutlinedIcon from "@material-ui/icons/FavoriteBorderOutlined";

import ArrowDropDownOutlinedIcon from "@material-ui/icons/ArrowDropDownOutlined";
import WallpaperOutlinedIcon from "@material-ui/icons/WallpaperOutlined";
import ArchiveOutlinedIcon from "@material-ui/icons/ArchiveOutlined";
import CreateOutlinedIcon from "@material-ui/icons/CreateOutlined";
import HistoryIcon from "@material-ui/icons/History";
import CreateIcon from "@material-ui/icons/Create";
import AllInclusiveIcon from "@material-ui/icons/AllInclusive";

import axios from "../axios";

import ReactGA from "react-ga";
import { PageView, ModalView } from "../components/tracking/Tracker";
import { useDidMountEffect } from "../customHooks/useDidMountEffect";
import ReactPixel from "react-facebook-pixel";

export const PersonalProfile = (props) => {
  const history = useHistory();

  const [scrolledBottomCount, setScrolledBottomCount] = useState(0);
  const scrollRef = useBottomScrollListener(() => {
    setScrolledBottomCount(scrolledBottomCount + 1);
  });

  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [globalModalOpened, setGlobalModalOpened] = useGlobalState(
    "globalModalOpened"
  );

  const [rerender, setRerender] = useGlobalState("rerender");
  const [notifPrompt, setNotifPrompt] = useState(false);
  const [promptType, setPromptType] = useState("");

  const [userInfo, setUserInfo] = useGlobalState("hasUserInfo");

  const [gridView, setGridView] = useState(false);
  const [boughtItemsView, setBoughtItemsView] = useState(false);
  const [sellItemsView, setSellItemsView] = useState(false);
  const [likedItemsView, setLikedItemsView] = useState(true);
  const [historyView, setHistoryView] = useState(false);

  const [username, setUsername] = useState("");
  const [image, setImage] = useState("");
  const [followers, setFollowers] = useState([]);
  const [followings, setFollowings] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [likedVideoIds, setLikedVideoIds] = useState([]);
  const [sales, setSales] = useState([]);

  const [videos, setVideos] = useState([]);
  const [likedVideos, setLikedVideos] = useState([]);
  const [seenVideos, setSeenVideos] = useState([]);

  const [profileBio, setProfileBio] = useState("");

  const [scrollView, setScrollView] = useState(false);
  const [viewIndex, setViewIndex] = useState(0);

  const [showPWA, setShowPWA] = useState(false);
  const [showPurchaseSuccess, setShowPurchaseSuccess] = useState(false);

  const [openGoBrowser, setOpenGoBrowser] = useState(false);

  const historyRef = useRef({
    skip: null,
    end: false,
  });

  const [checked, setChecked] = useState(true);
  const handleSetUpOpen = () => {
    setChecked(true);
  };
  const handleSetUpClose = () => {
    setChecked(false);
  };

  useEffect(() => {
    // REDIRECT LOGIN
    let id_token, local_token;
    (async () => {
      const url = new URLSearchParams(window.location.href);
      id_token = url.get("id_token");

      if (props.location.state && props.location.state.setUpProfile) {
        local_token = true;
      }

      let res;
      if (id_token || local_token) {
        if (id_token) {
          res = await axios.post("/v1/users/oauth/googleIdToken", {
            id_token: id_token,
          });

          ReactPixel.track("CompleteRegistration", {
            content_name: "google sign up",
          });
        } else if (local_token) {
          res = await axios.post("/v1/users/oauth/localRedirect", {
            user_id: localStorage.getItem("USER_ID"),
          });

          ReactPixel.track("CompleteRegistration", {
            content_name: "local sign up",
          });
        }

        if (sessionStorage.getItem("profileRefreshed") != "true") {
          setRerender((prev) => !prev);
          sessionStorage.setItem("profileRefreshed", "true");
          return;
        }

        // add login video to liked
        if (localStorage.getItem("LOGIN_VIDEO_ID")) {
          await axios.put("/v1/users/pushUserFavourites/" + res.data.userId, {
            videoId: localStorage.getItem("LOGIN_VIDEO_ID"),
          });
        }
        // add to watched
        if (localStorage.getItem("BEFORE_LOGIN_VIDEO_IDS")) {
          let beforeLoginVideoIds = localStorage.getItem(
            "BEFORE_LOGIN_VIDEO_IDS"
          );
          beforeLoginVideoIds = new Set(beforeLoginVideoIds.split(","));

          for (const eachVideoId of beforeLoginVideoIds) {
            await axios.put("/v1/users/pushVideoSeen/" + res.data.userId, {
              videoId: eachVideoId,
              category: "Before Login Stuff",
            });
          }
        }

        // add in login stuff
        localStorage.setItem("USER_ID", res.data.userId);
        localStorage.setItem("USER_NAME", res.data.userName);
        localStorage.setItem("PICTURE", res.data.picture);
        localStorage.setItem("JWT_TOKEN", res.data.token);
        axios.defaults.headers.common["Authorization"] = res.data.token;

        // set address if have else tell feed that user is logged in
        axios
          .get("/v1/users/getUserInfo/" + res.data.userId)
          .then((res) => {
            // account does not exist
            if (res.data.length == 0) {
              localStorage.removeItem("JWT_TOKEN");
              localStorage.removeItem("PICTURE");
              localStorage.removeItem("USER_ID");
              localStorage.removeItem("USER_NAME");
              setUserInfo(false);
            } else {
              setUserInfo(res.data[0]);

              // remove before login stuff
              localStorage.removeItem("LOGIN_VIDEO_ID");
              localStorage.removeItem("BEFORE_LOGIN_VIDEO_IDS");
            }
          })
          .catch((err) => {
            console.log(err + "failed to get user address on app load");
          });

        axios.get("/v1/users/get/" + res.data.userId).then((response) => {
          let data = response.data[0];

          setLikedVideoIds(data.likedVideos.reverse());
          setImage(data.picture);
          setFollowings(data.followings);
          setFollowers(data.followers);
          setPurchases(data.purchases.reverse());
          setSales(data.sales.reverse());
          setVideos(data.videos.reverse());
          setUsername(data.userName);
          setProfileBio(data.profileBio);
          setNotifPrompt(true);
          setPromptType("login");
        });

        setOpenGoBrowser(true);

        ReactGA.set({
          userId: res.data.userId,
        });
      }
    })();

    // INFO OF LOGGED IN USER
    const userId = localStorage.getItem("USER_ID");
    if (userId) {
      axios.get("/v1/users/get/" + userId).then((response) => {
        let data = response.data[0];

        if (data.accountType == "pro") {
          history.push({
            pathname: "/ProProfile",
          });
        }
        let likedVideosRemoveRepeats = data.likedVideos;
        likedVideosRemoveRepeats = [...new Set(likedVideosRemoveRepeats)];

        setLikedVideoIds(likedVideosRemoveRepeats.reverse());
        setImage(data.picture);
        setFollowings(data.followings);
        setFollowers(data.followers);
        setPurchases(data.purchases.reverse());
        setSales(data.sales.reverse());
        setVideos(data.videos.reverse());
        setUsername(data.userName);
        setProfileBio(data.profileBio);
      });
    } else if (!id_token) {
      setIsLoggedIn(false);
    }

    if (props.location.state && props.location.state.showBoughtItems) {
      const isInStandaloneiOS = window.navigator.standalone === true;
      const isInStandaloneAndriod = window.matchMedia(
        "(display-mode: standalone)"
      ).matches;

      setShowPurchaseSuccess(true);

      if (!isInStandaloneiOS || !isInStandaloneAndriod) {
        console.log("show pwa");
        setShowPWA(true);
      }

      setBoughtItemsView(true);
      setSellItemsView(false);
      setLikedItemsView(false);
      setGridView(false);
    }

    if (props.location.state && props.location.state.openPurchases) {
      setBoughtItemsView(true);
      setLikedItemsView(false);
      setGridView(false);
    }

    PageView();
  }, [checked]);

  const handleChangeView = (i) => {
    if (scrollView) {
      window.history.back();
    } else {
      window.history.pushState(
        {
          scrollView: "scrollView",
        },
        "",
        ""
      );
    }
    setScrollView(!scrollView);
    setViewIndex(i);
  };

  const handleScrollViewPop = useCallback(() => {
    setScrollView(false);
  }, []);

  useEffect(() => {
    if (globalModalOpened) {
      window.removeEventListener("popstate", handleScrollViewPop);
    } else {
      window.addEventListener("popstate", handleScrollViewPop);
    }

    // cleanup this component
    return () => {
      window.removeEventListener("popstate", handleScrollViewPop);
    };
  }, [globalModalOpened]);

  const chooseFeedToShow = () => {
    if (gridView) {
      return (
        <ProfileFeed
          videos={videos}
          viewIndex={viewIndex}
          handleChangeView={handleChangeView}
        />
      );
    } else if (likedItemsView) {
      return (
        <ProfileFeed
          videos={likedVideos}
          viewIndex={viewIndex}
          handleChangeView={handleChangeView}
          profileFeedType="likedVideos"
        />
      );
    } else if (historyView) {
      return (
        <ProfileFeed
          videos={seenVideos}
          viewIndex={viewIndex}
          handleChangeView={handleChangeView}
          profileFeedType="historyVideos"
          setLikedVideoIds={setLikedVideoIds}
        />
      );
    }
  };

  const [openSettings, setOpenSettings] = useState(false);
  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setOpenSettings(open);
  };

  const [openCaption, setOpenCaption] = useState(false);
  const handleCaptionOpen = () => {
    setOpenCaption(true);
    window.history.pushState(
      {
        caption: "caption",
      },
      "",
      ""
    );
  };
  const handleCaptionClose = () => {
    setOpenCaption(false);
    window.history.back();
  };
  useDidMountEffect(() => {
    const handleCaptionPop = () => {
      setOpenCaption(false);
    };

    if (openCaption) {
      window.addEventListener("popstate", handleCaptionPop);
    } else {
      window.removeEventListener("popstate", handleCaptionPop);
    }
  }, [openCaption]);

  const handlePurchaseSuccessClose = () => {
    setShowPurchaseSuccess(false);
    window.history.back();
  };

  useDidMountEffect(() => {
    const handlePurchaseSuccessPop = () => {
      setShowPurchaseSuccess(false);
    };

    if (showPurchaseSuccess) {
      window.history.pushState(
        {
          purhcaseSuccess: "purhcaseSuccess",
        },
        "",
        ""
      );

      window.addEventListener("popstate", handlePurchaseSuccessPop);
    } else {
      window.removeEventListener("popstate", handlePurchaseSuccessPop);
    }
  }, [showPurchaseSuccess]);

  const hiddenFileInput = useRef(null);
  const handleUploadClick = (event) => {
    hiddenFileInput.current.click();
  };

  const getFileUrl = async (file) => {
    let formData = new FormData();
    formData.append("media", file);

    const result = await axios.post("/v1/upload/aws", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return result.data.url;
  };

  const handleFileUpload = async (file) => {
    const mediaType = file.type.split("/")[0];
    if (mediaType != "image") {
      alert("Please upload images only");
    } else {
      const imageUrl = await getFileUrl(file);
      await axios.put("/v1/users/update/" + localStorage.getItem("USER_ID"), {
        picture: imageUrl,
      });
      setImage(imageUrl);
      localStorage.setItem("PICTURE", imageUrl);
    }
  };

  if (scrollView) {
    return chooseFeedToShow();
  }

  return (
    <div className="PersonalProfile" ref={scrollRef}>
      <div className="profile_wrapper">
        <div className="personal_profile_top">
          <div className="personal_profile_top_header">
            <ArrowDropDownOutlinedIcon
              onClick={toggleDrawer(true)}
              fontSize="large"
            />
          </div>
          <div className="personal_profile_top_image_name">
            <div className="profile_top_image">
              {image ? (
                <div
                  style={{ position: "relative" }}
                  onClick={handleUploadClick}
                >
                  <img
                    src={image}
                    className="profile_top_image_circular"
                    alt="temp avatar"
                  />
                  <div className="personal_profile_edit_image_circle">
                    <CreateIcon
                      className="personal_profile_edit_image"
                      style={{ fontSize: 16 }}
                    />
                  </div>
                  <input
                    ref={hiddenFileInput}
                    type="file"
                    name="file"
                    onChange={(e) => {
                      handleFileUpload(e.target.files[0]);
                    }}
                  />
                </div>
              ) : null}
            </div>
            <div className="personal_profile_top_name">
              <p>@{username}</p>
            </div>
          </div>
          <div className="personal_profile_top_statistics">
            <div className="profile_top_statistics_details">
              {followings.length > 0 ? (
                <p style={{ fontSize: "18px", fontWeight: "500" }}>
                  {followings.length}
                </p>
              ) : (
                <AllInclusiveIcon />
              )}

              <p>Following</p>
            </div>
            <div className="profile_top_statistics_details">
              {followers.length > 0 ? (
                <p style={{ fontSize: "18px", fontWeight: "500" }}>
                  {followers.length}
                </p>
              ) : (
                <AllInclusiveIcon />
              )}
              <p>Followers</p>
            </div>
            <div className="profile_top_statistics_details">
              <AllInclusiveIcon />
              <p>Likes</p>
            </div>
          </div>
          <div className="profile_top_description">
            <div style={{ position: "relative" }} onClick={handleCaptionOpen}>
              <span style={{ width: "70%", textAlign: "center" }}>
                {profileBio}
              </span>
              <div className="personal_profile_edit_image_circle_caption">
                <CreateIcon
                  className="personal_profile_edit_image_caption"
                  style={{ fontSize: 16 }}
                />
              </div>
            </div>
            <CaptionEdit
              openCaption={openCaption}
              setOpenCaption={setOpenCaption}
              handleCaptionOpen={handleCaptionOpen}
              handleCaptionClose={handleCaptionClose}
              setProfileBio={setProfileBio}
            />
          </div>
          <div className="profile_top_selector">
            {videos.length > 0 ? (
              <div className="profile_icon_and_name">
                <WallpaperOutlinedIcon
                  style={gridView ? {} : { color: "grey" }}
                  onClick={() => {
                    setBoughtItemsView(false);
                    setLikedItemsView(false);
                    setSellItemsView(false);
                    setGridView(true);
                    setHistoryView(false);
                    ModalView("personal profile gallery");
                  }}
                />
                <p style={gridView ? {} : { color: "grey" }}>gallery</p>
              </div>
            ) : null}

            <div className="profile_icon_and_name">
              <FavoriteBorderOutlinedIcon
                style={likedItemsView ? {} : { color: "grey" }}
                onClick={() => {
                  setBoughtItemsView(false);
                  setLikedItemsView(true);
                  setSellItemsView(false);
                  setGridView(false);
                  setHistoryView(false);
                  ModalView("personal profile liked videos");
                }}
              />
              <p style={likedItemsView ? {} : { color: "grey" }}>saved</p>
            </div>

            <div className="profile_icon_and_name">
              <HistoryIcon
                style={historyView ? {} : { color: "grey" }}
                onClick={() => {
                  setBoughtItemsView(false);
                  setLikedItemsView(false);
                  setSellItemsView(false);
                  setGridView(false);
                  setHistoryView(true);
                  ModalView("personal profile watched videos");
                }}
              />
              <p style={historyView ? {} : { color: "grey" }}>history</p>
            </div>

            {sales.length > 0 ? (
              <div className="profile_icon_and_name">
                <CreateOutlinedIcon
                  style={sellItemsView ? {} : { color: "grey" }}
                  onClick={() => {
                    setBoughtItemsView(false);
                    setLikedItemsView(false);
                    setSellItemsView(true);
                    setGridView(false);
                    setHistoryView(false);
                    ModalView("personal profile sold items");
                  }}
                />
                <p style={sellItemsView ? {} : { color: "grey" }}>orders</p>
              </div>
            ) : null}
          </div>
        </div>
        <div className="personal_profile_bottom">
          {gridView ? (
            <VideoGrid videos={videos} handleChangeView={handleChangeView} />
          ) : null}
          {likedItemsView ? (
            <LikedGrid
              likedVideoIds={likedVideoIds}
              likedVideos={likedVideos}
              setLikedVideos={setLikedVideos}
              handleChangeView={handleChangeView}
            />
          ) : null}
          {historyView ? (
            <HistoryGrid
              userId={localStorage.getItem("USER_ID")}
              seenVideos={seenVideos}
              setSeenVideos={setSeenVideos}
              handleChangeView={handleChangeView}
              scrolledBottomCount={scrolledBottomCount}
              historyRef={historyRef}
            />
          ) : null}

          {boughtItemsView ? <Purchases purchases={purchases} /> : null}
          {sellItemsView ? <Sell sales={sales} /> : null}
          {showPWA ? <InstantPWA setShowPWA={setShowPWA} /> : null}
          {showPurchaseSuccess ? (
            <InstantPurchaseSuccess
              handlePurchaseSuccessClose={handlePurchaseSuccessClose}
            />
          ) : null}
        </div>
      </div>
      <Settings openSettings={openSettings} toggleDrawer={toggleDrawer} />
      {isLoggedIn ? null : (
        <StaySlidingSetUp open={checked} handleClose={handleSetUpClose} />
      )}
      {"Notification" in window &&
        "serviceWorker" in navigator &&
        "PushManager" in window && (
          <PushNotificationPrompt
            notifPrompt={notifPrompt}
            setNotifPrompt={setNotifPrompt}
            promptType={promptType}
            setPromptType={setPromptType}
          />
        )}
    </div>
  );
};

// this is for selecting bought items view
// <div className="profile_icon_and_name">
// <ArchiveOutlinedIcon
//   style={boughtItemsView ? {} : { color: "grey" }}
//   onClick={() => {
//     setBoughtItemsView(true);
//     setLikedItemsView(false);
//     setSellItemsView(false);
//     setGridView(false);
//     setHistoryView(false);
//     ModalView("personal profile purchased items");
//   }}
// />
// <p style={boughtItemsView ? {} : { color: "grey" }}>purchased</p>
// </div>

// <InstantGoSecondBrowser
// openGoBrowser={openGoBrowser}
// setOpenGoBrowser={setOpenGoBrowser}
// />
