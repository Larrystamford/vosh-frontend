import React, { useState, useEffect } from "react";
import "./Comments.css";

import { useDidMountEffect } from "../customHooks/useDidMountEffect";

import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import { CommentSubRow } from "./CommentSubRow";
import axios from "../axios";
import { Link } from "react-router-dom";

export const CommentRow = ({
  index,
  _id,
  picture,
  userName,
  userId,
  message,
  likes,
  likesCount,
  replies,
  handleCommentClicked,
  tempReply,
  handleClose,
  commentsLength,
}) => {
  const [repliesClicked, setRepliesClicked] = useState(false);
  const [liked, setLiked] = useState(false);
  const [subLiked, setSubLiked] = useState(false);

  useEffect(() => {
    // deal with some bug when new comment added, liked is set to true
    if (likes.length == 0) {
      setLiked(0);
      return;
    }
    const userId = localStorage.getItem("USER_ID");
    for (const likeId of likes) {
      if (likeId == userId) {
        setLiked(true);
        break;
      }
    }
  }, [commentsLength]);

  // useDidMountEffect(() => {
  //   setLiked(false);
  // }, [commentsLength]);

  const handleLikeButtonClicked = (likeOrUnlike) => {
    if (likeOrUnlike == "like") {
      axios.put(
        "/v1/comment/pushUserCommentFavourites/" +
          localStorage.getItem("USER_ID"),
        { commentId: _id }
      );
      setLiked(true);
    } else if (likeOrUnlike == "unlike") {
      axios.put(
        "/v1/comment/pullUserCommentFavourites/" +
          localStorage.getItem("USER_ID"),
        { commentId: _id }
      );
      setLiked(false);
    }
  };

  const handleSubLikeButtonClicked = (likeOrUnlike) => {
    if (likeOrUnlike == "like") {
      axios.put(
        "/v1/comment/pushUserCommentFavourites/" +
          localStorage.getItem("USER_ID"),
        { commentId: _id }
      );
      setSubLiked(true);
    } else if (likeOrUnlike == "unlike") {
      axios.put(
        "/v1/comment/pullUserCommentFavourites/" +
          localStorage.getItem("USER_ID"),
        { commentId: _id }
      );
      setSubLiked(false);
    }
  };

  return (
    <div className="comments_row">
      <div className="comments_picture">
          <img
            src={picture}
            className="comments_picture_image"
            alt="temp avatar"
          />
      </div>

      <div className="comments_NameCommentReplies">
        <div className="comments_Name">{userName}</div>
        <div className="comment_comment_wrapper">
          <div
            className="comments_Comment"
            onClick={() =>
              handleCommentClicked(index, userName, _id, userId, false)
            }
          >
            {message}
          </div>
          {liked ? (
            <div
              className="comment_like_and_number"
              style={{ marginTop: "-15px" }}
            >
              <FavoriteIcon
                style={{
                  height: "1rem",
                  width: "1rem",
                  color: "red",
                }}
                onClick={() => handleLikeButtonClicked("unlike")}
              />
              <p style={{ fontSize: "11px", color: "rgb(75, 75, 75)" }}>
                {liked ? likesCount + 1 : likesCount}
              </p>
            </div>
          ) : (
            <div
              className="comment_like_and_number"
              style={{ marginTop: "-15px" }}
            >
              <FavoriteBorderIcon
                style={{
                  height: "1rem",
                  width: "1rem",
                  color: "rgb(75, 75, 75)",
                }}
                onClick={() => handleLikeButtonClicked("like")}
              />
              {likesCount > 0 ? (
                <p style={{ fontSize: "11px", color: "rgb(75, 75, 75)" }}>
                  {liked ? likesCount + 1 : likesCount}
                </p>
              ) : null}
            </div>
          )}
        </div>

        {replies && replies.length != 0 && (
          <div
            className="comments_Replies"
            onClick={() => setRepliesClicked((prev) => !prev)}
          >
            See replies
          </div>
        )}

        {tempReply && !repliesClicked && (
          <div className="subComments_row">
            <div className="subComments_picture">
                <img
                  src={tempReply.picture}
                  className="subComments_picture_image"
                  alt="avatar"
                />
            </div>

            <div
              className="subComments_NameCommentReplies"
              onClick={() =>
                handleCommentClicked(
                  index,
                  tempReply.userName,
                  _id,
                  tempReply.userId,
                  true
                )
              }
            >
              <div className="subComments_Name">{tempReply.userName}</div>
              <div className="subComments_Comment">{tempReply.message}</div>
            </div>
          </div>
        )}

        {repliesClicked &&
          // used props so that the name doesn't clash
          // _id, userId, userName, message, likes, likesCount
          replies.map((props) => (
            <CommentSubRow
              props={props}
              handleClose={handleClose}
              index={index}
              _id={_id}
              repliesLength={replies.length}
              handleCommentClicked={handleCommentClicked}
            />
          ))}
      </div>
    </div>
  );
};
