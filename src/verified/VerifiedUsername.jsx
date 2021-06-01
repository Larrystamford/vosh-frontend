import React, { useState } from "react";
import "./Verified.css";

import { useDidMountEffect } from "../customHooks/useDidMountEffect";
import axios from "../axios";
import { useHistory } from "react-router";
import { StaySlidingSetUp } from "../login/StaySlidingSetUp";

import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";

import { useWindowSize } from "../customHooks/useWindowSize";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
  },
  margin: {
    margin: theme.spacing(1),
  },
  withoutLabel: {
    marginTop: theme.spacing(1),
  },
  textField: {
    width: "70%",
  },
  multilineColor: {
    color: "black",
  },
}));

export const VerifiedUsername = () => {
  const size = useWindowSize();
  const history = useHistory();
  const classes = useStyles();

  const restrictedNames = [
    "login",
    "discover",
    "upload",
    "profile",
    "video",
    "inbox",
    "notifications",
    "room",
    "review",
    "about-us",
    "verified",
    "logout",
    "feed",
    "search",
    "vosh",
    "getStarted",
    "editProProfile",
    "ContentTagging",
    "changeUsername",
    "ProProfile",
    "ProEdit",
    "profileBio",
    "theme",
    "changePassword",
    "404",
  ];

  const [values, setValues] = useState({
    username: localStorage.getItem("USER_NAME"),
  });

  const [usernameMessage, setUsernameMessage] = useState("");
  const [usernameMessageColor, setUsernameMessageColor] = useState("");

  const [requestLogin, setRequestLogin] = useState(true);

  useDidMountEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      const validUserName = await checkUserName();
      if (validUserName) {
        setUsernameMessage("username available");
        setUsernameMessageColor("green");
      } else if (!validUserName) {
        setUsernameMessage("username not available");
        setUsernameMessageColor("red");
      }
    }, 750);

    return () => clearTimeout(delayDebounceFn);
  }, [values.username]);

  const [focused, setFocused] = useState(false);

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value.toLowerCase() });
  };

  const checkUserName = async () => {
    let format = /[!@#$%^&*()+\=\[\]{};':"\\|,<>\/?]+/;

    if (format.test(values.username) || values.username == "") {
      return false;
    }

    for (const restrictedName of restrictedNames) {
      if (values.username === restrictedName.toLowerCase()) {
        return false;
      }
    }

    if (values.username === localStorage.getItem("USER_NAME").toLowerCase()) {
      return true;
    }

    const res = await axios.get("/v1/users/userNameTaken/" + values.username);
    return !res.data.userNameTaken;
  };

  const onSubmitUserName = async () => {
    const validUserName = await checkUserName();
    if (validUserName) {
      const res = await axios.put(
        "/v1/users/update/" + localStorage.getItem("USER_ID"),
        {
          userName: values.username,
        }
      );

      if (res.status === 201) {
        localStorage.setItem("USER_NAME", res.data[0].userName);
        history.goBack();
      } else {
        alert("username is invalid");
      }
    } else {
      alert("username is invalid");
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      // onSubmitSignUp();
    }
  };

  // MANUAL SIGN UP
  return (
    <div className="verifiedMain">
      <div className="verifiedMessageWrapper">
        <p className="verified_WelcomeWord">VOSH</p>
        <p className="verified_HeaderText">Pro Account Setup</p>
        <p className="verified_NormalText">
          Everything you need to take content creation full time
        </p>
      </div>

      <div className="userNamesWrapper">
        <p className="verified_Header2Text">vosh.club/{values.username}</p>

        <TextField
          size={size.height < 580 ? "small" : null}
          label="Change Your Username"
          id="outlined-start-adornment"
          className={clsx(classes.margin, classes.textField)}
          variant="outlined"
          value={values.username}
          onChange={handleChange("username")}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{ backgroundColor: "white" }}
        />

        <p
          className="verified_Header3Text"
          style={{ color: usernameMessageColor }}
        >
          {usernameMessage}
        </p>
      </div>

      <div className="socialNamesWrapper"></div>

      <p
        className="verified_next"
        style={{
          position: "absolute",
          left: "20px",
          color: "#3e4fae",
          opacity: 0.7,
        }}
        onClick={() => history.goBack()}
      >
        Back
      </p>

      {focused ? null : (
        <p className="verified_next" onClick={() => onSubmitUserName()}>
          Done
        </p>
      )}

      <StaySlidingSetUp
        open={requestLogin && !localStorage.getItem("USER_ID")}
        handleClose={() => {
          setRequestLogin(false);
        }}
      />
    </div>
  );
};
