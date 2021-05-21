import React, { useState, useEffect } from "react";
import "./Comments.css";

import { useDidMountEffect } from "../customHooks/useDidMountEffect";

import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import axios from "../axios";
import { Link } from "react-router-dom";

export const CommentSubRow = ({
  props,
  handleClose,
  index,
  _id,
  repliesLength,
  handleCommentClicked,
}) => {
  const [subLiked, setSubLiked] = useState(false);
  useEffect(() => {
    // deal with some bug when new comment added, liked is set to true
    if (props.likes.length === 0) {
      setSubLiked(0);
      return;
    }
    const userId = localStorage.getItem("USER_ID");

    for (const likeId of props.likes) {
      if (likeId === userId) {
        setSubLiked(true);
        break;
      }
    }
  }, [repliesLength]);

  // useDidMountEffect(() => {
  //   setLiked(false);
  // }, [commentsLength]);

  const handleSubLikeButtonClicked = (likeOrUnlike) => {
    if (likeOrUnlike === "like") {
      axios.put(
        "/v1/comment/pushUserSubCommentFavourites/" +
          localStorage.getItem("USER_ID"),
        { commentId: props._id }
      );
      setSubLiked(true);
    } else if (likeOrUnlike === "unlike") {
      axios.put(
        "/v1/comment/pullUserSubCommentFavourites/" +
          localStorage.getItem("USER_ID"),
        { commentId: props._id }
      );
      setSubLiked(false);
    }
  };

  return (
    <div className="subComments_row">
      <div className="subComments_picture">
          <img
            src={props.picture}
            className="subComments_picture_image"
            alt="avatar"
          />
      </div>

      <div className="subComments_NameCommentRepliesWrapper">
        <div className="subComments_NameCommentReplies">
          <div
            className="subComments_Name"
            onClick={() =>
              handleCommentClicked(
                index,
                props.userName,
                _id,
                props.userId,
                true
              )
            }
          >
            {props.userName}
          </div>
          <div
            className="subComments_Comment"
            onClick={() =>
              handleCommentClicked(
                index,
                props.userName,
                _id,
                props.userId,
                true
              )
            }
          >
            {props.message}
          </div>
        </div>
        {subLiked ? (
          <div
            className="sub_comment_like_and_number"
            style={{ marginTop: "15px" }}
          >
            <FavoriteIcon
              style={{
                height: "0.8rem",
                width: "0.8rem",
                color: "red",
              }}
              onClick={() => handleSubLikeButtonClicked("unlike")}
            />
            <p style={{ fontSize: "9px", color: "rgb(75, 75, 75)" }}>
              {subLiked ? props.likesCount + 1 : props.likesCount}
            </p>
          </div>
        ) : (
          <div
            className="sub_comment_like_and_number"
            style={{ marginTop: "15px" }}
          >
            <FavoriteBorderIcon
              style={{
                height: "0.8rem",
                width: "0.8rem",
                color: "rgb(75, 75, 75)",
              }}
              onClick={() => handleSubLikeButtonClicked("like")}
            />
            {props.likesCount > 0 ? (
              <p style={{ fontSize: "9px", color: "rgb(75, 75, 75)" }}>
                {subLiked ? props.likesCount + 1 : props.likesCount}
              </p>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};
