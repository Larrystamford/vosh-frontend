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

import { AddressForm } from "./AddressForm";
import LoginForm from "./LoginForm";

import { Exception } from "../components/tracking/Tracker";
import { CancelConfirm } from "./CancelConfirm";

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

export const SlidingSetUp = (props) => {
  const history = useHistory();
  const classes = useStyles();
  const [manualLoginRefresh, setManualLoginRefresh] = useState(false);
  const [openCancel, setOpenCancel] = useState(false);


  const [userInfo, setUserInfo] = useGlobalState("hasUserInfo");
  const [loginDone, setLoginDone] = useState(false);

  const [number, setNumber] = useState("");
  const [address, setAddress] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");

  useEffect(() => {
    // skip login if only address is missing
    if (localStorage.getItem("USER_ID")) {
      setLoginDone(true);
    }
    if (userInfo) {
      setNumber(userInfo.number);
      setAddress(userInfo.address);
      setCountry(userInfo.country);
      setCity(userInfo.city);
      setPostalCode(userInfo.postalCode);
    }
  }, [userInfo]);

  const onSubmitAddress = () => {
    if (number === "" || number === undefined) {
      alert("Phone number is required");
    } else if (address === "" || address === undefined) {
      alert("Address is required");
    } else if (country === "" || country === undefined) {
      alert("Country is required");
    } else if (city === "" || city === undefined) {
      alert("City is required");
    } else if (postalCode === "" || postalCode === undefined) {
      alert("Postal Code is required");
    } else {
      setUserInfo({
        number: number,
        country: country,
        city: city,
        postalCode: postalCode,
        address: address,
      });
      axios
        .put("/v1/users/update/" + localStorage.getItem("USER_ID"), {
          number: number,
          country: country,
          city: city,
          postalCode: postalCode,
          address: address,
        })
        .then((response) => {
          if (manualLoginRefresh) {
            // redirect to profile
            history.push({
              pathname: "/profile",
              state: {
                setUpProfile: true,
              },
            });
          }

          props.handleClose();
        });
    }
  };

  const [notifPrompt, setNotifPrompt] = useState(false);
  const [promptType, setPromptType] = useState("");

  const onLoginSuccess = () => {
    setNotifPrompt(true);
    setPromptType("login");

    axios
      .get("/v1/users/getUserInfo/" + localStorage.getItem("USER_ID"))
      .then((res) => {
        if (manualLoginRefresh) {
          // redirect to profile
          history.push({
            pathname: "/profile",
            state: {
              setUpProfile: true,
            },
          });

          props.handleClose();
        }

        //// if undefined, go and set up else save & done
        // if (res.data && res.data[0].address) {
        //   setUserInfo({
        //     number: res.data[0].number,
        //     country: res.data[0].country,
        //     city: res.data[0].city,
        //     postalCode: res.data[0].postalCode,
        //     address: res.data[0].address,
        //   });
        //   setLoginDone(true);
        //   if (manualLoginRefresh) {
        //     // redirect to profile
        //     history.push({
        //       pathname: "/profile",
        //       state: {
        //         setUpProfile: true,
        //       },
        //     });
        //   }
        //   props.handleClose();
        // } else {
        //   setLoginDone(true);
        // }
      })
      .catch((err) => {
        Exception(err, "login success but get user info error");
        setLoginDone(true);
      });
  };

  return (
    <>
      {props.open ? (
        <div
          className="SlidingSetUpBody"
          style={props.open ? {} : { display: "none" }}
        >
          {props.fromPath === "feed" ? (
            // feed login, transition appears
            <Dialog
              open={props.open}
              keepMounted
              aria-labelledby="alert-dialog-slide-title"
              aria-describedby="alert-dialog-slide-description"
              classes={{
                paper: classes.dialog,
              }}
            >
              {loginDone ? (
                <AddressForm
                  number={number}
                  setNumber={setNumber}
                  address={address}
                  setAddress={setAddress}
                  country={country}
                  setCountry={setCountry}
                  city={city}
                  setCity={setCity}
                  postalCode={postalCode}
                  setPostalCode={setPostalCode}
                  onSubmitAddress={onSubmitAddress}
                />
              ) : (
                <LoginForm
                  onLoginSuccess={onLoginSuccess}
                  setManualLoginRefresh={setManualLoginRefresh}
                />
              )}
            </Dialog>
          ) : (
            // feed login, transition slide

            <Dialog
              open={props.open}
              TransitionComponent={Transition}
              keepMounted
              aria-labelledby="alert-dialog-slide-title"
              aria-describedby="alert-dialog-slide-description"
              classes={{
                paper: classes.dialog,
              }}
            >
              {loginDone ? (
                <AddressForm
                  number={number}
                  setNumber={setNumber}
                  address={address}
                  setAddress={setAddress}
                  country={country}
                  setCountry={setCountry}
                  city={city}
                  setCity={setCity}
                  postalCode={postalCode}
                  setPostalCode={setPostalCode}
                  onSubmitAddress={onSubmitAddress}
                />
              ) : (
                <LoginForm
                  onLoginSuccess={onLoginSuccess}
                  setManualLoginRefresh={setManualLoginRefresh}
                />
              )}
            </Dialog>
          )}

          {"Notification" in window &&
            "serviceWorker" in navigator &&
            "PushManager" in window && (
              <PushNotificationPrompt
                notifPrompt={notifPrompt}
                setNotifPrompt={setNotifPrompt}
                promptType={promptType}
                setPromptType={setPromptType}
              />
            )}

            <ClearOutlinedIcon
            style={{ height: "25px", width: "25px", zIndex: 6000 }}
            className="sliding_cancel"
            onClick={()=>
              setOpenCancel(true)} />

            <CancelConfirm openCancel={openCancel} setOpenCancel={setOpenCancel} handleCloseSignIn={() => props.handleClose()}/>
        </div>
        
      ) : null}
    </>
  );
};
