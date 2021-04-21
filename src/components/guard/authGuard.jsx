import React, { Component } from "react";
import { connect } from "react-redux";

export default (OriginalComponent) => {
  class MixedComponent extends Component {
    componentDidMount() {
      //When user is authenticated
      if (this.props.isAuth && this.props.jwtToken) {
        console.log("User is authenticated and access is granted");
      } else {
        console.log("User is not authenticated, access delined.");
        this.props.history.push("/");
      }
    }

    componentDidUpdate() {
      // When user is authenticated
      if (this.props.isAuth && this.props.jwtToken) {
        console.log("User is authenticated and access is granted");
      } else {
        console.log("User is not authenticated, access delined.");
        this.props.history.push("/");
      }
    }

    render() {
      return <OriginalComponent {...this.props} />;
    }
  }

  function mapStateToProps(state) {
    return {
      isAuth: state.auth.isAuthenticated,
      jwtToken: state.auth.token,
    };
  }
  return connect(mapStateToProps)(MixedComponent);
};
