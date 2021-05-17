import React, { useState } from "react";
import "./PWA.css";

import Paper from "@material-ui/core/Paper";
import Slide from "@material-ui/core/Slide";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Button from "@material-ui/core/Button";
import ShareIcon from "./ShareIcon";
import { CopyToClipboard } from "react-copy-to-clipboard";

import { makeStyles } from "@material-ui/core/styles";
import MoreVertIcon from "@material-ui/icons/MoreVert";

const useStyles = makeStyles((theme) => ({
  paper: {
    zIndex: 1000,
    position: "absolute",
    left: "15%",
    top: "25%",
    transform: "translate(-50%, -50%)",
  },
}));

export const InstantBrowserMsg = ({
  showBrowserMsg,
  setShowBrowserMsg,
  videoId,
}) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.wrapper}>
        <Slide direction="up" in={showBrowserMsg} mountOnEnter unmountOnExit>
          <Paper
            id="PWA_paper"
            elevation={4}
            className={classes.paper}
            style={{ backgroundColor: "white", height: "40%" }}
          >
            <img
              width="70px"
              src="https://dciv99su0d7r5.cloudfront.net/icon-192x192.png"
              alt="Icon"
            />
            <div className="PWA_words_group">
              <h4>Change Payment Method</h4>
              <p style={{ width: "95%", paddingTop: 10 }}>
                To checkout with Google Pay, open in browser.
              </p>
            </div>
            <div
              style={{
                height: "1rem",
                display: "flex",
                alignItems: "center",
                textAlign: "center",
              }}
              className="PWA_tap_instructions"
            >
              Tap
              <MoreVertIcon className="PWA_dots_icon" />
              then &quot;Open in Browser&quot;
            </div>

            <div className="PWA_Not_Safari_Buttons">
              <CopyToClipboard
                text={"https://vosh.club/video/" + videoId}
              >
                <div className="PWA_close_button">
                  <Button
                    style={{
                      color: "#3e4fae",
                      width: "90%",
                      fontWeight: 600,
                    }}
                  >
                    Copy Link
                  </Button>
                </div>
              </CopyToClipboard>

              <div
                className="PWA_close_button"
                onClick={() => setShowBrowserMsg(false)}
              >
                <Button style={{ width: "90%" }}>Close</Button>
              </div>
            </div>
          </Paper>
        </Slide>
      </div>
    </div>
  );
};
