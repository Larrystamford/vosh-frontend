import React, { useState } from "react";
import "./Home.css";
import "../verified/Verified.css";

import { useDidMountEffect } from "../customHooks/useDidMountEffect";
import axios from "../axios";
import { useHistory } from "react-router";
import { restrictedNames } from "../helpers/CommonVars";

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

export const GetStartedDesktop = ({}) => {
  const size = useWindowSize();
  const history = useHistory();
  const classes = useStyles();

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

    if (
      localStorage.getItem("USER_NAME") &&
      values.username === localStorage.getItem("USER_NAME").toLowerCase()
    ) {
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
                "https://dciv99su0d7r5.cloudfront.net/vosh-default-bg.jpeg",
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
          pathname: "/signup",
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

  return (
    <div className="home_phone_body">
      <div className="home_header">
        <div
          className="pro_profile_icon_and_name"
          onClick={() => {
            window.open("/", "_self");
          }}
        >
          <img
            src="https://dciv99su0d7r5.cloudfront.net/whale+black.png"
            style={{ height: "16px" }}
          />
        </div>
        <div style={{ display: "flex" }}></div>
      </div>
      <div className="home_dekstop_blocks" style={{ minHeight: "50rem" }}>
        <div className="home_dekstop_blocks_left">
          <div
            className="verifiedMain"
            style={{ position: "relative", height: "40rem", width: "35rem" }}
          >
            <div className="verifiedMessageWrapper">
              <p className="verified_WelcomeWord">VOSH</p>
              <p className="verified_HeaderText">Account Setup</p>
              <p
                className="verified_NormalText"
                style={{ marginTop: "0.5rem" }}
              >
                Connect all your audiences and content with a single website
              </p>
            </div>

            <div className="userNamesWrapper">
              <p className="verified_Header2Text">
                vosh.club/{values.username}
              </p>

              <TextField
                size={size.height < 580 ? "small" : null}
                label="Claim Your Username"
                id="outlined-start-adornment"
                className={clsx(classes.margin, classes.textField)}
                variant="outlined"
                value={values.username}
                onChange={handleChange("username")}
                onKeyDown={handleKeyDown}
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
                  style={{ backgroundColor: "white" }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">@</InputAdornment>
                    ),
                  }}
                />
              </div>
            </div>

            <div
              className="verified_continue"
              onClick={() => onSubmitUserName()}
            >
              Continue
            </div>
          </div>
        </div>
        <div
          className="home_dekstop_blocks_right"
          style={{ position: "relative" }}
        >
          <iframe
            src="/sample"
            height="620"
            width="320"
            title="Iframe Example"
            style={{
              borderRadius: 20,
              border: "6px solid grey",
              marginBottom: "80px",
            }}
          ></iframe>
        </div>
      </div>
    </div>
  );
};
