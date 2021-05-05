import React, { useEffect, useState } from "react";
import "./Verified.css";

import { useDidMountEffect } from "../customHooks/useDidMountEffect";
import axios from "../axios";
import { useHistory } from "react-router";
import { StaySlidingSetUp } from "../login/StaySlidingSetUp";

import { convertUsernameToSocialLink } from "../helpers/CommonFunctions";

import clsx from "clsx";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import Input from "@material-ui/core/Input";
import FilledInput from "@material-ui/core/FilledInput";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import ForwardOutlinedIcon from "@material-ui/icons/ForwardOutlined";

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

export const Verified = () => {
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
    "getVerified",
    "editProProfile",
  ];

  const [values, setValues] = useState({
    username: "",
    tiktokUserName: "",
    instagramUserName: "",
    pinterestUsername: "",
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
    setValues({ ...values, [prop]: event.target.value });
  };

  const checkUserName = async () => {
    let format = /[!@#$%^&*()+\=\[\]{};':"\\|,.<>\/?]+/;

    if (format.test(values.username) || values.username == "") {
      return false;
    }

    for (const restrictedName of restrictedNames) {
      if (values.username == restrictedName) {
        return false;
      }
    }

    if (values.username == localStorage.getItem("USER_NAME")) {
      return true;
    }

    const res = await axios.get("/v1/users/userNameTaken/" + values.username);
    return !res.data.userNameTaken;
  };

  const onSubmitUserName = async () => {
    const validUserName = await checkUserName();
    if (validUserName) {
      const socialAccounts = [];
      let socialLink;
      if (values.tiktokUserName != "") {
        socialLink = convertUsernameToSocialLink(
          "TikTok",
          values.tiktokUserName
        );

        socialAccounts.push({
          id: socialLink,
          socialLink: socialLink,
          userIdentifier: values.tiktokUserName,
          socialType: "TikTok",
        });
      }
      if (values.instagramUserName != "") {
        socialLink = convertUsernameToSocialLink(
          "Instagram",
          values.instagramUserName
        );

        socialAccounts.push({
          id: socialLink,
          socialLink: socialLink,
          userIdentifier: values.instagramUserName,
          socialType: "Instagram",
        });
      }
      if (values.pinterestUsername != "") {
        socialLink = convertUsernameToSocialLink(
          "Pinterest",
          values.pinterestUsername
        );

        socialAccounts.push({
          id: socialLink,
          socialLink: socialLink,
          userIdentifier: values.pinterestUsername,
          socialType: "Pinterest",
        });
      }

      const res = await axios.put(
        "/v1/users/update/" + localStorage.getItem("USER_ID"),
        {
          userName: values.username,
          accountType: "pro",
          socialAccounts: socialAccounts,
        }
      );

      if (res.status == "201") {
        localStorage.setItem("USER_NAME", res.data[0].userName);
        history.push({
          pathname: "/profile",
        });
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
          label="Claim Your Username"
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

      <div className="socialNamesWrapper">
        <p className="verified_Header2Text">Social Media Accounts</p>
        <div className="socialLogoTextFlex">
          <img
            src="https://media2locoloco-us.s3.amazonaws.com/tik-tok.png"
            style={{ height: 25 }}
          />
          <TextField
            size={size.height < 580 ? "small" : null}
            label="Your TikTok Username"
            id="outlined-start-adornment"
            className={clsx(classes.margin, classes.textField)}
            variant="outlined"
            value={values.tiktokUserName}
            onChange={handleChange("tiktokUserName")}
            onKeyDown={handleKeyDown}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            style={{ backgroundColor: "white" }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">@</InputAdornment>
              ),
            }}
          />
        </div>
        <div className="socialLogoTextFlex">
          <img
            src="https://media2locoloco-us.s3.amazonaws.com/instagram.png"
            style={{ height: 25 }}
          />
          <TextField
            size={size.height < 580 ? "small" : null}
            label="Your Instagram Username"
            id="outlined-start-adornment"
            className={clsx(classes.margin, classes.textField)}
            variant="outlined"
            value={values.instagramUserName}
            onChange={handleChange("instagramUserName")}
            onKeyDown={handleKeyDown}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            style={{ backgroundColor: "white" }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">@</InputAdornment>
              ),
            }}
          />
        </div>
        <div className="socialLogoTextFlex">
          <img
            src="https://media2locoloco-us.s3.amazonaws.com/pinterest.png"
            style={{ height: 25 }}
          />
          <TextField
            size={size.height < 580 ? "small" : null}
            label="Your Pinterest Username"
            id="outlined-start-adornment"
            className={clsx(classes.margin, classes.textField)}
            variant="outlined"
            value={values.pinterestUsername}
            onChange={handleChange("pinterestUsername")}
            onKeyDown={handleKeyDown}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            style={{ backgroundColor: "white" }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">@</InputAdornment>
              ),
            }}
          />
        </div>
      </div>

      {focused ? null : (
        <p className="verified_next" onClick={() => onSubmitUserName()}>
          Next
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
