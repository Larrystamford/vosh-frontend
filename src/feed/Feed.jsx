import React, { useState, useEffect, useRef } from "react";
import Video from "./Video";
import "./Feed.css";
import axios from "../axios";
import { SlidingSetUp } from "../login/SlidingSetUp";
import { useWindowSize } from "../customHooks/useWindowSize";

import { PushNotificationPrompt } from "../notifications/PushNotificationPrompt";

import ColoredLinearProgress from "../utils/ColoredLinearProgress";
import { CategoriesSelection } from "./CategoriesSelection";
import { Landing } from "../utils_pages/Landing";
import { BottomNavigationBar } from "../components/BottomNavigationBar";
import { useGlobalState } from "../GlobalStates";
import { useDidMountEffect } from "../customHooks/useDidMountEffect";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";

import { PageView, ModalView } from "../components/tracking/Tracker";

import usePushNotifications from "../customHooks/usePushNotifications";

export const Feed = (props) => {
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
  const handleSetUpClose = () => {
    setChecked(false);
  };

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

    const combineFeedVideos = []
    for (const feedData of feeds) {
      if (feedData && feedData.id != 0) {
        let feedDataVideos = feedData.videos;
        feedDataVideos = feedDataVideos.map((eachVideo) => {
          return { ...eachVideo, ...{ feedId: feedData.id } };
        });
        combineFeedVideos.push(...feedDataVideos)

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

    const combineCatVideos = []
    for (const feedData of feeds) {
      if (feedData && feedData.id != 0) {
        let feedDataVideos = feedData.videos;
        feedDataVideos = feedDataVideos.map((eachVideo) => {
          return { ...eachVideo, ...{ feedId: feedData.id } };
        });
        combineCatVideos.push(...feedDataVideos)
        
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

    if (selectCategory == "Feed") {
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
      if (selectCategory == "Feed") {
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

  return (
    <div className={displayFeed ? "feed" : "feed_hide"}>
      <SlidingSetUp
        open={checked}
        handleClose={handleSetUpClose}
        fromPath="feed"
      />
      <div className="feed_videos">
        {welcomeScreen ? (
          <Landing
            showStartButton={showStartButton}
            setIsMuted={setIsMuted}
            landingClicked={landingClicked}
            setLandingClicked={setLandingClicked}
            setChecked={setChecked}
          />
        ) : null}
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
                    backgroundColor: "var(--vosh-color-1)",
                    color: "var(--vosh-color-1)",
                  }
                : {
                    position: "absolute",
                    bottom: "2.4rem",
                    opacity: 0.8,
                    width: "100%",
                    backgroundColor: "var(--vosh-color-1)",
                    color: "var(--vosh-color-1)",
                  }
            }
          />
        ) : videos.length == 0 ? (
          <div className="feed_noVideoMessage">
            {selectCategory == "Feed" ? (
              <p>
                Wow! You are a fast one! Shoplocoloco uploads new content daily,
                we hope to see you again!
              </p>
            ) : (
              <p>
                This category seems a little empty for now... Worry not as
                Shoplocoloco uploads new content daily!
              </p>
            )}
          </div>
        ) : (
          videos.map(
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
            ) => (
              <Video
                loggedInUserId={loggedInUserId}
                sellerId={user}
                id={_id}
                url={url}
                userName={userName}
                song={song}
                likes={likes}
                likesCount={likesCount}
                comments={comments}
                caption={caption}
                shares={shares}
                items={items}
                averagePrice={averagePrice}
                mediaType={mediaType}
                categories={categories}
                videoLength={videos.length}
                index={index}
                currentIndex={currentIndex}
                setCurrentIndex={setCurrentIndex}
                coverImageUrl={coverImageUrl}
                location="main feed"
                size={size}
                landingClicked={landingClicked}
                feedId={feedId}
                selectCategory={selectCategory}
                totalReviewRating={totalReviewRating}
                reviewCounts={reviewCounts}
                reviews={reviews}
                setNotifPrompt={setNotifPrompt}
                setPromptType={setPromptType}
                amazons={amazons}
                smallShopLink={smallShopLink}
                amazonOrInternal={amazonOrInternal}
                productImages={productImages}
                originalCreator={originalCreator}
              />
            )
          )
        )}
      </div>

      <div className="feed_categories_selection" onClick={handleCategoriesOpen}>
        <div className="feed_categories_selection_word_icon">
          <p>{selectCategory}</p>
          <ArrowDropDownIcon />
        </div>
      </div>
      <CategoriesSelection
        categoriesOpen={categoriesOpen}
        handleCategoriesClose={handleCategoriesClose}
        selectCategory={selectCategory}
        setSelectCategory={setSelectCategory}
      />

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

      <BottomNavigationBar match={{ url: "/" }} />
    </div>
  );
};
