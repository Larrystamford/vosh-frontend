import React, { useEffect, useState } from "react";
import "./Login.css";
import GoogleLogin from "react-google-login";

import { useHistory } from "react-router";

import { reduxForm } from "redux-form";
import { connect } from "react-redux";
import { compose } from "redux";
import * as actions from "../components/actions";

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

import axios from "../axios";

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
}));

const StayLoginFormPage = (props) => {
  const history = useHistory();
  const responseGoogle = async (res) => {
    await props.oauthGoogle(res.tokenId);
  };

  let googleClient, redirect_uri;
  if (process.env.NODE_ENV === "development") {
    googleClient = process.env.REACT_APP_GOOGLE_AUTH_ID;
  } else {
    googleClient =
      "318894449479-83da2ctgvdlqim67222hbrasmon78qte.apps.googleusercontent.com";
  }

  const [nextClicked, setNextClicked] = useState(false);

  const [webView, setWebView] = useState(false);
  let isWebview =
    /(Version\/\d+.*\/\d+.0.0.0 Mobile|; ?wv|(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari))/i.test(
      navigator.userAgent
    );

  isWebview = true; // temp put this to wait for bug to stop

  useEffect(() => {
    setWebView(isWebview);
  }, []);

  useEffect(() => {
    if (props.errorMessage == "nil") {
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
              background2: "https://dciv99su0d7r5.cloudfront.net/white_bg.jpg",
            },
          })
          .then((res) => {
            localStorage.setItem("USER_NAME", res.data[0].userName);
            history.push({
              pathname: "/profile",
            });
            setNextClicked(false);
          })
          .catch((err) => {
            alert("Try again");
            setNextClicked(false);
          });
      } else {
        history.push({
          pathname: "/profile",
        });
      }
    } else if (props.errorMessage != "nil" && props.errorMessage != undefined) {
      alert(props.errorMessage);
      setNextClicked(false);
    }
  }, [props.errorMessage]);

  const classes = useStyles();
  const [signUp, setSignUp] = useState(true);
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

  const onSubmitSignUp = async () => {
    if (!nextClicked) {
      setNextClicked(true);
      if (!validateEmail(values.email)) {
        alert("Please enter a valid email address");
        setNextClicked(false);
      } else if (values.email === "" || values.password === "") {
        alert("Empty fields are not allowed");
        setNextClicked(false);
      } else {
        if (signUp) {
          await props.signUp({
            email: values.email,
            password: values.password,
          });
          setNextClicked(false);
        } else {
          try {
            await props.signIn({
              email: values.email,
              password: values.password,
            });
            setNextClicked(false);
          } catch {
            alert("Try again");
            setNextClicked(false);
          }
        }
      }
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      onSubmitSignUp();
    }
  };

  const [focused, setFocused] = useState(false);
  const [manualForm, setManualForm] = useState(true);

  // MANUAL SIGN UP
  if (manualForm) {
    return (
      <div
        className="formMainLocal"
        style={
          signUp ? { backgroundColor: "white" } : { backgroundColor: "black" }
        }
      >
        <div className="Form_ManualWelcomeMessageWrapper">
          <p
            className="Form_WelcomeWord"
            style={signUp ? { color: "black" } : { color: "white" }}
          >
            Vosh
          </p>
          {signUp ? (
            <p className="Form_WelcomeText" style={{ color: "black" }}>
              Create an Account
            </p>
          ) : (
            <p className="Form_WelcomeText" style={{ color: "white" }}>
              Sign In
            </p>
          )}
        </div>

        {signUp ? (
          <div className="loginButtonWrapperLocal">
            <TextField
              label="Sign Up with e-mail"
              id="outlined-start-adornment"
              className={clsx(classes.margin, classes.textField)}
              variant="outlined"
              value={values.email}
              onChange={handleChange("email")}
              onKeyDown={handleKeyDown}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
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
                id="outlined-adornment-password8"
                type={values.showPassword ? "text" : "password"}
                value={values.password}
                onChange={handleChange("password")}
                onKeyDown={handleKeyDown}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {values.showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
                labelWidth={70}
              />
            </FormControl>
          </div>
        ) : (
          <div className="loginButtonWrapperLocal">
            <TextField
              label="Sign In with e-mail"
              id="outlined-start-adornment"
              className={clsx(classes.margin, classes.textField)}
              variant="filled"
              value={values.email}
              onChange={handleChange("email")}
              onKeyDown={handleKeyDown}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              style={{ backgroundColor: "white" }}
            />
            <FormControl
              className={clsx(classes.margin, classes.textField)}
              variant="filled"
              style={{ backgroundColor: "white" }}
            >
              <InputLabel htmlFor="outlined-adornment-password">
                Password
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password9"
                type={values.showPassword ? "text" : "password"}
                value={values.password}
                onChange={handleChange("password")}
                onKeyDown={handleKeyDown}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {values.showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
                labelWidth={70}
              />
            </FormControl>
          </div>
        )}
        {signUp && !focused && (
          <p
            style={{
              fontSize: "13px",
              position: "absolute",
              bottom: "30px",
              left: "30px",
              color: "#3e4fae",
            }}
            onClick={() => setSignUp(!signUp)}
          >
            Already have an account?
          </p>
        )}
        {!signUp && !focused && (
          <p
            style={{
              fontSize: "13px",
              position: "absolute",
              bottom: "30px",
              left: "30px",
              color: "white",
            }}
            onClick={() => setSignUp(!signUp)}
          >
            Create new account
          </p>
        )}
        {focused ? null : (
          <p
            style={
              signUp
                ? {
                    fontSize: "16px",
                    position: "absolute",
                    bottom: "30px",
                    right: "30px",
                    color: "#3e4fae",
                    fontWeight: "bold",
                  }
                : {
                    fontSize: "16px",
                    position: "absolute",
                    bottom: "30px",
                    right: "30px",
                    color: "white",
                    fontWeight: "bold",
                  }
            }
            onClick={async () => {
              await onSubmitSignUp();
            }}
          >
            Next
          </p>
        )}
      </div>
    );
  } else if (isWebview) {
    return (
      <div className="formMain">
        <div className="Form_WelcomeMessageWrapper">
          <p className="Form_WelcomeText">Welcome to</p>
          <p className="Form_WelcomeWord">VOSH</p>
          <img
            src="https://dciv99su0d7r5.cloudfront.net/ShopLocoLoco+Small+Symbol+Orange.png"
            alt="loco logo"
            style={{ height: 20 }}
          />
        </div>

        <div className="loginButtonWrapper">
          <GoogleLogin
            clientId={googleClient}
            autoLoad={false}
            buttonText="Continue With Google"
            onSuccess={responseGoogle}
            onFailure={responseGoogle}
            className="btn btn-outline-primary"
          />
        </div>

        <p
          style={{
            fontSize: "10px",
            position: "absolute",
            bottom: "10px",
            left: "15px",
            color: "#3e4fae",
          }}
          onClick={() => setManualForm(true)}
        >
          No google account
        </p>
      </div>
    );
  } else {
    // NON WEBVIEW SIGN IN
    return (
      <div className="formMain">
        <div className="Form_WelcomeMessageWrapper">
          <p className="Form_WelcomeText">Welcome to</p>
          <p className="Form_WelcomeWord">VOSH</p>
          <img
            src="https://dciv99su0d7r5.cloudfront.net/ShopLocoLoco+Small+Symbol+Orange.png"
            alt="loco logo"
            style={{ height: 20 }}
          />
        </div>

        <div className="loginButtonWrapper">
          <GoogleLogin
            clientId={googleClient}
            buttonText="Continue With Google"
            onSuccess={responseGoogle}
            onFailure={responseGoogle}
            className="btn btn-outline-primary"
          />
        </div>

        <p
          style={{
            fontSize: "10px",
            position: "absolute",
            bottom: "10px",
            left: "15px",
            color: "#3e4fae",
          }}
          onClick={() => setManualForm(true)}
        >
          No google account
        </p>
      </div>
    );
  }
};

function mapStateToProps(state) {
  return {
    errorMessage: state.auth.errorMessage,
  };
}
export default compose(
  connect(mapStateToProps, actions),
  reduxForm({ form: "signin" })
)(StayLoginFormPage);
