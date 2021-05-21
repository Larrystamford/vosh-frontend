import React, { useEffect, useState, useRef } from "react";
import VideoFooter from "./VideoFooter";
import VideoSidebar from "./VideoSidebar";
import "./Video.css";

import { useGlobalState } from "../GlobalStates";
import { useDidMountEffect } from "../customHooks/useDidMountEffect";

import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import { SwipeUp } from "../components/SwipeUp";
import { Snackbar } from "@material-ui/core";
import ColoredLinearProgress from "../utils/ColoredLinearProgress";

import axios from "../axios";
import { useDoubleTap } from "use-double-tap";
import { Exception } from "../components/tracking/Tracker";

import { InstantGoBrowser } from "../components/pwa/InstantGoBrowser";

function Video({
  loggedInUserId,
  sellerId,
  id,
  url,
  userName,
  caption,
  likes,
  likesCount,
  messages,
  shares,
  items,
  averagePrice,
  mediaType,
  categories,
  videoLength,
  index,
  currentIndex,
  setCurrentIndex,
  coverImageUrl,
  location,
  size,
  comments,
  landingClicked,
  feedId,
  selectCategory,
  profileFeedType,
  totalReviewRating,
  reviewCounts,
  reviews,
  setNotifPrompt,
  setPromptType,
  amazons,
  smallShopLink,
  amazonOrInternal,
  setLikedVideoIds,
  productImages,
  originalCreator,
  proShareCount,
  proCategories,
  affiliateGroupName,
  affiliateProducts,
  proTheme,
  userId,
}) {
  const [playing, setPlaying] = useState(false);
  const [playingForButton, setPlayingForButton] = useState(true);
  const [isMuted, setIsMuted] = useGlobalState("isMuted");
  const [keyboard, setKeyboard] = useGlobalState("keyboard");
  const [globalModalOpened, setGlobalModalOpened] = useGlobalState(
    "globalModalOpened"
  );

  const [bigButton, setBigButton] = useState(true);
  const [hand, setHand] = useState(false);
  const [loading, setLoading] = useState(false);

  const [doubleTapped, setDoubleTapped] = useState(false);
  const bind = useDoubleTap((event) => {
    setDoubleTapped(true);
  });

  var el = document.getElementById("demo");
  if (el) {
    el.addEventListener("long-press", function (e) {
      alert("long press");
      e.preventDefault();
    });
  }

  const videoRef = useRef(null);
  const [justUnpaused, setJustUnpaused] = useState(false);
  const onVideoClick = () => {
    if (
      !videoRef.current.paused &&
      playing &&
      !justUnpaused &&
      mediaType === "video" &&
      videoRef.current.readyState > 2
    ) {
      videoRef.current.pause();
      setPlaying(false);
      setPlayingForButton(false);
      if (isMuted) {
        setIsMuted(false);
      }
    }
    setJustUnpaused(false);
  };

  const onVideoTouch = () => {
    var isPlaying =
      videoRef.current.currentTime > 0.2 &&
      !videoRef.current.paused &&
      !videoRef.current.ended &&
      videoRef.current.readyState > 2;

    if (!playing) {
      if (!isPlaying) {
        let playPromise = videoRef.current.play();

        // In browsers that don’t yet support this functionality, playPromise won’t be defined.
        if (playPromise !== undefined) {
          playPromise
            .then(function () {
              // Automatic playback started!
            })
            .catch(function (error) {
              Exception(error + "play promise error at line 108");
              console.log(error + "play promise error at line 108");

              setTimeout(() => {
                let playPromise = videoRef.current.play();
                if (playPromise !== undefined) {
                  playPromise
                    .then(function () {
                      console.log("retry success");
                    })
                    .catch(function (error) {
                      Exception(error + "retried failed at line 118");
                    });
                }
              }, 10);
            });
        }
      }
      setPlaying(true);
      setPlayingForButton(true);
      if (isMuted) {
        setIsMuted(false);
      }
      setJustUnpaused(true);

      // add index 0 video to watched
      if (index === 0) {
        if (loggedInUserId && location === "main feed") {
          axios.put("/v1/users/pushVideoSeen/" + loggedInUserId, {
            videoId: id,
            category: selectCategory,
          });
        } else if (!loggedInUserId) {
          // user must be from profile feed and not logged in
          const existingBeforeVideos = localStorage.getItem(
            "BEFORE_LOGIN_VIDEO_IDS"
          );
          if (existingBeforeVideos) {
            localStorage.setItem(
              "BEFORE_LOGIN_VIDEO_IDS",
              existingBeforeVideos + "," + id
            );
          } else {
            localStorage.setItem("BEFORE_LOGIN_VIDEO_IDS", id);
          }
        }
      }
    } else if (isMuted) {
      setPlaying(true);
      setPlayingForButton(true);
      if (!isPlaying) {
        let playPromise = videoRef.current.play();
        // In browsers that don’t yet support this functionality, playPromise won’t be defined.
        if (playPromise !== undefined) {
          playPromise
            .then(function () {
              // Automatic playback started!
            })
            .catch(function (error) {
              Exception(
                error + "play promise error here, trying again at line 154"
              );
              console.log(
                error + "play promise error here, trying again at line 154"
              );

              setTimeout(() => {
                let playPromise = videoRef.current.play();
                if (playPromise !== undefined) {
                  playPromise
                    .then(function () {
                      console.log("retry success");
                    })
                    .catch(function (error) {
                      Exception(error + "retried failed at line 166");
                    });
                }
              }, 10);
            });
        }
      }
      if (isMuted) {
        setIsMuted(false);
      }
    }
  };

  const [fixHeight, setFixHeight] = useState(700);
  const [fixWidth, setFixWidth] = useState(350);
  useEffect(() => {
    setFixHeight(size.height);
    setFixWidth(size.width);

    if (index === 0) {
      setPlayingForButton(false);
    }
  }, []);

  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setCurrentIndex(index);
          // add video to watched if its playing
          if (index != 0) {
            if (loggedInUserId && location === "main feed") {
              axios.put("/v1/users/pushVideoSeen/" + loggedInUserId, {
                videoId: id,
                category: selectCategory,
              });
            } else if (!loggedInUserId) {
              // user must be from profile feed and not logged in
              const existingBeforeVideos = localStorage.getItem(
                "BEFORE_LOGIN_VIDEO_IDS"
              );
              if (existingBeforeVideos) {
                localStorage.setItem(
                  "BEFORE_LOGIN_VIDEO_IDS",
                  existingBeforeVideos + "," + id
                );
              } else {
                localStorage.setItem("BEFORE_LOGIN_VIDEO_IDS", id);
              }
            }
          }
        }

        if (mediaType === "image" && entry.isIntersecting) {
          setPlaying(true);
          setPlayingForButton(true);
          // setTimeout(() => setBigButton(false), 4000);
        } else if (entry.isIntersecting) {
          var isPlaying =
            videoRef.current.currentTime > 0.2 &&
            !videoRef.current.paused &&
            !videoRef.current.ended &&
            videoRef.current.readyState > 2;

          if (userId) {
            axios.post("/v1/metrics/incrementMetrics", {
              id: userId,
              unqiueIdentifier: id,
            });
          }

          // if index 0, pause it and set playing to false
          if (index === 0 && !isPlaying) {
            setIsMuted(true);
            setHand(true);
            setPlayingForButton(false);
            try {
              let playPromise = videoRef.current.play();
              if (playPromise !== undefined) {
                playPromise
                  .then(function () {
                    videoRef.current.pause();
                    setPlaying(false);
                    // setTimeout(() => setBigButton(false), 4000);
                  })
                  .catch(function (error) {
                    Exception(
                      error + "play promise error here, try again at line 234"
                    );
                    setPlayingForButton(false);
                    setPlaying(false);

                    // setTimeout(() => setBigButton(false), 4000);

                    setTimeout(() => {
                      let playPromise = videoRef.current.play();
                      if (playPromise !== undefined) {
                        playPromise
                          .then(function () {
                            // setPlaying(false);
                            videoRef.current.pause();
                            console.log("retry succeeded");
                          })
                          .catch(function (error) {
                            // setPlaying(false);
                            Exception(error + "play failed again at line 250");
                          });
                      }
                    }, 10);
                  });
              }
            } catch (error) {
              setPlaying(false);
              Exception(error + "at line 258");
            }
          } else if (!isPlaying) {
            try {
              let playPromise = videoRef.current.play();
              if (playPromise !== undefined) {
                playPromise
                  .then(function () {
                    setPlaying(true);
                    setPlayingForButton(true);
                    // setTimeout(() => setBigButton(false), 4000);
                  })
                  .catch(function (error) {
                    // setTimeout(() => setBigButton(false), 4000);
                    Exception(
                      error + "play promise error here, try again at line 272"
                    );
                    console.log(
                      error + "play promise error here, try again at line 272"
                    );

                    setTimeout(() => {
                      let playPromise = videoRef.current.play();
                      if (playPromise !== undefined) {
                        playPromise
                          .then(function () {
                            setPlaying(true);
                            setPlayingForButton(true);
                            setLoading(false);
                            console.log("retry succeeded");
                          })
                          .catch(function (error) {
                            setPlaying(false);
                            setPlayingForButton(false);
                            setLoading(false);
                            Exception(error + "play failed again at line 287");
                          });
                      }
                    }, 10);
                  });
              }
            } catch (error) {
              setPlaying(false);
              setPlayingForButton(false);
              setLoading(false);
              Exception(error + "at line 296");
              console.log(error + "at line 296");
            }
          }
        } else {
          try {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
          } catch (e) {
            console.log("Moving from feed to other component", e);
          }
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.51,
      }
    );
    if (ref.current) {
      observer.observe(ref.current);
    }
  }, [ref]);

  const [shareStatus, setShareStatus] = useState(false);
  const handleShareClicked = () => {
    setShareStatus(true);
    setTimeout(() => setShareStatus(false), 1300);
  };

  useEffect(() => {
    if (videoRef.current) {
      if (videoRef.current.readyState < 4) {
        setLoading(true);
      } else {
        setLoading(false);
      }
    }
  }, [videoRef.current]);

  // all the extra modal opens
  const [openSlider, setOpenSlider] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [openAmazon, setOpenAmazon] = useState(false);
  const [buyOpen, setBuyOpen] = useState(false);

  useDidMountEffect(() => {
    if (
      openAmazon === false &&
      commentsOpen === false &&
      openSlider === false &&
      buyOpen === false
    ) {
      setGlobalModalOpened(false);
    }
  }, [openAmazon, commentsOpen, openSlider, buyOpen]);

  return (
    <div
      key={id}
      className="video"
      style={keyboard ? { height: fixHeight, width: fixWidth } : null}
      ref={ref}
      {...bind}
    >
      {mediaType === "video" ? (
        <video
          id="demo"
          style={keyboard ? { height: fixHeight, width: fixWidth } : null}
          muted={playing || index === currentIndex ? false : isMuted}
          playsInline
          className="video__player"
          loop
          ref={videoRef}
          src={index - currentIndex < 9 || currentIndex - index < 3 ? url : ""}
          onLoadedData={() => setLoading(false)}
          onClick={onVideoClick}
          onTouchStart={onVideoTouch}
          poster={
            index - currentIndex < 9 || currentIndex - index < 3
              ? coverImageUrl
              : ""
          }
        ></video>
      ) : (
        <img
          className="video__player"
          src={index - currentIndex < 9 || currentIndex - index < 3 ? url : ""}
        />
      )}

      {Math.abs(currentIndex - index) < 3 && (
        <VideoFooter
          id={id}
          userName={userName}
          caption={caption}
          items={items}
          averagePrice={averagePrice}
          bigButton={bigButton}
          categories={categories}
          sellerId={sellerId}
          amazons={amazons}
          amazonOrInternal={amazonOrInternal}
          selectCategory={selectCategory}
          productImages={productImages}
          openSlider={openSlider}
          setOpenSlider={setOpenSlider}
          buyOpen={buyOpen}
          setBuyOpen={setBuyOpen}
          originalCreator={originalCreator}
          proCategories={proCategories}
          affiliateGroupName={affiliateGroupName}
          affiliateProducts={affiliateProducts}
          onVideoClick={onVideoClick}
          onVideoTouch={onVideoTouch}
          proTheme={proTheme}
          smallShopLink={smallShopLink}
          userId={userId}
          location={location}
        />
      )}

      {Math.abs(currentIndex - index) < 3 && (
        <VideoSidebar
          likes={likes}
          likesCount={likesCount}
          comments={comments}
          shares={shares}
          id={id}
          coverImageUrl={coverImageUrl}
          handleShareClicked={handleShareClicked}
          sellerId={sellerId}
          profileFeedType={profileFeedType}
          totalReviewRating={totalReviewRating}
          reviewCounts={reviewCounts}
          reviews={reviews}
          setNotifPrompt={setNotifPrompt}
          setPromptType={setPromptType}
          amazons={amazons}
          smallShopLink={smallShopLink}
          amazonOrInternal={amazonOrInternal}
          onVideoClick={onVideoClick}
          setLikedVideoIds={setLikedVideoIds}
          doubleTapped={doubleTapped}
          commentsOpen={commentsOpen}
          setCommentsOpen={setCommentsOpen}
          openAmazon={openAmazon}
          setOpenAmazon={setOpenAmazon}
          proShareCount={proShareCount}
        />
      )}

      <Snackbar
        open={shareStatus}
        message="Link copied!"
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      />

      {!playingForButton && mediaType === "video" && !loading ? (
        <PlayArrowIcon
          onClick={onVideoClick}
          onTouchStart={onVideoTouch}
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
          }}
        />
      ) : null}

      {loading && mediaType === "video" ? (
        <ColoredLinearProgress
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
      ) : null}

      {hand && location === "main feed" ? <SwipeUp /> : null}

      {index === videoLength - 1 ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            height: "0.8rem",
            backgroundColor: "white",
            zIndex: 1000,
            marginTop: "-0.3rem",
          }}
        ></div>
      ) : null}
    </div>
  );
}

export default Video;

// <InstantGoBrowser
// openGoBrowser={openGoBrowser}
// setOpenGoBrowser={setOpenGoBrowser}
// videoId={id}
// />
