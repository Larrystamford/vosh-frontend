import React, { useEffect, useState } from "react";
import "./Login.css";
import GoogleLogin from "react-google-login";
import {
  AUTH_SIGN_UP,
  AUTH_ERROR,
  AUTH_SIGN_OUT,
  AUTH_SIGN_IN,
  GET_SECRET,
} from "../components/actions/types";

import { reduxForm, Field } from "redux-form";
import { connect } from "react-redux";
import { compose } from "redux";
import * as actions from "../components/actions";

import { useHistory } from "react-router";
import { useWindowSize } from "../customHooks/useWindowSize";

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

const Login = (props) => {
  const size = useWindowSize();
  document.documentElement.style.setProperty("--vh", `${size.height * 0.01}px`);
  const history = useHistory();

  const responseGoogle = async (res) => {
    await props.oauthGoogle(res.accessToken);
  };

  let googleClient;
  if (process.env.NODE_ENV === "development") {
    googleClient = process.env.REACT_APP_GOOGLE_AUTH_ID;
  } else {
    googleClient =
      "318894449479-83da2ctgvdlqim67222hbrasmon78qte.apps.googleusercontent.com";
  }

  const [webView, setWebView] = useState(false);
  useEffect(() => {
    var isWebview = /(Version\/\d+.*\/\d+.0.0.0 Mobile|; ?wv|(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari))/i.test(
      navigator.userAgent
    );
    setWebView(isWebview);
  }, []);

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
    if (!validateEmail(values.email)) {
      alert("Please enter a valid email address");
    } else if (values.email === "" || values.password === "") {
      alert("Empty fields are not allowed");
    } else {
      if (signUp) {
        await props.signUp({
          email: values.email,
          password: values.password,
        });
      } else {
        await props.signIn({
          email: values.email,
          password: values.password,
        });
      }
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      onSubmitSignUp();
    }
  };

  useEffect(() => {
    let fromPath;
    try {
      fromPath = props.location.state.fromPath.pathname;
    } catch {
      fromPath = "";
    }

    if (props.errorMessage === "nil") {
      if (fromPath) {
        history.push({
          pathname: fromPath,
          state: {
            authenticated: true,
            fromPath: "/login",
            status: "within-app",
          },
        });
        // history.goBack();
      } else {
        history.push({
          pathname: "/",
          state: {
            authenticated: true,
            fromPath: "/login",
            status: "within-app",
          },
        });
        // history.goBack();
      }
    } else if (props.errorMessage != "nil") {
      console.log("error", props.errorMessage);
    }
  }, [props.errorMessage]);

  if (webView) {
    return (
      <div className="formMainLocal">
        {signUp ? (
          <div className="loginButtonWrapperLocal">
            <TextField
              size="small"
              label="Sign Up with e-mail"
              id="outlined-start-adornment"
              className={clsx(classes.margin, classes.textField)}
              variant="outlined"
              value={values.email}
              onChange={handleChange("email")}
              onKeyDown={handleKeyDown}
            />
            <FormControl
              size="small"
              className={clsx(classes.margin, classes.textField)}
              variant="outlined"
            >
              <InputLabel htmlFor="outlined-adornment-password">
                Password
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password2"
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
              size="small"
              label="Sign In with e-mail"
              id="outlined-start-adornment"
              className={clsx(classes.margin, classes.textField)}
              variant="outlined"
              value={values.email}
              onChange={handleChange("email")}
              onKeyDown={handleKeyDown}
            />
            <FormControl
              className={clsx(classes.margin, classes.textField)}
              variant="outlined"
              size="small"
            >
              <InputLabel htmlFor="outlined-adornment-password">
                Password
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password3"
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
                      {values.showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
                labelWidth={70}
              />
            </FormControl>
          </div>
        )}

        {signUp ? (
          <p
            style={{
              fontSize: "14px",
              position: "absolute",
              bottom: "20px",
              left: "20px",
              color: "#3e4fae",
            }}
            onClick={() => setSignUp(!signUp)}
          >
            Signing In
          </p>
        ) : (
          <p
            style={{
              fontSize: "14px",
              position: "absolute",
              bottom: "20px",
              left: "20px",
              color: "#3e4fae",
            }}
            onClick={() => setSignUp(!signUp)}
          >
            Sign Up
          </p>
        )}

        <ForwardOutlinedIcon
          style={{
            position: "absolute",
            bottom: "11px",
            right: "20px",
            color: "black",
          }}
          fontSize="large"
          onClick={() => onSubmitSignUp()}
        />
      </div>
    );
  }

  return (
    <div className="formMain">
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
    </div>
  );
};

function mapStateToProps(state) {
  return {
    errorMessage: state.auth.errorMessage,
  };
}
export default compose(
  connect(mapStateToProps, actions),
  reduxForm({ form: "signin" })
)(Login);
