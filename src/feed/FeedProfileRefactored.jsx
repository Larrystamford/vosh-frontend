import React, { useState, useEffect, useCallback } from "react";
import Video from "./Video";
import "./Feed.css";
import { PushNotificationPrompt } from "../notifications/PushNotificationPrompt";
import { useGlobalState } from "../GlobalStates";
import { useDidMountEffect } from "../customHooks/useDidMountEffect";

import VideoFooter from "./VideoFooter";
import VideoSidebar from "./VideoSidebar";

import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import ColoredLinearProgress from "../utils/ColoredLinearProgress";

import { useWindowSize } from "../customHooks/useWindowSize";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import { Snackbar } from "@material-ui/core";

export const FeedProfileRefactored = (props) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const size = useWindowSize();
  const [notifPrompt, setNotifPrompt] = useState(false);
  const [promptType, setPromptType] = useState("");

  const [linkCopied, setLinkCopied] = useState(false);
  const handleShareClicked = () => {
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 3000);
  };

  useEffect(() => {
    setImageAndVideoUrl([
      props.videos[props.viewIndex].coverImageUrl,
      props.videos[props.viewIndex].url,
    ]);
  }, []);

  //// VIDEO RELATED STUFF
  const [imageAndVideoUrl, setImageAndVideoUrl] = useState([]);

  const [showPlayButton, setShowPlayButton] = useState(false);
  const [buffering, setBuffering] = useState(false);

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
    console.log("auto play blocked");

    setShowPlayButton(true);
    setBuffering(false);
  }

  function _checkAutoPlay(p) {
    var s = window["Promise"] ? window["Promise"].toString() : "";

    if (
      s.indexOf("function Promise()") !== -1 ||
      s.indexOf("function ZoneAwarePromise()") !== -1
    ) {
      p.catch(function (error) {
        console.error("_checkAutoPlay, error:", error);
        _callback_onAutoplayBlocked();
      });
    } else {
      console.error(
        "_checkAutoplay: promise could not work in your browser ",
        p
      );
      _callback_onAutoplayBlocked();
    }
  }

  let video_player = document.getElementById("video_player");
  if (video_player) {
    video_player.oncanplay = function () {
      console.log("can play");
      document.documentElement.style.setProperty(
        "--img-placeholder-opacity",
        0
      );
    };

    video_player.onwaiting = function () {
      console.log("waiting");

      // need this else when it loops it will trigger buffering
      if (video_player.readyState === 0 || video_player.currentTime > 0.1) {
        setBuffering(true);
      }
    };
    video_player.onplaying = function () {
      setShowPlayButton(false);
      setBuffering(false);
    };
  }

  useDidMountEffect(() => {
    if (video_player) {
      _checkAutoPlay(video_player.play());
    }
  }, [imageAndVideoUrl]);

  const onImageClick = () => {
    let video_player = document.getElementById("video_player");

    if (video_player) {
      var isPlaying =
        video_player.currentTime > 0 &&
        !video_player.paused &&
        !video_player.ended &&
        video_player.readyState > 2;

      if (isPlaying) {
        video_player.pause();
        setShowPlayButton(true);
      } else if (!isPlaying) {
        video_player.play();
        setShowPlayButton(false);
      }
    }
  };

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
        messages,
        shares,
        items,
        averagePrice,
        mediaType,
        _id,
        categories,
        comments,
        coverImageUrl,
        totalReviewRating,
        reviewCounts,
        reviews,
        amazons,
        smallShopLink,
        amazonOrInternal,
        productImages,
        originalCreator,
        proShareCount,
        proCategories,
        affiliateGroupName,
        affiliateProducts,
      },
      index
    ) => {
      return (
        <SwiperSlide key={index}>
          {Math.abs(currentIndex - index) < 3 && (
            <>
              <img
                className="imgPlacement"
                src={coverImageUrl}
                onClick={onImageClick}
              />

              <VideoSidebar
                id={_id}
                likes={likes}
                likesCount={likesCount}
                comments={comments}
                shares={shares}
                coverImageUrl={coverImageUrl}
                sellerId={user}
                totalReviewRating={totalReviewRating}
                reviewCounts={reviewCounts}
                reviews={reviews}
                setNotifPrompt={setNotifPrompt}
                setPromptType={setPromptType}
                proShareCount={proShareCount}
                handleShareClicked={handleShareClicked}
              />

              <VideoFooter
                id={_id}
                userName={userName}
                caption={caption}
                items={items}
                averagePrice={averagePrice}
                categories={categories}
                sellerId={user}
                productImages={productImages}
                openSlider={openSlider}
                setOpenSlider={setOpenSlider}
                buyOpen={buyOpen}
                setBuyOpen={setBuyOpen}
                originalCreator={originalCreator}
                onVideoClick={onImageClick}
                userId={localStorage.getItem("USER_ID")}
                proCategories={proCategories}
                affiliateGroupName={affiliateGroupName}
                affiliateProducts={affiliateProducts}
                proTheme={props.proTheme}
              />
            </>
          )}
        </SwiperSlide>
      );
    },
    [currentIndex]
  );

  return (
    <div className="feed" style={{ zIndex: "1005" }}>
      <Swiper
        direction="vertical"
        slidesPerView={1}
        onSlideChange={(swiper) => {
          // so that scroll has no lag
          setTimeout(() => {
            setImageAndVideoUrl([
              props.videos[swiper.activeIndex].coverImageUrl,
              props.videos[swiper.activeIndex].url,
            ]);
            setCurrentIndex(swiper.activeIndex);
          }, 200);
        }}
        initialSlide={props.viewIndex}
        grabCursor={true}
        freeModeMinimumVelocity={0.01}
        // resistanceRatio={0.2}
        longSwipes={true}
        longSwipesRatio={0.4}
        onTouchMove={() => {
          document.documentElement.style.setProperty(
            "--img-placeholder-opacity",
            1
          );
        }}
        onTransitionEnd={() => {
          document.documentElement.style.setProperty(
            "--img-placeholder-opacity",
            0
          );
        }}
      >
        {props.videos.map(renderItem)}
      </Swiper>

      <div id="div_video_player" className="div_video_player">
        <video
          id="video_player"
          muted={false}
          playsInline
          className="video__player"
          loop
          src={imageAndVideoUrl[1]}
          poster={
            imageAndVideoUrl[0]
              ? imageAndVideoUrl[0]
              : "https://dciv99su0d7r5.cloudfront.net/33333-background.png"
          }
        ></video>
      </div>
      {showPlayButton && (
        <PlayArrowIcon
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            margin: 0,
            transform: "translate(-50%, -50%)",
            height: "5rem",
            width: "5.5rem",
            opacity: 0.65,
            color: "white",
            zIndex: 100,
          }}
          onClick={onImageClick}
        />
      )}
      {buffering && (
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
                  bottom: "2.6rem",
                  opacity: 0.8,
                  width: "100%",
                }
          }
        />
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

      <Snackbar
        open={linkCopied}
        message="Link copied!"
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      />

      <div
        className="ProfileFeed_bottom"
        style={
          size.height / size.width > 2
            ? {
                height: "3.5rem",
              }
            : {
                height: "2.6rem",
              }
        }
      >
        <div onClick={props.handleChangeView}>
          <ArrowBackIosIcon fontSize="large" />
          <p className="ProfileFeed_bottom_words">Back to profile</p>
        </div>
      </div>
    </div>
  );
};
