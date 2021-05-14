import React, { useState, useRef } from "react";
import "./Comments.css";
import { useGlobalState } from "../GlobalStates";
import { useWindowSize } from "../customHooks/useWindowSize";

import { CopyToClipboard } from "react-copy-to-clipboard";
import { CommentRow } from "./CommentRow";
import { ReviewRow } from "./ReviewRow";

import ClearOutlinedIcon from "@material-ui/icons/ClearOutlined";

import { StaySlidingSetUp } from "../login/StaySlidingSetUp";

import axios from "../axios";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";

import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import { makeStyles } from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send";

import {
  disableBodyScroll,
  enableBodyScroll,
  clearAllBodyScrollLocks,
} from "body-scroll-lock";

import link from "../icons/link.svg";
import { useEffect } from "react";

const useStyles = makeStyles({
  dialog: {
    position: "absolute",
    left: "50%",
    bottom: "-42%",
    margin: 0,
    transform: "translate(-50%, -50%)",
    width: "102vw",
    height: "79%",
    borderRadius: 10,
  },
});

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const Comments = (props) => {
  const [reviewOrComment, setReviewOrComment] = useState("comment");

  const [userInfo, setUserInfo] = useGlobalState("hasUserInfo");
  const [keyboard, setKeyboard] = useGlobalState("keyboard");

  const classes = useStyles();
  const inputEl = useRef(null);
  const [comments, setComments] = useState([]);
  const [reverseReview, setReverseReview] = useState([]);

  const [checked, setChecked] = useState(false);
  const handleSetUpOpen = () => {
    localStorage.setItem("LOGIN_VIDEO_ID", props.id);
    setChecked(true);
  };
  const handleSetUpClose = () => {
    setChecked(false);
  };

  useEffect(() => {
    setReverseReview(props.reviews.reverse());

    if (props.openCommentsFromInbox) {
      window.history.pushState(
        {
          comment: "comment",
        },
        "",
        ""
      );
    }
    setComments(props.comments);
  }, []);

  const [input, setInput] = useState("");
  const handleSendMessage = async (e) => {
    e.preventDefault();

    let newComment = {
      picture: localStorage.getItem("PICTURE"),
      userName: localStorage.getItem("USER_NAME"),
      userId: localStorage.getItem("USER_ID"),
      message: input,
      likesCount: 0,
      likes: [],
    };

    if (subSubReply && commentUserName && commentId) {
      // sub sub comment

      newComment = {
        ...newComment,
        message: `@${commentUserName} ` + newComment.message,
      };

      axios.post("/v1/comment/createSubComment/" + commentId, {
        newComment: newComment,
        coverImageUrl: props.coverImageUrl,
        commentUserId: commentUserId,
        videoId: props.id,
      });

      // push notifications to commentId
      axios.post("/v1/notifications/sendPushNotification/" + commentUserId, {
        title: "Your comment received a reply",
        text: "Open to view",
        image: "https://dciv99su0d7r5.cloudfront.net/icon-192x192.png",
        tag: "new-reply",
        url: "https://www.shoplocoloco.com/inbox",
      });

      setComments((prevState) => [
        ...prevState.slice(0, commentIndex),
        {
          ...prevState[commentIndex],
          replies: [newComment, ...prevState[commentIndex].replies],
          tempReply: newComment,
        },
        ...prevState.slice(commentIndex + 1),
      ]);

      if (props.profileFeedType != "videoIndividual") {
        props.setNotifPrompt(true);
        props.setPromptType("comments");
      }
    } else if (commentUserName && commentId) {
      // sub comment
      axios.post("/v1/comment/createSubComment/" + commentId, {
        newComment: newComment,
        coverImageUrl: props.coverImageUrl,
        commentUserId: commentUserId,
        videoId: props.id,
      });

      // push notifications to commentId
      axios.post("/v1/notifications/sendPushNotification/" + commentUserId, {
        title: "Your comment received a reply",
        text: "Open to view",
        image: "https://dciv99su0d7r5.cloudfront.net/icon-192x192.png",
        tag: "new-reply",
        url: "https://www.shoplocoloco.com/inbox",
      });

      setComments((prevState) => [
        ...prevState.slice(0, commentIndex),
        {
          ...prevState[commentIndex],
          replies: [newComment, ...prevState[commentIndex].replies],
          tempReply: newComment,
        },
        ...prevState.slice(commentIndex + 1),
      ]);

      if (props.profileFeedType != "videoIndividual") {
        props.setNotifPrompt(true);
        props.setPromptType("comments");
      }
    } else {
      // main comment
      const res = await axios.post("/v1/comment/createComment/" + props.id, {
        newComment: newComment,
        coverImageUrl: props.coverImageUrl,
        commentUserId: props.sellerId,
      });

      // push notifications to video owner
      axios.post("/v1/notifications/sendPushNotification/" + props.sellerId, {
        title: "Your video received a comment",
        text: "Open to view",
        image: "https://dciv99su0d7r5.cloudfront.net/icon-192x192.png",
        tag: "new-comment",
        url: "https://www.shoplocoloco.com/inbox",
      });

      setComments((prevState) => [
        {
          ...newComment,
          replies: [],
          likes: [],
          _id: res.data._id,
          likesCount: 0,
        },
        ...prevState,
      ]);
    }

    setInput("");
    if (props.profileFeedType != "videoIndividual") {
      props.setNotifPrompt(true);
      props.setPromptType("comments");
    }
  };
  const [commentIndex, setCommentIndex] = useState("");
  const [commentUserName, setCommentUserName] = useState("");
  const [commentUserId, setCommentUserId] = useState("");
  const [commentId, setCommentId] = useState("");
  const [placeholder, setPlaceHolder] = useState("Comment ...");
  const [subSubReply, setSubSubReply] = useState(false);

  const targetElement = document.querySelector("#comment_body");

  const handleCommentClicked = (
    commentIndex,
    commentUserName,
    commentId,
    commentUserId,
    subSubReply = false
  ) => {
    setCommentIndex(commentIndex);
    setCommentUserName(commentUserName);
    setCommentUserId(commentUserId);
    setCommentId(commentId);
    setPlaceHolder("replying " + commentUserName);
    inputEl.current.focus();

    if (subSubReply) {
      setSubSubReply(true);
    }
  };

  return (
    <div id="comment_body">
      <Dialog
        open={props.open}
        TransitionComponent={Transition}
        keepMounted
        onClose={props.handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
        classes={{
          paper: classes.dialog,
        }}
      >
        <div className="comments_overall">
          <div
            style={
              keyboard
                ? {
                    position: "absolute",
                    height: "100%",
                    width: "100%",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    zIndex: 3000,
                  }
                : null
            }
          ></div>
          <div className="comments_title">
            <p onClick={() => setReviewOrComment("comment")}>Comments</p>
          </div>

          {reviewOrComment == "comment" && (
            <>
              <div className="comments_box">
                {comments.map(
                  (
                    {
                      _id,
                      picture,
                      userName,
                      userId,
                      message,
                      likes,
                      likesCount,
                      replies,
                      tempReply,
                    },
                    index
                  ) => (
                    <CommentRow
                      index={index}
                      _id={_id}
                      picture={picture}
                      userName={userName}
                      userId={userId}
                      message={message}
                      likes={likes}
                      likesCount={likesCount}
                      replies={replies}
                      handleCommentClicked={handleCommentClicked}
                      tempReply={tempReply}
                      handleClose={props.handleClose}
                      commentsLength={comments.length}
                    />
                  )
                )}
              </div>
              {userInfo == false ? (
                <div>
                  <p
                    style={{
                      fontStyle: "italic",
                      fontSize: "14px",
                      fontWeight: "bold",
                      color: "#6772e5",
                      textDecoration: "underline",
                      height: "4rem",
                    }}
                    onClick={handleSetUpOpen}
                  >
                    log in to comment!
                  </p>
                </div>
              ) : (
                <div className="comment_footer">
                  <form className="comment_form">
                    <input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder={placeholder}
                      type="text"
                      ref={inputEl}
                      onFocus={() => {
                        disableBodyScroll(targetElement);

                        setKeyboard(true);
                      }}
                      onBlur={() => {
                        if (input.length == 0) {
                          setCommentUserName("");
                          setCommentUserId("");
                          setCommentId("");
                          setPlaceHolder("Comment ...");
                          setSubSubReply(false);
                        }
                        setTimeout(() => {
                          enableBodyScroll(targetElement);
                          setKeyboard(false);
                        }, 500);
                      }}
                    />

                    <SendIcon
                      onClick={handleSendMessage}
                      disabled={!input}
                      style={{
                        fontSize: 19,
                        color: "grey",
                        paddingRight: 15,
                        paddingTop: 15,
                      }}
                    />
                  </form>
                </div>
              )}
            </>
          )}
        </div>

        <ClearOutlinedIcon
          style={{ height: "15px", width: "15px" }}
          className="comment_cancelButton"
          onClick={() => props.handleClose()}
        />
      </Dialog>
      <StaySlidingSetUp open={checked} handleClose={handleSetUpClose} />
    </div>
  );
};

// const [reviewOrComment, setReviewOrComment] = useState(
//   props.openCommentsFromInbox ? "comment" : "review"
// );

// <div className="comments_title">
// <p
//   style={
//     reviewOrComment == "review"
//       ? { width: "4rem", color: "black" }
//       : { width: "4rem", color: "grey" }
//   }
//   onClick={() => setReviewOrComment("review")}
// >
//   Reviews
// </p>
// <p style={{ fontWeight: 700 }}>|</p>
// <p
//   style={
//     reviewOrComment == "comment"
//       ? { width: "4rem", color: "black" }
//       : { width: "4rem", color: "grey" }
//   }
//   onClick={() => setReviewOrComment("comment")}
// >
//   Comments
// </p>
// </div>

// {reviewOrComment == "review" && (
//   <div className="comments_box">
//     {reverseReview.map(
//       ({ userName, itemName, userPicture, rating, text }, index) => (
//         <ReviewRow
//           userName={userName}
//           itemName={itemName}
//           userPicture={userPicture}
//           rating={rating}
//           text={text}
//         />
//       )
//     )}
//   </div>
// )}
