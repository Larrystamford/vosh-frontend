import React, { useState } from "react";
import "./SetUp.css";
import { useGlobalState } from "../GlobalStates";
import { useHistory } from "react-router";
import Dialog from "@material-ui/core/Dialog";
import Slide from "@material-ui/core/Slide";

import StayLoginForm from "./StayLoginForm";

import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="right" ref={ref} {...props} />;
});

export const StaySlidingSetUp = (props) => {
  const history = useHistory();
  const [manualLoginRefresh, setManualLoginRefresh] = useState(false);

  const [userInfo, setUserInfo] = useGlobalState("hasUserInfo");
  const [loginDone, setLoginDone] = useState(false);

  const onLoginSuccess = () => {
    props.handleClose();
  };

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

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
        fullScreen={fullScreen}
      >
        <StayLoginForm
          onLoginSuccess={onLoginSuccess}
          setManualLoginRefresh={setManualLoginRefresh}
        />
      </Dialog>
    </div>
  );
};
