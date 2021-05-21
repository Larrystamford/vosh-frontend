import React, { useEffect, useState, useRef } from "react";
import VideoFooter from "./VideoFooter";
import VideoSidebar from "./VideoSidebar";
import "./VideoIndividual.css";
import { useGlobalState } from "../GlobalStates";

import { useDidMountEffect } from "../customHooks/useDidMountEffect";
import { useWindowSize } from "../customHooks/useWindowSize";
import VolumeOffIcon from "@material-ui/icons/VolumeOff";
import { Snackbar } from "@material-ui/core";

import PlayArrowIcon from "@material-ui/icons/PlayArrow";

import axios from "../axios";
import { useFetch } from "../customHooks/useFetch";

import { PageView, Exception } from "../components/tracking/Tracker";
import { useDoubleTap } from "use-double-tap";

export const VideoIndividual = ({ match, location }) => {
  const [openCommentsFromInbox, setOpenCommentsFromInbox] = useState(false);
  const size = useWindowSize();

  const [shareStatus, setShareStatus] = useState(false);
  const handleShareClicked = () => {
    setShareStatus(true);
    setTimeout(() => setShareStatus(false), 1300);
  };

  const [bigButton, setBigButton] = useState(true);
  const [firstFrameLoading, setFirstFrameLoading] = useState(true);
  const [keyboard, setKeyboard] = useGlobalState("keyboard");

  const [doubleTapped, setDoubleTapped] = useState(false);
  const bind = useDoubleTap((event) => {
    setDoubleTapped(true);
  });

  const { data, loading } = useFetch(
    "/v1/video/getByVideoId/",
    match.params.id
  );

  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);

  const videoRef = useRef(null);
  const onVideoClick = () => {
    if (playing) {
      setMuted(false);
      videoRef.current.pause();
      setPlaying(false);
    } else {
      setMuted(false);
      videoRef.current.play();
      setPlaying(true);
    }
  };

  const onAmazonClick = () => {
    if (playing) {
      setMuted(false);
      videoRef.current.pause();
      setPlaying(false);
    }
  };

  // useDidMountEffect(() => {
  //   async function playPromiseFunc() {
  //     try {
  //       let playPromise = videoRef.current.play();
  //       if (playPromise !== undefined) {
  //         playPromise
  //           .then(function () {
  //             videoRef.current.pause();
  //             setPlaying(false);

  //             // setTimeout(() => setBigButton(false), 4000);
  //           })
  //           .catch(function (error) {
  //             Exception(
  //               error + "play promise error here, try again at line 234"
  //             );
  //             setPlaying(false);

  //             // setTimeout(() => setBigButton(false), 4000);

  //             setTimeout(() => {
  //               let playPromise = videoRef.current.play();
  //               if (playPromise !== undefined) {
  //                 playPromise
  //                   .then(function () {
  //                     // setPlaying(false);
  //                     videoRef.current.pause();
  //                     console.log("retry succeeded");
  //                   })
  //                   .catch(function (error) {
  //                     // setPlaying(false);

  //                     Exception(error + "play failed again at line 250");
  //                   });
  //               }
  //             }, 10);
  //           });
  //       }
  //     } catch (error) {
  //       setPlaying(false);
  //       Exception(error + "at line 258");
  //     }
  //   }
  //   playPromiseFunc();
  // }, [firstFrameLoading]);

  const [fixHeight, setFixHeight] = useState(700);
  const [fixWidth, setFixWidth] = useState(350);

  useEffect(() => {
    setFixHeight(size.height);
    setFixWidth(size.width);
    PageView();

    // auto open comments if click from inbox
    if (location.state && location.state.openComments) {
      setOpenCommentsFromInbox(true);
    }
  }, []);

  // all the extra modal opens
  const [openSlider, setOpenSlider] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [openAmazon, setOpenAmazon] = useState(false);
  const [buyOpen, setBuyOpen] = useState(false);

  return (
    <>
      {loading ? (
        <div></div>
      ) : (
        <div
          className="video"
          style={keyboard ? { height: fixHeight, width: fixWidth } : null}
          {...bind}
        >
          {data.mediaType === "video" ? (
            <video
              style={keyboard ? { height: fixHeight, width: fixWidth } : null}
              playsInline
              className="video__player"
              loop
              ref={videoRef}
              src={data.url}
              style={{ height: "100%", width: "100%" }}
              onLoadStart={() => setFirstFrameLoading(false)}
              poster={data.coverImageUrl}
              onClick={onVideoClick}
            ></video>
          ) : (
            <img className="video__player" src={data.url} />
          )}

          <VideoFooter
            id={data._id}
            userName={data.userName}
            caption={data.caption}
            items={data.items}
            averagePrice={data.averagePrice}
            bigButton={bigButton}
            categories={data.categories}
            sellerId={data.user._id}
            amazonOrInternal={data.amazonOrInternal}
            productImages={data.productImages}
            openSlider={openSlider}
            setOpenSlider={setOpenSlider}
            buyOpen={buyOpen}
            setBuyOpen={setBuyOpen}
            originalCreator={data.originalCreator}
            proCategories={data.proCategories}
            affiliateGroupName={data.affiliateGroupName}
            affiliateProducts={data.affiliateProducts}
            onVideoClick={onVideoClick}
            proTheme={data.user.proTheme}
            smallShopLink={data.smallShopLink}
            userId={data.user._id}
          />
          <VideoSidebar
            likes={data.likes}
            likesCount={data.likesCount}
            messages={1}
            shares={data.shares}
            id={data._id}
            comments={data.comments}
            coverImageUrl={data.coverImageUrl}
            openCommentsFromInbox={openCommentsFromInbox}
            sellerId={data.user._id}
            profileFeedType="videoIndividual"
            totalReviewRating={data.totalReviewRating}
            reviewCounts={data.reviewCounts}
            reviews={data.reviews}
            amazons={data.amazons}
            smallShopLink={data.smallShopLink}
            amazonOrInternal={data.amazonOrInternal}
            doubleTapped={doubleTapped}
            handleShareClicked={handleShareClicked}
            onVideoClick={onAmazonClick}
            commentsOpen={commentsOpen}
            setCommentsOpen={setCommentsOpen}
            openAmazon={openAmazon}
            setOpenAmazon={setOpenAmazon}
          />

          <Snackbar
            open={shareStatus}
            message="Link copied!"
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          />

          {!playing && data.mediaType === "video" && !firstFrameLoading ? (
            <PlayArrowIcon
              onClick={onVideoClick}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                margin: 0,
                transform: "translate(-50%, -50%)",
                height: "5rem",
                width: "5.5rem",
                opacity: 0.5,
                color: "white",
              }}
            />
          ) : null}
        </div>
      )}
    </>
  );
};
