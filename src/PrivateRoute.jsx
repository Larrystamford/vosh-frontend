import React from "react";
import { Redirect, Route } from "react-router-dom";

const PrivateRoute = ({ component: Component, ...rest }) => {
  // Add your own authentication on the below line.
  const jwtToken = localStorage.getItem("JWT_TOKEN");

  const chooseRoute = (props) => {
    let authenticated;
    try {
      authenticated = props.location.state.authenticated;
    } catch {
      authenticated = "";
    }

    if (jwtToken || authenticated) {
      return <Component {...props} />;
    } else {
      return (
        <Redirect
          to={{ pathname: "/login", state: { fromPath: props.location } }}
        />
      );
    }
  };

  return <Route {...rest} render={(props) => chooseRoute(props)} />;
};

export default PrivateRoute;
