import React, { useState } from "react";
import "./Verified.css";

import { useDidMountEffect } from "../customHooks/useDidMountEffect";
import axios from "../axios";
import { useHistory } from "react-router";

import {
  convertUsernameToSocialLink,
  downloadAndSaveTikToksWithRetry,
} from "../helpers/CommonFunctions";

import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
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
    username: "",
    tiktokUserName: "",
    instagramUserName: "",
  });

  const [usernameMessage, setUsernameMessage] = useState("");
  const [usernameMessageColor, setUsernameMessageColor] = useState("");

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

  const [focused1, setFocused1] = useState(false);
  const [focused2, setFocused2] = useState(false);
  const [focused3, setFocused3] = useState(false);

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value.toLowerCase() });
  };

  const checkUserName = async () => {
    let format = /[!@#$%^&*()+\=\[\]{};':"\\|,<>\/?]+/;

    if (format.test(values.username) || values.username === "") {
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

      if (localStorage.getItem("USER_ID")) {
        const res = await axios.put(
          "/v1/users/update/" + localStorage.getItem("USER_ID"),
          {
            userName: values.username,
            accountType: "pro",
            socialAccounts: socialAccounts,
            processingTikToksStartTime: new Date().getTime(),
            proTheme: {
              background1:
                "https://dciv99su0d7r5.cloudfront.net/vosh-template-bg12.jpg",
              background2: "https://dciv99su0d7r5.cloudfront.net/white_bg.jpg",
            },
          }
        );
        localStorage.setItem("USER_NAME", res.data[0].userName);

        history.push({
          pathname: "/profile",
          state: {},
        });
      } else {
        history.push({
          pathname: "/login",
          state: {
            userName: values.username,
            socialAccounts: socialAccounts,
          },
        });
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

      <div
        className="userNamesWrapper"
        style={focused2 || focused3 ? { display: "none" } : null}
      >
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
          onFocus={() => setFocused1(true)}
          onBlur={() => setFocused1(false)}
          style={{ backgroundColor: "white" }}
        />

        <p
          className="verified_Header3Text"
          style={{ color: usernameMessageColor }}
        >
          {usernameMessage}
        </p>
      </div>

      <div
        className="socialNamesWrapper"
        style={focused1 ? { display: "none" } : null}
      >
        <p className="verified_Header2Text">Social Media Accounts</p>
        <div className="socialLogoTextFlex">
          <img
            src="https://dciv99su0d7r5.cloudfront.net/tik-tok.png"
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
            onFocus={() => setFocused2(true)}
            onBlur={() => setFocused2(false)}
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
            src="https://dciv99su0d7r5.cloudfront.net/instagram.png"
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
            onFocus={() => setFocused3(true)}
            onBlur={() => setFocused3(false)}
            style={{ backgroundColor: "white" }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">@</InputAdornment>
              ),
            }}
          />
        </div>
      </div>

      {focused1 || focused2 || focused3 ? null : (
        <p className="verified_next" onClick={() => onSubmitUserName()}>
          Next
        </p>
      )}
    </div>
  );
};
