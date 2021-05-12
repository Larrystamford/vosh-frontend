import React, { useState } from "react";
import "./PWA.css";

import Paper from "@material-ui/core/Paper";
import Slide from "@material-ui/core/Slide";
import Button from "@material-ui/core/Button";
import ShareIcon from "./ShareIcon";

import { makeStyles } from "@material-ui/core/styles";

import useIosInstallPrompt from "./useIosInstallPrompt";
import useWebInstallPrompt from "./useWebInstallPrompt";

import { Event } from "../../components/tracking/Tracker";

const useStyles = makeStyles((theme) => ({
  paper: {
    zIndex: 1000,
    position: "absolute",
    left: "15%",
    top: "25%",
    transform: "translate(-50%, -50%)",
  },
}));

export const InstallPWA = () => {
  var isWebview = /(Version\/\d+.*\/\d+.0.0.0 Mobile|; ?wv|(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari))/i.test(
    navigator.userAgent
  );

  const [iosInstallPrompt, handleIOSInstallDeclined] = useIosInstallPrompt();
  const [
    webInstallPrompt,
    handleWebInstallDeclined,
    handleWebInstallAccepted,
  ] = useWebInstallPrompt();

  const classes = useStyles();
  const [checked, setChecked] = useState(true);

  const handleWebInstallAcceptedWithCheck = () => {
    Event(
      "installations",
      "installed the pwa for andriod from daily asks",
      "pwa install"
    );
    handleWebInstallAccepted();
    setTimeout(() => setChecked(false), 5000);
  };

  const handleWebInstallDeclinedWithCheck = () => {
    handleWebInstallDeclined();
    setChecked(false);
  };

  if ((!iosInstallPrompt && !webInstallPrompt) || isWebview) {
    return null;
  }
  return (
    <div className={classes.root}>
      <div className={classes.wrapper}>
        <Slide direction="up" in={checked} mountOnEnter unmountOnExit>
          <Paper id="PWA_paper" elevation={4} className={classes.paper}>
            <img
              width="70px"
              src="https://dciv99su0d7r5.cloudfront.net/icon-192x192.png"
              alt="Icon"
            />
            <div className="PWA_words_group">
              <h4>Get the App</h4>
              <p style={{ paddingTop: 10 }}>
                Optimise your shopping experience by adding the app to your Home
                screen.
              </p>
            </div>

            {iosInstallPrompt && (
              <>
                <div
                  style={{
                    textAlign: "center",
                  }}
                >
                  <h4>From Safari</h4>
                  Tap
                  <ShareIcon className="PWA_share_icon" />
                  then &quot;Add to Home Screen&quot;
                </div>
                <div
                  className="PWA_close_button_apple"
                  onClick={handleIOSInstallDeclined}
                >
                  <Button style={{ width: "90%" }}>Close</Button>
                </div>
              </>
            )}

            {webInstallPrompt && (
              <div className="PWA_Not_Safari_Buttons">
                <div
                  className="PWA_close_button"
                  onClick={handleWebInstallAcceptedWithCheck}
                >
                  <Button
                    style={{
                      color: "#3e4fae",
                      width: "90%",
                      fontWeight: 600,
                    }}
                  >
                    Install App
                  </Button>
                </div>
                <div
                  className="PWA_close_button"
                  onClick={handleWebInstallDeclinedWithCheck}
                >
                  <Button style={{ width: "90%" }}>Close</Button>
                </div>
              </div>
            )}
          </Paper>
        </Slide>
      </div>
    </div>
  );
};
