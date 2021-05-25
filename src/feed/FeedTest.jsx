import React, { useState, useEffect, useRef, useCallback } from "react";
import "./FeedTest.css";
import "./Feed.css";

import VideoFooter from "./VideoFooter";
import VideoSidebar from "./VideoSidebar";

import axios from "../axios";
import { useWindowSize } from "../customHooks/useWindowSize";
import ColoredLinearProgress from "../utils/ColoredLinearProgress";

import { PushNotificationPrompt } from "../notifications/PushNotificationPrompt";

import { CategoriesSelection } from "./CategoriesSelection";
import { Landing } from "../utils_pages/Landing";
import { BottomNavigationBar } from "../components/BottomNavigationBar";
import { useGlobalState } from "../GlobalStates";
import { useDidMountEffect } from "../customHooks/useDidMountEffect";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";

import { PageView, ModalView } from "../components/tracking/Tracker";

import usePushNotifications from "../customHooks/usePushNotifications";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import VideoTest from "./VideoTest";

export const FeedTest = (props) => {
  const size = useWindowSize();

  let displayFeed = true;
  if (props.match.path != "/") {
    displayFeed = false;
  } else {
    displayFeed = true;
  }

  const [isMuted, setIsMuted] = useGlobalState("isMuted");
  const [rerender, setRerender] = useGlobalState("rerender");
  const [landingClicked, setLandingClicked] = useState(false);

  const [selectCategory, setSelectCategory] = useState("Feed");
  const [videos, setVideos] = useState([]);
  const [isLoadingVideos, setIsLoadingVideos] = useState(true);

  const [showStartButton, setShowStartButton] = useState(false);
  const [welcomeScreen, setWelcomeScreen] = useState(false);
  const [checked, setChecked] = useState(false);

  const [loggedInUserId, setLoggedInUserId] = useGlobalState("loggedInUserId");

  const [currentIndex, setCurrentIndex] = useState(-10);

  // only can be used to retrieve video api, will not be accurate for each video
  const watchRef = useRef({
    watchedFeedId: null,
    currentVideosCount: 0,
  });

  const { updatePushSubscription } = usePushNotifications();

  // for choosing categories
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const handleCategoriesOpen = () => {
    setCategoriesOpen(true);
    window.history.pushState(
      {
        foo: "bar",
      },
      "",
      ""
    );
  };

  const handleCategoriesClose = () => {
    setCategoriesOpen(false);
    window.history.back();
  };

  useEffect(() => {
    const handleCategoriesPop = () => {
      setCategoriesOpen(false);
    };

    window.addEventListener("popstate", handleCategoriesPop);

    // for notification update
    if (
      "Notification" in window &&
      "serviceWorker" in navigator &&
      "PushManager" in window
    ) {
      console.log("update push notif");
      updatePushSubscription();
    }

    // cleanup this component
    return () => {
      window.removeEventListener("popstate", handleCategoriesPop);
    };
  }, []);

  // get unseen videos function
  async function getUnseenVideos(forcedState) {
    let watchingFeedId;
    if (forcedState) {
      watchingFeedId = null;
    } else {
      watchingFeedId = watchRef.current.watchedFeedId;
    }

    const loggedInUserID = localStorage.getItem("USER_ID");
    const response = await axios.get("/v1/feed/list_videos_items/", {
      params: { userId: loggedInUserID, watchedFeedId: watchingFeedId },
    });
    const feeds = response.data;

    const combineFeedVideos = [];
    for (const feedData of feeds) {
      if (feedData && feedData.id != 0) {
        let feedDataVideos = feedData.videos;
        feedDataVideos = feedDataVideos.map((eachVideo) => {
          return { ...eachVideo, ...{ feedId: feedData.id } };
        });
        combineFeedVideos.push(...feedDataVideos);

        watchRef.current.watchedFeedId = feedData.id;
        watchRef.current.currentVideosCount += feedDataVideos.length;
      } else {
        setIsLoadingVideos(false);
      }
    }

    setIsMuted(true);
    setTimeout(
      () => setVideos((prevState) => [...prevState, ...combineFeedVideos]),
      800
    );
    if (combineFeedVideos.length > 0) {
      setVideoUrl(combineFeedVideos[0].url);
    }
    setTimeout(() => setIsLoadingVideos(false), 1300);
  }

  // get unseen categories videos function
  async function getUnseenVideosCategories(forcedState) {
    let watchingFeedId;
    if (forcedState) {
      watchingFeedId = null;
    } else {
      watchingFeedId = watchRef.current.watchedFeedId;
    }
    const loggedInUserID = localStorage.getItem("USER_ID");
    const response = await axios.get(
      "/v1/feed/list_videos_items_by_categories/" + selectCategory,
      {
        params: { userId: loggedInUserID, watchedFeedId: watchingFeedId },
      }
    );
    const feeds = response.data;

    const combineCatVideos = [];
    for (const feedData of feeds) {
      if (feedData && feedData.id != 0) {
        let feedDataVideos = feedData.videos;
        feedDataVideos = feedDataVideos.map((eachVideo) => {
          return { ...eachVideo, ...{ feedId: feedData.id } };
        });
        combineCatVideos.push(...feedDataVideos);

        watchRef.current.watchedFeedId = feedData.id;
        watchRef.current.currentVideosCount += feedDataVideos.length;
      } else {
        setIsLoadingVideos(false);
      }
    }

    setIsMuted(true);
    setTimeout(
      () => setVideos((prevState) => [...prevState, ...combineCatVideos]),
      800
    );
    if (combineCatVideos.length > 0) {
      setVideoUrl(combineCatVideos[0].url);
    }
    setTimeout(() => setIsLoadingVideos(false), 1300);
  }

  const [notifPrompt, setNotifPrompt] = useState(false);
  const [promptType, setPromptType] = useState("");

  // initial load main feed
  useEffect(() => {
    if (localStorage.getItem("refreshed") != "true") {
      setWelcomeScreen(true);
      setTimeout(() => setShowStartButton(true), 1600);
    }
    localStorage.setItem("refreshed", "false");

    const loggedInUserId = localStorage.getItem("USER_ID");
    if (loggedInUserId) {
      setLoggedInUserId(loggedInUserId);
    }

    setCurrentIndex(-1);
    PageView();
    ModalView(selectCategory);
  }, []);

  // changing categories
  useDidMountEffect(async () => {
    // reset the states
    setVideos([]);
    watchRef.current.currentVideosCount = 0;
    setIsLoadingVideos(true);
    setCurrentIndex(-2);
    watchRef.current.watchedFeedId = null;
    ModalView(selectCategory);

    if (selectCategory === "Feed") {
      await getUnseenVideos(true);
    } else {
      await getUnseenVideosCategories(true);
    }
  }, [selectCategory]);

  // rerender
  useDidMountEffect(() => {
    window.location.reload();
    localStorage.setItem("refreshed", "true");
  }, [rerender]);

  // if current videos count is 2 or less, get next feed
  useDidMountEffect(async () => {
    if (currentIndex != -2 && currentIndex != 0) {
      if (selectCategory === "Feed") {
        if (watchRef.current.currentVideosCount - currentIndex <= 1) {
          await getUnseenVideos();
        }
      } else {
        if (watchRef.current.currentVideosCount - currentIndex <= 1) {
          await getUnseenVideosCategories();
        }
      }
    }
  }, [currentIndex]);

  //// VIDEO RELATED STUFF
  const [videoUrl, setVideoUrl] = useState("");

  // all the extra modal opens
  const [openSlider, setOpenSlider] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [buyOpen, setBuyOpen] = useState(false);

  const [globalModalOpened, setGlobalModalOpened] =
    useGlobalState("globalModalOpened");
  useDidMountEffect(() => {
    if (commentsOpen === false && openSlider === false && buyOpen === false) {
      setGlobalModalOpened(false);
    }
  }, [commentsOpen, openSlider, buyOpen]);

  function _callback_onAutoplayBlocked() {
    // do something, for example "show big play button"
    console.log("auto play blocked");
  }

  function isSafari() {
    var chr = window.navigator.userAgent.toLowerCase().indexOf("chrome") > -1;
    var sfri = window.navigator.userAgent.toLowerCase().indexOf("safari") > -1;
    return !chr && sfri;
  }

  function _checkAutoPlay(p) {
    var s = window["Promise"] ? window["Promise"].toString() : "";

    if (
      s.indexOf("function Promise()") !== -1 ||
      s.indexOf("function ZoneAwarePromise()") !== -1
    ) {
      p.catch(function (error) {
        console.error("_checkAutoPlay, error:", error);
        if (error.name == "NotAllowedError") {
          // For Chrome/Firefox
          console.error("_checkAutoPlay: error.name:", "NotAllowedError");
          _callback_onAutoplayBlocked();
        } else if (error.name == "AbortError" && isSafari()) {
          // Only for Safari
          console.error("_checkAutoPlay: AbortError (Safari)");
          _callback_onAutoplayBlocked();
        } else {
          console.error("_checkAutoPlay: happened something else ", error);
          // throw error; // happened something else
        }
      }).then(function () {
        console.log("_checkAutoPlay: then");
        // Auto-play started
      });
    } else {
      console.error(
        "_checkAutoplay: promise could not work in your browser ",
        p
      );
    }
  }

  let video_player = document.getElementById("video_player");
  useDidMountEffect(() => {
    _checkAutoPlay(video_player.play());
  }, [videoUrl]);

  const renderItem = useCallback(
    (
      {
        user,
        url,
        userName,
        caption,
        song,
        likes,
        likesCount,
        comments,
        shares,
        items,
        averagePrice,
        mediaType,
        _id,
        categories,
        coverImageUrl,
        feedId,
        totalReviewRating,
        reviewCounts,
        reviews,
        amazons,
        smallShopLink,
        amazonOrInternal,
        productImages,
        originalCreator,
      },
      index
    ) => {
      return (
        <SwiperSlide key={index}>
          <img
            className="imgPlacement"
            src={coverImageUrl}
            style={{ opacity: 0 }}
          />

          <VideoSidebar
            likes={likes}
            likesCount={likesCount}
            comments={comments}
            shares={shares}
            id={_id}
            coverImageUrl={coverImageUrl}
            sellerId={user}
            totalReviewRating={totalReviewRating}
            reviewCounts={reviewCounts}
            reviews={reviews}
            setNotifPrompt={setNotifPrompt}
            setPromptType={setPromptType}
            amazons={amazons}
            smallShopLink={smallShopLink}
            amazonOrInternal={amazonOrInternal}
            onVideoClick={() => {
              console.log("video click");
            }}
            onVideoTouch={() => {
              console.log("video touch");
            }}
          />

          <VideoFooter
            id={_id}
            userName={userName}
            caption={caption}
            items={items}
            averagePrice={averagePrice}
            categories={categories}
            sellerId={user}
            amazons={amazons}
            amazonOrInternal={amazonOrInternal}
            selectCategory={selectCategory}
            productImages={productImages}
            openSlider={openSlider}
            setOpenSlider={setOpenSlider}
            buyOpen={buyOpen}
            setBuyOpen={setBuyOpen}
            originalCreator={originalCreator}
            onVideoClick={() => {
              console.log("video click");
            }}
            onVideoTouch={() => {
              console.log("video touch");
            }}
            proTheme={{}}
            smallShopLink={smallShopLink}
            userId={localStorage.getItem("USER_ID")}
            location="main feed"
          />
        </SwiperSlide>
      );
    },
    []
  );

  return (
    <div className={displayFeed ? "feed" : "feed_hide"}>
      <div id="div_video_player" className="div_video_player">
        <video
          id="video_player"
          muted={false}
          playsInline
          className="video__player"
          loop
          src={videoUrl}
        ></video>
      </div>
      <Swiper
        direction="vertical"
        slidesPerView={1}
        onSwiper={(swiper) => console.log(swiper)}
        onSlideChange={(swiper) => setVideoUrl(videos[swiper.activeIndex].url)}
        initialSlide={0}
        grabCursor={true}
        preventInteractionOnTransition={true}
      >
        {isLoadingVideos ? (
          <ColoredLinearProgress
            className="Feed_linear_progress"
            style={
              size.height / size.width > 2
                ? {
                    position: "absolute",
                    bottom: "3.4rem",
                    opacity: 0.8,
                    width: "100%",
                  }
                : {
                    position: "absolute",
                    bottom: "2.4rem",
                    opacity: 0.8,
                    width: "100%",
                  }
            }
          />
        ) : videos.length === 0 ? (
          <div className="feed_noVideoMessage">
            {selectCategory === "Feed" ? (
              <p>
                Wow! You are a fast one! Come back tomorrow for more awesome
                shopping recommendations.
              </p>
            ) : (
              <p>This category seems a little empty for now...</p>
            )}
          </div>
        ) : (
          videos.map(renderItem)
        )}
      </Swiper>
    </div>
  );
};
