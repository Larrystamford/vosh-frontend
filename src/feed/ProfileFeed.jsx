import React, { useState, useEffect } from "react";
import Video from "./Video";
import "./Feed.css";
import { PushNotificationPrompt } from "../notifications/PushNotificationPrompt";

import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";

import { Landing } from "../utils_pages/Landing";
import { useWindowSize } from "../customHooks/useWindowSize";

export const ProfileFeed = (props) => {
  const [videos, setVideos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loggedInUserId, setLoggedInUserId] = useState("");

  const size = useWindowSize();

  useEffect(() => {
    const loggedInUserId = localStorage.getItem("USER_ID");
    setLoggedInUserId(loggedInUserId);
    setVideos(props.videos.slice(props.viewIndex, props.videos.length));
  }, []);

  const [notifPrompt, setNotifPrompt] = useState(false);
  const [promptType, setPromptType] = useState("");


  return (
    <div className="feed" style={{ zIndex: "1005" }}>
      <div className="feed_videos" style={{ zIndex: "1005" }}>
        {videos.map(
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
              messages={1}
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
              location="profile"
              size={size}
              comments={comments}
              coverImageUrl={coverImageUrl}
              profileFeedType={props.profileFeedType}
              totalReviewRating={totalReviewRating}
              reviewCounts={reviewCounts}
              reviews={reviews}
              setNotifPrompt={setNotifPrompt}
              setPromptType={setPromptType}
              amazons={amazons}
              smallShopLink={smallShopLink}
              amazonOrInternal={amazonOrInternal}
              setLikedVideoIds={props.setLikedVideoIds} // to push from history to liked grid
              productImages={productImages}
              originalCreator={originalCreator}
              proShareCount={proShareCount}
              proCategories={proCategories}
              affiliateGroupName={affiliateGroupName}
              affiliateProducts={affiliateProducts}
              proTheme={props.proTheme}
              userId={props.userId}
            />
          )
        )}
      </div>
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
      <div
        className="ProfileFeed_bottom"
        style={
          size.height / size.width > 2
            ? {
                height: "3.5rem",
              }
            : null
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
