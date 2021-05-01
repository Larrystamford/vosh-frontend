import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import "./App.css";

import { useWindowSize } from "./customHooks/useWindowSize";

import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import reduxThunk from "redux-thunk";
import reducers from "./reducers/index";
import axios from "./axios";
import { useGlobalState } from "./GlobalStates";

import PrivateRoute from "./PrivateRoute";
import ConditionalRoute from "./ConditionalRoute";

import Login from "./login/Login";
import { Logout } from "./login/Logout";
import { Verified } from "./verified/Verified";
import { Feed } from "./feed/Feed";
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
import { HappySecondAnniversary } from "./utils_pages/anniversary/HappySecondAnniversary";

import ReactGA from "react-ga";
import { Exception } from "./components/tracking/Tracker";

const jwtToken = localStorage.getItem("JWT_TOKEN");
axios.defaults.headers.common["Authorization"] = jwtToken;

function App() {
  const size = useWindowSize();
  document.documentElement.style.setProperty("--vh", `${size.height * 0.01}px`);

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
          if (res.data.length == 0) {
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

  if (size.width > 1100 && window.location.pathname != "/privacy-policy") {
    return <ComputerLanding />;
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
        <Switch>
          <Route path="/valentines" exact component={HappySecondAnniversary} />
        </Switch>

        <Route path="/" component={ServiceWorkerWrapper} />

        <Route
          path={[
            "/",
            "/discover",
            "/inbox",
            "/profile",
            "/profile/:id",
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
            "/profile",
            "/review",
            "/about-us",
            "/profile/:id",
            "/room/:id",
          ]}
          exact
          component={Feed}
        />

        <Route path="/" component={InstallPWA} />

        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/discover" component={Discover} />
          <Route path="/upload" component={Upload} />
          <Route path="/profile" exact component={PersonalProfile} />
          <Route path="/profile/:id" component={Profile} />
          <Route path="/video/:id" component={VideoIndividual} />
          <Route path="/inbox" component={Inbox} />
          <Route path="/room/:id" component={Room} />
          <Route path="/review" component={Review} />
          <Route path="/about-us" component={AboutUs} />
          <Route path="/getVerified" component={Verified} />
          <Route path="/logout" exact component={Logout} />

          <Route component={PageNoExist} />
        </Switch>
      </Router>
    </Provider>
  );
}

export default App;

// <Route path="/" component={OfflineDetection} />
