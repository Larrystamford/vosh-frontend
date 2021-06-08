import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";

import { useWindowSize } from "./customHooks/useWindowSize";

import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import reduxThunk from "redux-thunk";
import reducers from "./reducers/index";
import axios from "./axios";
import { useGlobalState } from "./GlobalStates";

import Login from "./login/Login";
import { Logout } from "./login/Logout";
import { ProProfile } from "./profile/pro/ProProfile";
import { SetTheme } from "./profile/pro/SetTheme";
import { NonSlidingBio } from "./profile/pro/NonSlidingBio";
import StayLoginFormPage from "./login/StayLoginFormPage";
import { ChangePassword } from "./login/ChangePassword";
import { EditProProfile } from "./profile/pro/EditProProfile";
import { ContentTagging } from "./profile/pro/ContentTagging";
import { ProEdit } from "./profile/pro/ProEdit";
import { Verified } from "./verified/Verified";
import { VerifiedUsername } from "./verified/VerifiedUsername";
import { FeedRefactored } from "./feed/FeedRefactored";
import { Discover } from "./discover/Discover";
import { BottomNavigationBar } from "./components/BottomNavigationBar";
import { PersonalProfile } from "./profile/PersonalProfile";
import { Profile } from "./profile/Profile";
import { VideoIndividual } from "./feed/VideoIndividual";
import { Inbox } from "./inbox/Inbox";
import { Room } from "./inbox/Room";
import { PageNoExist } from "./utils_pages/PageNoExist";
import { AboutUs } from "./utils_pages/AboutUs";
import { Review } from "./profile/Review";
import { Upload } from "./upload/Upload";
import { InstallPWA } from "./components/pwa/InstallPWA";
import { ServiceWorkerWrapper } from "./ServiceWorkerWrapper";
import { OfflineDetection } from "./utils/OfflineDetection";

import { ComputerLanding } from "./utils_pages/ComputerLanding";
import { ProfileDesktop } from "./utils_pages/ProfileDesktop";

import ReactGA from "react-ga";
import { Exception } from "./components/tracking/Tracker";

const jwtToken = localStorage.getItem("JWT_TOKEN");
axios.defaults.headers.common["Authorization"] = jwtToken;
axios.defaults.headers.common = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

function App() {
  const size = useWindowSize();
  document.documentElement.style.setProperty("--vh", `${size.height * 0.01}px`);

  const appRef = useRef({
    userProfileName: "/",
  });

  const [userInfo, setUserInfo] = useGlobalState("hasUserInfo");
  useEffect(() => {
    if (!localStorage.getItem("USER_ID")) {
      setUserInfo(false);
    } else {
      ReactGA.set({
        userId: localStorage.getItem("USER_ID"),
      });

      axios
        .get("/v1/users/getUserInfo/" + localStorage.getItem("USER_ID"))
        .then((res) => {
          // account does not exist
          if (res.data.length === 0) {
            localStorage.removeItem("JWT_TOKEN");
            localStorage.removeItem("PICTURE");
            localStorage.removeItem("USER_ID");
            localStorage.removeItem("USER_NAME");
            setUserInfo(false);
          } else {
            setUserInfo(res.data[0]);
          }
        })
        .catch((err) => {
          Exception(err + "failed to get user address on app load");
        });
    }
    
  }, []);

  if (
    size.width > 1100 &&
    window.location.pathname != "/privacy-policy" &&
    window.location.pathname == "/"
  ) {
    return <ComputerLanding currentLocation={window.location.pathname} />;
  } else if (size.width > 1100) {
    return <ProfileDesktop currentLocation={window.location.pathname} />;
  }

  return (
    <Provider
      store={createStore(
        reducers,
        {
          auth: {
            token: jwtToken,
            isAuthenticated: jwtToken ? true : false,
          },
        },
        applyMiddleware(reduxThunk)
      )}
    >
      <Router>
        <Route path="/" component={ServiceWorkerWrapper} />
        <Route
          path={[
            "/",
            "/discover",
            "/inbox",
            // "/profile",
            // "/profile/:id",
            "/video/:id",
          ]}
          exact
          component={BottomNavigationBar}
        />
        <Route
          path={[
            "/",
            "/discover",
            "/inbox",
            // "/profile",
            "/review",
            "/about-us",
            // "/profile/:id",
            "/room/:id",
          ]}
          exact
          component={FeedRefactored}
        />

        <Switch>
          <Route path="/video/:id" component={VideoIndividual} />
          <Route path="/getStarted" component={Verified} />
          <Route path="/changeUsername" component={VerifiedUsername} />
          <Route path="/profile" component={EditProProfile} />
          <Route path="/ProEdit" component={ProEdit} />
          <Route path="/ContentTagging" component={ContentTagging} />
          <Route path="/profileBio" component={NonSlidingBio} />
          <Route path="/theme" component={SetTheme} />
          <Route path="/login" component={StayLoginFormPage} />
          <Route path="/changePassword" component={ChangePassword} />
          <Route path="/discover" component={Discover} />
          <Route path="/upload" component={Upload} />
          <Route path="/inbox" component={Inbox} />
          <Route path="/room/:id" component={Room} />
          <Route path="/review" component={Review} />
          <Route path="/about-us" component={AboutUs} />
          <Route path="/logout" exact component={Logout} />
          <Route path="/404" exact component={PageNoExist} />
          <Route path="/" exact />
          <Route component={EditProProfile} />
        </Switch>
      </Router>
    </Provider>
  );
}

export default App;

// <Route path="/" component={OfflineDetection} />

// <Route path="/" component={InstallPWA} />

// <Route path="/profile" exact component={PersonalProfile} />
// <Route path="/profile/:id" component={Profile} />
