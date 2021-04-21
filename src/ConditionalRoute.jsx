import React from "react";
import { Redirect, Route } from "react-router-dom";

const ConditionalRoute = ({ component: Component, ...rest }) => {
  // Add your own authentication on the below line.
  const jwtToken = localStorage.getItem("JWT_TOKEN");

  const chooseRoute = (props) => {
    let conditional;
    try {
      conditional = props.location.state.file;
    } catch {
      conditional = "";
    }

    if (conditional) {
      return <Component {...props} />;
    } else {
      return <Redirect to={{ pathname: "/", state: "within-app" }} />;
    }
  };

  return <Route {...rest} render={(props) => chooseRoute(props)} />;
};

export default ConditionalRoute;
