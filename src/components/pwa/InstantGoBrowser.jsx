import React, { useState } from "react";
import "./PWA.css";

import Paper from "@material-ui/core/Paper";
import Slide from "@material-ui/core/Slide";
import Button from "@material-ui/core/Button";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { CopyToClipboard } from "react-copy-to-clipboard";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  paper: {
    zIndex: 1000,
    position: "absolute",
    left: "15%",
    top: "25%",
    transform: "translate(-50%, -50%)",
  },
}));

export const InstantGoBrowser = ({
  openGoBrowser,
  setOpenGoBrowser,
  videoId,
}) => {
  var isWebview = /(Version\/\d+.*\/\d+.0.0.0 Mobile|; ?wv|(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari))/i.test(
    navigator.userAgent
  );

  const classes = useStyles();
  const handleWebViewClose = () => {
    setOpenGoBrowser(false);
  };

  if (isWebview) {
    return (
      <div className={classes.root}>
        <div className={classes.wrapper}>
          <Slide direction="up" in={openGoBrowser} mountOnEnter unmountOnExit>
            <Paper
              id="PWA_paper"
              elevation={4}
              className={classes.paper}
              style={{ backgroundColor: "white", height: "40%" }}
            >
              <img
                width="70px"
                src="https://dciv99su0d7r5.cloudfront.net/favicon-96x96.png"
                alt="Icon"
              />
              <div className="PWA_words_group">
                <h4>Browser Incompatible</h4>
                <p style={{ width: "95%", paddingTop: 10 }}>
                  Video interruption caused by incompatible browser. We highly
                  recommend switching to local browser.
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
                  text={"vosh.club/video/" + videoId}
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

                <div className="PWA_close_button" onClick={handleWebViewClose}>
                  <Button style={{ width: "90%" }}>Close</Button>
                </div>
              </div>
            </Paper>
          </Slide>
        </div>
      </div>
    );
  }

  return null;
};
