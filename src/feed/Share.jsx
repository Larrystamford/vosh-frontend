import React from "react";
import "./Share.css";

import { CopyToClipboard } from "react-copy-to-clipboard";

import Dialog from "@material-ui/core/Dialog";
import Slide from "@material-ui/core/Slide";
import { makeStyles } from "@material-ui/core";

import link from "../icons/link.svg";
import { useEffect } from "react";
import { useState } from "react";

const useStyles = makeStyles({
  dialog: {
    position: "absolute",
    left: "50%",
    bottom: "-25%",
    margin: 0,
    transform: "translate(-50%, -50%)",
    width: "102vw",
    height: "40%",
    borderRadius: 10,
  },
});

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const Share = (props) => {
  const classes = useStyles();

  // load data
  const [videoLink, setVideoLink] = useState("");
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      setVideoLink("http://localhost:3000/video/" + props.id);
    } else {
      setVideoLink("vosh.club/video/" + props.id);
    }
  }, []);

  return (
    <div>
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
        <div className="dialogBox">
          <div className="dialogBoxTitle">share to</div>
          <div className="dialogIconsRow">
            <CopyToClipboard text={videoLink}>
              <div className="dialogIcon" onClick={props.handleClose}>
                <img height={40} width={40} src={link} alt="linkLogo" />
                <p>Copy link</p>
              </div>
            </CopyToClipboard>
          </div>
        </div>
      </Dialog>
    </div>
  );
};
