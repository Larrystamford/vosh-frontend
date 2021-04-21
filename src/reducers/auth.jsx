import {
  AUTH_SIGN_UP,
  AUTH_ERROR,
  AUTH_SIGN_OUT,
  AUTH_SIGN_IN,
} from "../components/actions/types";
import actions from "redux-form/lib/actions";

const DEFAULT_STATE = {
  isAuthenticated: false,
  token: "",
  message: "",
  errorMessage: "",
};

export default (state = DEFAULT_STATE, action) => {
  // console.log("action:", action.type);
  // console.log("payloadL ", action.payload);
  switch (action.type) {
    case AUTH_SIGN_UP:
      console.log("AUTH_SIGN_UP action");

      return {
        ...state,
        token: action.payload,
        isAuthenticated: true,
        errorMessage: "nil",
      };

    case AUTH_SIGN_IN:
      console.log("[AUTH_SIGN_IN]");
      return {
        ...state,
        token: action.payload,
        isAuthenticated: true,
        errorMessage: "nil",
      };

    case AUTH_ERROR:
      console.log("[AuthReducer]  got an AUTH_ERROR action");
      return {
        ...state,
        errorMessage: action.payload,
      };

    case AUTH_SIGN_OUT:
      return {
        ...state,
        token: action.payload,
        isAuthenticated: false,
        errorMessage: "nil",
      };

    default:
      console.log("default");
      return state;
  }
};
