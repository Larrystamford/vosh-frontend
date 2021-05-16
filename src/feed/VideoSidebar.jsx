import React, { useState, useEffect, useCallback } from "react";
import "./VideoSidebar.css";
import { useGlobalState } from "../GlobalStates";
import { useDidMountEffect } from "../customHooks/useDidMountEffect";
import { Comments } from "./Comments";

import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import MessageIcon from "@material-ui/icons/Message";
import ShareIcon from "@material-ui/icons/Share";
import { FaAmazon } from "react-icons/fa";
import LoyaltyIcon from "@material-ui/icons/Loyalty";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

import { CopyToClipboard } from "react-copy-to-clipboard";
import axios from "../axios";
import { Event } from "../components/tracking/Tracker";
import ReactPixel from "react-facebook-pixel";

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";

function VideoSidebar({
  id,
  likes,
  likesCount,
  shares,
  comments,
  handleShareClicked,
  coverImageUrl,
  openCommentsFromInbox,
  sellerId,
  profileFeedType,
  totalReviewRating,
  reviewCounts,
  reviews,
  setNotifPrompt,
  setPromptType,
  amazons,
  smallShopLink,
  amazonOrInternal,
  onVideoClick,
  setLikedVideoIds,
  doubleTapped,
  commentsOpen,
  setCommentsOpen,
  openAmazon,
  setOpenAmazon,
  proShareCount,
}) {
  const [liked, setLiked] = useState(profileFeedType == "likedVideos");
  const [userInfo, setUserInfo] = useGlobalState("hasUserInfo");
  const [globalModalOpened, setGlobalModalOpened] = useGlobalState(
    "globalModalOpened"
  );

  const handleCommentPop = useCallback(() => {
    // setGlobalModalOpened(false);
    setCommentsOpen(false);
  }, []);
  const handleAmazonPop = useCallback(() => {
    // setGlobalModalOpened(false);
    setOpenAmazon(false);
  }, []);

  useEffect(() => {
    window.addEventListener("popstate", handleCommentPop);
    window.addEventListener("popstate", handleAmazonPop);

    // cleanup this component
    return () => {
      window.removeEventListener("popstate", handleCommentPop);
      window.removeEventListener("popstate", handleAmazonPop);
    };
  }, []);

  // commenting
  const handleCommentsOpen = () => {
    setCommentsOpen(true);
    setGlobalModalOpened(true);
    window.history.pushState(
      {
        comment: "comment",
      },
      "",
      ""
    );

    Event(
      "video",
      "Clicked the comments button for videoId: " + id,
      "Comments Button"
    );
  };
  const handleCommentsClose = (clickedProfileIcon) => {
    if (clickedProfileIcon != "clicked") {
      window.history.back();
    } else {
      setCommentsOpen(false);
    }
  };

  // amazon
  const handleAmazonOpen = () => {
    setOpenAmazon(true);
    setGlobalModalOpened(true);
    window.history.pushState(
      {
        amazon: "amazon",
      },
      "",
      ""
    );
  };
  const handleAmazonClose = () => {
    window.history.back();
  };

  useEffect(() => {
    if (
      profileFeedType == "videoIndividual" ||
      profileFeedType == "historyVideos"
    ) {
      if (
        userInfo &&
        userInfo.likedVideos &&
        userInfo.likedVideos.includes(id)
      ) {
        setLiked(true);
      }
    }
  }, [userInfo]);

  const [videoLink, setVideoLink] = useState("");
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      setVideoLink("http://localhost:3000/video/" + id);
    } else {
      setVideoLink("https://vosh.club/video/" + id);
    }
  }, []);

  const handleLikeButtonClicked = (likeOrUnlike) => {
    if (likeOrUnlike == "like") {
      axios.put(
        "/v1/users/pushUserFavourites/" + localStorage.getItem("USER_ID"),
        { videoId: id }
      );
      setLiked(true);

      // for notification prompting
      if (profileFeedType != "videoIndividual") {
        setNotifPrompt(true);
        setPromptType("like");
      }

      // push video from history to saved
      if (profileFeedType == "historyVideos") {
        setLikedVideoIds((prevState) => [id, ...prevState]);
      }
    } else if (likeOrUnlike == "unlike") {
      axios.put(
        "/v1/users/pullUserFavourites/" + localStorage.getItem("USER_ID"),
        { videoId: id }
      );
      setLiked(false);
    }
  };

  // for likeing when double tapped
  useDidMountEffect(() => {
    axios.put(
      "/v1/users/pushUserFavourites/" + localStorage.getItem("USER_ID"),
      { videoId: id }
    );
    setLiked(true);

    // for notification prompting
    if (profileFeedType != "videoIndividual") {
      setNotifPrompt(true);
      setPromptType("like");
    }

    // push video from history to saved
    if (profileFeedType == "historyVideos") {
      setLikedVideoIds((prevState) => [id, ...prevState]);
    }
  }, [doubleTapped]);

  return (
    <div className="videoSidebar">
      <div className="videoSidebar__button">
        {liked ? (
          <FavoriteIcon
            fontSize="default"
            style={{ color: "red" }}
            onClick={() => handleLikeButtonClicked("unlike")}
          />
        ) : (
          <FavoriteBorderIcon
            fontSize="default"
            onClick={() => handleLikeButtonClicked("like")}
          />
        )}
        <p>
          {liked
            ? proShareCount
              ? likesCount + 1 + proShareCount
              : likesCount + 1
            : proShareCount
            ? likesCount + proShareCount
            : likesCount}
        </p>
      </div>

      <div className="videoSidebar__button">
        <MessageIcon fontSize="default" onClick={handleCommentsOpen} />
        <p>{reviewCounts}</p>
      </div>

      {(amazonOrInternal == "small_shop" ||
        amazonOrInternal == "small_shop_and_amazon") && (
        <div className="videoSidebar__button">
          <LoyaltyIcon
            fontSize="default"
            style={{ color: "white" }}
            onClick={() => {
              onVideoClick();
              handleLikeButtonClicked("like");
              window.open(smallShopLink, "_blank");
              Event(
                "ecommerce",
                "Clicked small shop link" + smallShopLink,
                "Small shop button"
              );
              return false;
            }}
          />
        </div>
      )}

      {amazonOrInternal == "both" ||
      amazonOrInternal == "amazon" ||
      amazonOrInternal == "small_shop_and_amazon" ? (
        <div className="videoSidebar__button">
          <FaAmazon
            size={27}
            style={{ color: "white" }}
            onClick={handleAmazonOpen}
          />
        </div>
      ) : null}

      <div className="videoSidebar__button">
        <CopyToClipboard text={videoLink}>
          <ShareIcon
            fontSize="default"
            onClick={() => {
              handleShareClicked();
              Event(
                "video",
                "Clicked the share button for videoId: " + id,
                "Share Button"
              );

              ReactPixel.track("AddToWishlist", { content_name: id });
            }}
          />
        </CopyToClipboard>
      </div>

      <Comments
        open={commentsOpen}
        handleClose={handleCommentsClose}
        id={id}
        comments={comments}
        coverImageUrl={coverImageUrl}
        sellerId={sellerId}
        totalReviewRating={totalReviewRating}
        reviewCounts={reviewCounts}
        reviews={reviews}
        setNotifPrompt={setNotifPrompt}
        setPromptType={setPromptType}
        profileFeedType={profileFeedType}
        openCommentsFromInbox={openCommentsFromInbox}
      />

      {openAmazon && (
        <Dialog
          onClose={handleAmazonClose}
          aria-labelledby="simple-dialog-title"
          open={openAmazon}
        >
          <DialogTitle id="simple-dialog-title">Amazon Links</DialogTitle>
          <List style={{ overflowY: "scroll", maxHeight: "14rem" }}>
            {amazons.map((amazon) => (
              <ListItem
                onClick={() => {
                  onVideoClick();
                  handleLikeButtonClicked("like");
                  window.open(amazon.amazon_link, "_blank");
                  Event(
                    "ecommerce",
                    "Clicked amazon link for videoId: " + id,
                    "Amazon button"
                  );
                  return false;
                }}
                key={amazon.amazon_name}
                style={{ minWidth: "19rem" }}
              >
                <div className="sidebar_amazonlogolink">
                  <FaAmazon
                    size={22}
                    style={{ color: "#FF9A00" }}
                    onClick={() => setOpenAmazon(true)}
                  />
                  <p>{amazon.amazon_name}</p>
                </div>
              </ListItem>
            ))}
          </List>
        </Dialog>
      )}
    </div>
  );
}

export default VideoSidebar;
