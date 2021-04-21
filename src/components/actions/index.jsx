import axios from "../../axios";
import {
  AUTH_SIGN_UP,
  AUTH_ERROR,
  AUTH_SIGN_OUT,
  AUTH_SIGN_IN,
  GET_SECRET,
} from "./types";

import { Exception } from "../../components/tracking/Tracker";

export const oauthGoogle = (data) => {
  return async (dispatch) => {
    const res = await axios.post("/v1/users/oauth/google", {
      access_token: data,
    });

    localStorage.setItem("USER_ID", res.data.userId);
    localStorage.setItem("USER_NAME", res.data.userName);
    localStorage.setItem("PICTURE", res.data.picture);
    localStorage.setItem("JWT_TOKEN", res.data.token);
    axios.defaults.headers.common["Authorization"] = res.data.token;

    dispatch({
      type: AUTH_SIGN_IN,
      payload: res.data.token,
    });
  };
};

export const signOut = () => {
  return (dispatch) => {
    localStorage.removeItem("JWT_TOKEN");
    axios.defaults.headers.common["Authorization"] = "";
    dispatch({
      type: AUTH_SIGN_OUT,
      payload: "",
    });
  };
};

export const signUp = (data) => {
  return async (dispatch) => {
    try {
      console.log("[ActionCreator] signUp called");
      const res = await axios.post("/v1/users/signup", data);

      localStorage.setItem("USER_ID", res.data.userId);
      localStorage.setItem("USER_NAME", res.data.userName);
      localStorage.setItem("PICTURE", res.data.picture);
      localStorage.setItem("JWT_TOKEN", res.data.token);
      axios.defaults.headers.common["Authorization"] = res.data.token;

      dispatch({
        type: AUTH_SIGN_UP,
        payload: res.data.token,
      });

      axios.defaults.headers.common["Authorization"] = res.data.token;
    } catch (err) {
      Exception(err, "email has already been registered");
      dispatch({
        type: AUTH_ERROR,
        payload: "This email has already been registered.",
      });
    }
  };
};

export const signIn = (data) => {
  return async (dispatch) => {
    try {
      console.log("[ActionCreator] signIn called");
      // Step 1: Use the data to make HTTP request to our back end
      const res = await axios.post("/v1/users/signin", data);

      localStorage.setItem("USER_ID", res.data.userId);
      localStorage.setItem("USER_NAME", res.data.userName);
      localStorage.setItem("PICTURE", res.data.picture);
      localStorage.setItem("JWT_TOKEN", res.data.token);
      axios.defaults.headers.common["Authorization"] = res.data.token;

      // Step 3: Dispatch user just sign up
      dispatch({
        type: AUTH_SIGN_IN,
        payload: res.data.token,
      });
    } catch (err) {
      Exception(err, "incorrect email or password");

      dispatch({
        type: AUTH_ERROR,
        payload: "Incorrect email or password",
      });
      console.error("err", err);
    }
  };
};

export const getSecret = () => {
  return async (dispatch) => {
    try {
      const res = await axios.get("/v1/users/secret");
      dispatch({
        type: GET_SECRET,
        payload: res.data.secret,
      });
    } catch (error) {
      Exception(error);
      console.error("err", error);
    }
  };
};
