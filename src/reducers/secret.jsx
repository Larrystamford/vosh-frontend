import { GET_SECRET } from "../components/actions/types";

const DEFAULT_STATE = {
  secret: "",
};

export default (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case GET_SECRET:
      console.log("[AuthReducer]  got an AUTH_SIGN_UP action");

      return {
        ...state,
        secret: action.payload,
      };

    default:
      return state;
  }
};
