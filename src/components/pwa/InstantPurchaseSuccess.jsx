import React, { useState } from "react";
import "./PWA.css";

import Paper from "@material-ui/core/Paper";
import Slide from "@material-ui/core/Slide";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Button from "@material-ui/core/Button";
import ShareIcon from "./ShareIcon";
import MoreVertIcon from "@material-ui/icons/MoreVert";

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

export const InstantPurchaseSuccess = ({ handlePurchaseSuccessClose }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.wrapper}>
        <Slide direction="up" in={true} mountOnEnter unmountOnExit>
          <Paper
            id="PWA_paper_purchase"
            elevation={4}
            className={classes.paper}
          >
            <img
              width="70px"
              src="https://media2locoloco-us.s3.amazonaws.com/icon-192x192.png"
              alt="Icon"
            />
            <div className="PWA_words_group">
              <h4>Woo-Hoo!</h4>

              <p style={{ textAlign: "center", paddingBottom: "1rem", paddingTop: 10 }}>
                Your purchase was successful! Your order should arrive in 7 to
                20 business days.
              </p>
              <p style={{ textAlign: "center" }}>
                All delivery updates will be sent to "Full Order Details"
              </p>
            </div>

            <div
              className="PWA_close_button_apple"
              onClick={handlePurchaseSuccessClose}
            >
              <Button style={{ width: "90%" }}>Close</Button>
            </div>
          </Paper>
        </Slide>
      </div>
    </div>
  );
};
