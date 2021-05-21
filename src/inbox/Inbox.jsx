import React, { useState, useEffect } from "react";
import "./Inbox.css";
import { useGlobalState } from "../GlobalStates";
import { useHistory } from "react-router";

import { Lobby } from "./Lobby";
import axios from "../axios";
import { Link } from "react-router-dom";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";

import { PageView } from "../components/tracking/Tracker";

export const Inbox = () => {
  const history = useHistory();
  const [newNotifcationsNum, setNewNotificationsNum] = useGlobalState(
    "newNotifcationsNum"
  );
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setNewNotificationsNum(0);

    async function getNotifications() {
      const userId = localStorage.getItem("USER_ID");
      if (userId) {
        const notifications = await axios.get(
          `/v1/notifications/getNotifications?userId=${userId}`
        );
        const lastNotificationId = notifications.data[0]._id;
        localStorage.setItem("LAST_NOTIFICATION_ID", lastNotificationId);
        setNotifications(notifications.data);
      }
      setLoading(false);
    }
    getNotifications();
    PageView();
  }, []);

  const typeOfNotifications = (
    userPicture,
    notificationType,
    userName,
    message,
    videoCoverImage,
    redirectLink,
    videoId
  ) => {
    if (notificationType === "comment_reply") {
      return (
        <>
          <div className="inbox_picture">
            <Link className="noSelect" to={`/profile/${userName}`}>
              <img
                src={userPicture}
                className="inbox_picture_image"
                alt="temp avatar"
              />
            </Link>
          </div>

          <div
            className="inbox_NameCommentReplies"
            onClick={() => {
              history.push({
                pathname: `/video/${videoId}`,
                state: {
                  openComments: true,
                },
              });
            }}
          >
            <div className="inbox_Name">
              {userName}{" "}
              <span style={{ fontWeight: 400 }}>replied to your comment</span>
            </div>
            <div className="inbox_inbox_wrapper">
              <div className="inbox_comments_Comment">| {message}</div>
            </div>
          </div>

          <div
            className="inbox_link_picture"
            onClick={() => {
              history.push({
                pathname: `/video/${videoId}`,
                state: {
                  openComments: true,
                },
              });
            }}
          >
            <img
              src={videoCoverImage}
              className="inbox_link_picture_image"
              alt="temp avatar"
            />
          </div>
        </>
      );
    } else if (notificationType === "comment") {
      return (
        <>
          <div className="inbox_picture">
            <Link className="noSelect" to={`/profile/${userName}`}>
              <img
                src={userPicture}
                className="inbox_picture_image"
                alt="temp avatar"
              />
            </Link>
          </div>

          <div
            className="inbox_NameCommentReplies"
            onClick={() => {
              history.push({
                pathname: `/video/${videoId}`,
                state: {
                  openComments: true,
                },
              });
            }}
          >
            <div className="inbox_Name">
              {userName}{" "}
              <span style={{ fontWeight: 300 }}>commented on your video</span>
            </div>
            <div className="inbox_inbox_wrapper">
              <div className="inbox_comments_Comment">| {message}</div>
            </div>
          </div>

          <div
            className="inbox_link_picture"
            onClick={() => {
              history.push({
                pathname: `/video/${videoId}`,
                state: {
                  openComments: true,
                },
              });
            }}
          >
            <img
              src={videoCoverImage}
              className="inbox_link_picture_image"
              alt="temp avatar"
            />
          </div>
        </>
      );
    } else if (notificationType === "broadcast") {
      let redirectTo = `/profile/${userName}`;
      if (redirectLink) {
        redirectTo = redirectLink;
      }
      return (
        <>
          <div className="inbox_picture">
            <Link className="noSelect" to={redirectTo}>
              <img
                src={userPicture}
                className="inbox_picture_image"
                alt="temp avatar"
              />
            </Link>
          </div>
          <Link
            style={{
              color: "inherit",
              textDecoration: "inherit",
              width: "inherit",
            }}
            className="noSelect"
            to={redirectTo}
          >
            <div className="inbox_broadcast_message">
              <div className="inbox_Name">
                <p>
                  {userName}: <span style={{ fontWeight: 400 }}>{message}</span>
                </p>
              </div>
            </div>
          </Link>
          <Link
            style={{ color: "inherit", textDecoration: "inherit" }}
            className="noSelect"
            to={redirectTo}
          >
            <div className="inbox_link_action">
              <NavigateNextIcon fontSize="small" />
            </div>
          </Link>
        </>
      );
    } else if (notificationType === "shippingUpdates") {
      return (
        <>
          <div
            className="inbox_picture"
            onClick={() => {
              history.push({
                pathname: `/profile/${userName}`,
              });
            }}
          >
            <img
              src={userPicture}
              className="inbox_picture_image"
              alt="temp avatar"
            />
          </div>

          <div
            className="inbox_NameCommentReplies"
            onClick={() => {
              history.push({
                pathname: `/profile`,
                state: {
                  openPurchases: true,
                },
              });
            }}
          >
            <div className="inbox_Name">
              @{userName}: <span style={{ fontWeight: 400 }}>{message}</span>
            </div>
          </div>

          <div
            className="inbox_link_picture"
            onClick={() => {
              history.push({
                pathname: `/profile`,
                state: {
                  openPurchases: true,
                },
              });
            }}
          >
            <img
              src={videoCoverImage}
              className="inbox_link_picture_image"
              alt="temp avatar"
            />
          </div>
        </>
      );
    }
  };

  return (
    <div className="inbox">
      <div className="inbox_top_bar">Activity</div>
      <div className="inbox_date_separation_bar">Recent</div>
      {notifications.map(
        (
          {
            _id,
            userPicture,
            userName,
            userId,
            message,
            videoId,
            videoCoverImage,
            notificationType,
            redirectLink,
          },
          i
        ) => (
          <div className="inbox_row">
            {typeOfNotifications(
              userPicture,
              notificationType,
              userName,
              message,
              videoCoverImage,
              redirectLink,
              videoId
            )}
          </div>
        )
      )}
      {notifications.length === 0 && !loading && (
        <div className="inbox_row">
          {typeOfNotifications(
            "https://dciv99su0d7r5.cloudfront.net/favicon-96x96.png",
            "broadcast",
            "Vosh",
            "Welcome to Loco Loco! Get a tailor-made shopping experience by signing in now!",
            "",
            "/profile",
            ""
          )}
        </div>
      )}
      <div style={{ height: "3rem" }}></div>
    </div>
  );
};
