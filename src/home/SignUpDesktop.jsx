import React, { useState, useEffect } from "react";
import "./Home.css";
import "../login/Login.css";

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
import IconButton from "@material-ui/core/IconButton";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import { SimpleMiddleNotification } from "../components/SimpleMiddleNotification";

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

export const SignUpDesktop = (props) => {
  const history = useHistory();

  const [showError, setShowError] = useState(false);

  const classes = useStyles();

  const [values, setValues] = useState({
    email: "",
    password: "",
    showPassword: false,
  });

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const validateEmail = (email) => {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const signUp = async () => {
    try {
      const res = await axios.post("/v1/users/signup", {
        email: values.email,
        password: values.password,
      });

      localStorage.setItem("USER_ID", res.data.userId);
      localStorage.setItem("USER_NAME", res.data.userName);
      localStorage.setItem("PICTURE", res.data.picture);
      localStorage.setItem("JWT_TOKEN", res.data.token);
      axios.defaults.headers.common["Authorization"] = res.data.token;
      axios.defaults.headers.common = {
        Accept: "application/json",
        "Content-Type": "application/json",
      };
      return "success";
    } catch (e) {
      return "failed";
    }
  };

  const onSubmitSignUp = async () => {
    if (!validateEmail(values.email)) {
      alert("Please enter a valid email address");
    } else if (values.email === "" || values.password === "") {
      alert("Empty fields are not allowed");
    } else {
      let signUpResult = await signUp();
      if (signUpResult === "success") {
        if (
          props.location &&
          props.location.state &&
          props.location.state.userName
        ) {
          axios
            .put("/v1/users/update/" + localStorage.getItem("USER_ID"), {
              userName: props.location.state.userName,
              accountType: "pro",
              socialAccounts: props.location.state.socialAccounts,
              processingTikToksStartTime: new Date().getTime(),
              proTheme: {
                background1:
                  "https://dciv99su0d7r5.cloudfront.net/vosh-default-bg.jpeg",
                background2:
                  "https://dciv99su0d7r5.cloudfront.net/white_bg.jpg",
              },
            })
            .then((res) => {
              localStorage.setItem("USER_NAME", res.data[0].userName);
              history.push({
                pathname: "/profile",
              });
            })
            .catch((err) => {
              alert("Try again");
            });
        } else {
          history.push({
            pathname: "/profile",
          });
        }
      } else {
        alert("Please try again");
      }
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      onSubmitSignUp();
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
            className="formMainLocal"
            style={{ position: "relative", height: "30rem", width: "30rem" }}
          >
            <div
              className="Form_ManualWelcomeMessageWrapper"
              style={{ alignItems: "flex-start" }}
            >
              <p
                className="Form_WelcomeWord"
                style={{ color: "black", textAlign: "left" }}
              >
                Vosh
              </p>
              <p
                className="Form_WelcomeText"
                style={{ color: "black", textAlign: "left" }}
              >
                Create an Account
              </p>
            </div>
            <div
              className="loginButtonWrapperLocal"
              style={{ alignItems: "flex-start" }}
            >
              <TextField
                label="Sign Up with e-mail"
                id="outlined-start-adornment"
                className={clsx(classes.margin, classes.textField)}
                variant="outlined"
                value={values.email}
                onChange={handleChange("email")}
                onKeyDown={handleKeyDown}
                style={{ backgroundColor: "white" }}
              />
              <FormControl
                className={clsx(classes.margin, classes.textField)}
                variant="outlined"
                style={{ backgroundColor: "white" }}
              >
                <InputLabel htmlFor="outlined-adornment-password">
                  Password
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password6"
                  type={values.showPassword ? "text" : "password"}
                  value={values.password}
                  onChange={handleChange("password")}
                  onKeyDown={handleKeyDown}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {values.showPassword ? (
                          <Visibility />
                        ) : (
                          <VisibilityOff />
                        )}
                      </IconButton>
                    </InputAdornment>
                  }
                  labelWidth={70}
                />
              </FormControl>
            </div>

            <div
              className="signup_continue"
              onClick={() => {
                onSubmitSignUp();
              }}
            >
              Continue
            </div>

            {showError && (
              <SimpleMiddleNotification
                message={props.errorMessage}
                width={250}
              />
            )}
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
