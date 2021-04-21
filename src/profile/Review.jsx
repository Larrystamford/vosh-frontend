import React, { useState, useEffect } from "react";
import "./Review.css";
import { useHistory } from "react-router";
import Rating from "@material-ui/lab/Rating";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

import { getCombinedName } from "../helpers/CommonFunctions";

import ArrowBackIosOutlinedIcon from "@material-ui/icons/ArrowBackIosOutlined";

import axios from "../axios";

export const Review = (props) => {
  // file in props.location.state.file
  const history = useHistory();
  const [reviewInput, setReviewInput] = useState("");
  const [stars, setStars] = useState(5);
  const [fileUrl, setFileUrl] = useState("");
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    const getFileUrl = async (file) => {
      let formData = new FormData();
      formData.append("media", file);

      const result = await axios.post("/v1/upload/aws", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setFileUrl(result.data.url);
    };

    getFileUrl(props.location.state.file);
  }, []);

  const handleSubmitReview = async () => {
    let haveAllRequiredFields = true;

    if (haveAllRequiredFields && !reviewInput) {
      haveAllRequiredFields = false;
      alert("Please write your review");
    }

    if (haveAllRequiredFields && !fileUrl) {
      haveAllRequiredFields = false;
      alert("Something went wrong, please try again");
    }

    if (haveAllRequiredFields) {
      const res = await axios.post("/v1/review/postItemReview", {
        videoId: props.location.state.videoId,
        itemId: props.location.state.itemId,
        itemName: getCombinedName(
          props.location.state.color,
          props.location.state.name,
          props.location.state.size
        ),
        userId: localStorage.getItem("USER_ID"),
        rating: stars,
        text: reviewInput,
        media: fileUrl,
      });

      const reviewId = res.data;
      await axios.put("/v1/users/updateShippingStatus/", {
        buySellItemId: props.location.state.buySellItemId,
        reviewId: reviewId,
      });

      alert("Review posted successfully!");
      history.push("/profile");
    }
  };

  return (
    <div className="review_body">
      <div className="review_header">
        <ArrowBackIosOutlinedIcon
          onClick={() =>
            history.push({
              pathname: "/profile",
            })
          }
        />
        <span
          style={{
            position: "absolute",
            fontWeight: 700,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          Your Review
        </span>
      </div>

      <div className="review_body_wrapper">
        {!focused && (
          <div className="review_flex_column_wrapper">
            <p style={{ fontWeight: 500 }}>
              {getCombinedName(
                props.location.state.color,
                props.location.state.name,
                props.location.state.size
              )}
            </p>
            <img
              className="review_image"
              src={URL.createObjectURL(props.location.state.file)}
              alt="review image"
            />
          </div>
        )}

        <div className="review_flex_column_wrapper" style={{ height: "30%" }}>
          <div className="review_flex_row">
            <p style={{ height: "1rem" }}> Ratings:</p>
            <div style={{ height: "1rem" }}>
              <Rating
                name="simple-controlled"
                value={stars}
                onChange={(event, newValue) => {
                  setStars(newValue);
                }}
              />
            </div>
          </div>

          <div className="review_preview">
            <div className="review_input_div">
              <textarea
                placeholder="Write your review..."
                value={reviewInput}
                onChange={(e) => setReviewInput(e.target.value)}
                cols="20"
                rows="4"
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
              ></textarea>
            </div>
          </div>
        </div>

        {!focused && (
          <div className="review_done_div">
            <p onClick={() => handleSubmitReview()}>Submit</p>
          </div>
        )}
      </div>
    </div>
  );
};
