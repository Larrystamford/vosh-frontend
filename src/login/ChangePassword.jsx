import React, { useEffect, useState } from "react";
import "./Login.css";

import { useHistory } from "react-router";
import { makeStyles } from "@material-ui/core/styles";

import clsx from "clsx";
import Button from "@material-ui/core/Button";
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

export const ChangePassword = (props) => {
  const history = useHistory();
  const classes = useStyles();

  const [submitClicked, setSubmitClicked] = useState(false);

  const [values, setValues] = useState({
    password: "",
    password2: "",
    password3: "",
    showPassword: false,
    showPassword2: false,
    showPassword3: false,
  });

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const onSubmit = async () => {
    setSubmitClicked(true);

    try {
      const isMatch = await axios.post("/v1/users/checkCurrentPassword", {
        userId: localStorage.getItem("USER_ID"),
        currentPassword: values.password,
      });

      if (isMatch.data) {
        if (values.password2.length < 8 || values.password3.length < 8) {
          alert("Password needs to be at least 8 chars long");
        } else {
          if (values.password2 != values.password3) {
            alert("New passwords do not match");
          } else {
            await axios.post("/v1/users/changePassword", {
              userId: localStorage.getItem("USER_ID"),
              newPassword: values.password3,
            });

            alert("Successfully changed password");

            setValues({
              password: "",
              password2: "",
              password3: "",
              showPassword: false,
              showPassword2: false,
              showPassword3: false,
            });
          }
        }
      } else {
        alert("Wrong current password entered");
      }
    } catch (e) {
      console.log("change password error");
    }

    setSubmitClicked(false);
  };
  const handleKeyDown = async (event) => {
    if (event.key === "Enter") {
      await onSubmit();
    }
  };

  const [focused, setFocused] = useState(false);
  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };
  const [focused2, setFocused2] = useState(false);
  const handleClickShowPassword2 = () => {
    setValues({ ...values, showPassword2: !values.showPassword2 });
  };
  const [focused3, setFocused3] = useState(false);
  const handleClickShowPassword3 = () => {
    setValues({ ...values, showPassword3: !values.showPassword3 });
  };

  return (
    <div className="formMainLocal" style={focused ? { zIndex: -1 } : null}>
      <div className="verifiedMessageWrapper">
        <p className="verified_WelcomeWord">VOSH</p>
        <p className="verified_HeaderText">Password Change</p>
      </div>

      <div className="changePassword_wrapper">
        <FormControl
          className={clsx(classes.margin, classes.textField)}
          variant="outlined"
          style={{ backgroundColor: "white" }}
        >
          <InputLabel htmlFor="outlined-adornment-password">
            Old Password
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
            labelWidth={110}
          />
        </FormControl>

        <FormControl
          className={clsx(classes.margin, classes.textField)}
          variant="outlined"
          style={{ backgroundColor: "white" }}
        >
          <InputLabel htmlFor="outlined-adornment-password">
            New Password
          </InputLabel>
          <OutlinedInput
            id="outlined-adornment-password8"
            type={values.showPassword2 ? "text" : "password"}
            value={values.password2}
            onChange={handleChange("password2")}
            onKeyDown={handleKeyDown}
            onFocus={() => setFocused2(true)}
            onBlur={() => setFocused2(false)}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword2}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {values.showPassword2 ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            }
            labelWidth={110}
          />
        </FormControl>

        <FormControl
          className={clsx(classes.margin, classes.textField)}
          variant="outlined"
          style={{ backgroundColor: "white" }}
        >
          <InputLabel htmlFor="outlined-adornment-password">
            Re-enter new Password
          </InputLabel>
          <OutlinedInput
            id="outlined-adornment-password8"
            type={values.showPassword3 ? "text" : "password"}
            value={values.password3}
            onChange={handleChange("password3")}
            onKeyDown={handleKeyDown}
            onFocus={() => setFocused3(true)}
            onBlur={() => setFocused3(false)}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword3}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {values.showPassword3 ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            }
            labelWidth={175}
          />
        </FormControl>
      </div>

      {focused ? null : (
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
      )}

      {focused ? null : (
        <p
          style={
            submitClicked
              ? {
                  fontSize: "16px",
                  position: "absolute",
                  bottom: "30px",
                  right: "30px",
                  color: "#3e4fcc",
                  fontWeight: "bold",
                  opacity: 0.3,
                }
              : {
                  fontSize: "16px",
                  position: "absolute",
                  bottom: "30px",
                  right: "30px",
                  color: "#3e4fae",
                  fontWeight: "bold",
                }
          }
          onClick={onSubmit}
        >
          Done
        </p>
      )}
    </div>
  );
};
