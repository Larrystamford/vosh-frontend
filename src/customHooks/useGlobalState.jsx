import React, { useReducer, useContext } from "react";
import { act } from "react-dom/test-utils";

/* Action Types */
const SET_LOG = "SET_LOG";

/* Define a context and a reducer for updating the context */
const GlobalStateContext = React.createContext(null);

const initialState = {
  sound: {
    loggedIn: "false",
  },
};

const globalStateReducer = (state, action) => {
  switch (action.type) {
    case SET_LOG:
      return {
        log: { ...action.payload },
      };

    default:
      return state;
  }
};

/* Export a component to provide the context to its children. This is used in our _app.js file */

export const GlobalStateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(globalStateReducer, initialState);
  return (
    <GlobalStateContext.Provider value={[state, dispatch]}>
      {children}
    </GlobalStateContext.Provider>
  );
};

/* 
Default export is a hook that provides a simple API for updating the global state. 
This also allows us to keep all of this state logic in this one file
*/

const useGlobalState = () => {
  const [state, dispatch] = useContext(GlobalStateContext);

  const setLog = ({ loggedIn }) => {
    dispatch({
      type: SET_LOG,
      payload: {
        loggedIn,
      },
    });
  };

  return {
    setLog,
    log: { ...state.log },
  };
};

export default useGlobalState;