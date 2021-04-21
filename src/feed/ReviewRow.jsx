import React from "react";
import "./Comments.css";
import Rating from "@material-ui/lab/Rating";

export const ReviewRow = ({ userName, itemName, userPicture, rating, text }) => {
  return (
    <div className="comments_row">
      <div className="comments_picture">
        <img
          src={userPicture}
          className="comments_picture_image"
          alt="temp avatar"
        />
      </div>

      <div className="comments_NameCommentReplies">
        <div className="comments_name_and_rating">
          <div className="comments_Name">{userName}</div>
          <div className="comments_Rating">
            <Rating name="disabled" size="small" value={rating} disabled />
          </div>
        </div>
        <p className="review_item_name">{itemName}</p>

        <div className="comment_comment_wrapper">
          <div className="comments_Comment">{text}</div>
        </div>
      </div>
    </div>
  );
};
