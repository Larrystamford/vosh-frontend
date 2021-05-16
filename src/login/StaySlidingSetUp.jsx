import React, { useState, useEffect } from "react";
import "./SetUp.css";
import { useGlobalState } from "../GlobalStates";
import { PushNotificationPrompt } from "../notifications/PushNotificationPrompt";
import { useHistory } from "react-router";
import Dialog from "@material-ui/core/Dialog";
import Slide from "@material-ui/core/Slide";
import { makeStyles } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import ClearOutlinedIcon from "@material-ui/icons/ClearOutlined";

import axios from "../axios";

import StayLoginForm from "./StayLoginForm";

import { Exception } from "../components/tracking/Tracker";

const useStyles = makeStyles((theme) => ({
  dialog: {
    position: "absolute",
    margin: 0,
    width: "104vw",
    minHeight: "100vh",
    zIndex: 5000,
    backgroundColor: "white",
  },
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "40ch",
    },
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="right" ref={ref} {...props} />;
});

export const StaySlidingSetUp = (props) => {
  const history = useHistory();
  const classes = useStyles();
  const [manualLoginRefresh, setManualLoginRefresh] = useState(false);

  const [userInfo, setUserInfo] = useGlobalState("hasUserInfo");
  const [loginDone, setLoginDone] = useState(false);

  const onLoginSuccess = () => {
    props.handleClose();
  };

  return (
    <div
      className="SlidingSetUpBody"
      style={props.open ? {} : { display: "none" }}
    >
      <Dialog
        style={{ zIndex: 20000 }}
        open={props.open}
        onClose={props.handleClose}
        TransitionComponent={Transition}
        keepMounted
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
        classes={{
          paper: classes.dialog,
        }}
      >
        <StayLoginForm
          onLoginSuccess={onLoginSuccess}
          setManualLoginRefresh={setManualLoginRefresh}
        />
      </Dialog>
    </div>
  );
};
