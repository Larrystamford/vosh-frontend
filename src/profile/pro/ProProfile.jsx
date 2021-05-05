import React, { useState, useEffect, useCallback } from "react";
import "./ProProfile.css";
import { Link } from "react-router-dom";
import { VideoGrid } from "../VideoGrid";
import { useGlobalState } from "../../GlobalStates";
import { Snackbar } from "@material-ui/core";

import { ProfileFeed } from "../../feed/ProfileFeed";
import { useDidMountEffect } from "../../customHooks/useDidMountEffect";
import { convertSocialTypeToImage } from "../../helpers/CommonFunctions";

import { StaySlidingSetUp } from "../../login/StaySlidingSetUp";

import FavoriteBorderOutlinedIcon from "@material-ui/icons/FavoriteBorderOutlined";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import WallpaperOutlinedIcon from "@material-ui/icons/WallpaperOutlined";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import Button from "@material-ui/core/Button";
import AllInclusiveIcon from "@material-ui/icons/AllInclusive";
import ClearOutlinedIcon from "@material-ui/icons/ClearOutlined";
import ShareIcon from "@material-ui/icons/Share";

import { useHistory } from "react-router";

import axios from "../../axios";

import { PageView } from "../../components/tracking/Tracker";

export const ProProfile = ({ match, location }) => {
  const history = useHistory();
  const [globalModalOpened, setGlobalModalOpened] = useGlobalState(
    "globalModalOpened"
  );
  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");
  const [image, setImage] = useState("");
  const [followers, setFollowers] = useState([]);
  const [followings, setFollowings] = useState([]);
  const [videos, setVideos] = useState([]);
  const [profileBio, setProfileBio] = useState("");
  const [socialAccounts, setSocialAccounts] = useState([]);

  const [scrollView, setScrollView] = useState(false);
  const [viewIndex, setViewIndex] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [likeButtonToggle, setLikeButtonToggle] = useState(false);

  const [voshBanner, setVoshBanner] = useState(true);

  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [loginCheck, setLoginCheck] = useState(true);
  const handleLoginOpen = () => {
    setLoginCheck(true);
  };
  const handleLoginClose = () => {
    setLoginCheck(false);
  };

  // load data
  useEffect(() => {
    const windowLocationName = window.location.pathname.slice(1);
    axios.get("/v1/users/userNameIsPro/" + windowLocationName).then((res) => {
      if (res.data.userNameIsPro) {
        axios
          .get("/v1/users/getByUserName/" + windowLocationName)
          .then((response) => {
            let data = response.data[0];
            setImage(data.picture);
            setFollowings(data.followings);
            setFollowers(data.followers);
            setVideos(data.videos.reverse());
            setUsername(data.userName);
            setUserId(data._id);
            setSocialAccounts(data.socialAccounts);
            if (data.profileBio) {
              setProfileBio(data.profileBio);
            }

            // set theme up
            // theme1 to theme6 -> front end helper function to return the respective colors
            document.documentElement.style.setProperty(
              "--follow_button_color",
              "blue"
            );
            document.documentElement.style.setProperty(
              "--following_button_color",
              "red"
            );

            // check if already following
            for (const follower of data.followers) {
              if (follower.id == localStorage.getItem("USER_ID")) {
                setIsFollowing(true);
              }
            }
            // redirect t profile if user clicks on own userName

            if (data._id == localStorage.getItem("USER_ID")) {
              history.push("/ProProfile");
            }
          });

        PageView();
      } else {
        history.push("/404");
      }
    });
  }, []);

  // save data
  useDidMountEffect(() => {
    if (localStorage.getItem("USER_ID")) {
      if (isFollowing == true) {
        // update other user followers
        axios
          .put("/v1/users/pushFollowers/" + userId, {
            id: localStorage.getItem("USER_ID"),
            userName: localStorage.getItem("USER_NAME"),
            picture: localStorage.getItem("PICTURE"),
          })
          .then((response) => {
            console.log(response);
          });
        // update personal followings
        axios
          .put("/v1/users/pushFollowings/" + localStorage.getItem("USER_ID"), {
            id: userId,
            userName: username,
            picture: image,
          })
          .then((response) => {
            console.log(response);
          });
      } else if (isFollowing == false) {
        axios
          .put("/v1/users/pullFollowers/" + userId, {
            id: localStorage.getItem("USER_ID"),
            userName: localStorage.getItem("USER_NAME"),
            picture: localStorage.getItem("PICTURE"),
          })
          .then((response) => {
            console.log(response);
          });
        // update personal followings
        axios
          .put("/v1/users/pullFollowings/" + localStorage.getItem("USER_ID"), {
            id: userId,
            userName: username,
            picture: image,
          })
          .then((response) => {
            console.log(response);
          });
      }
    } else {
      setIsLoggedIn(false);
    }
  }, [likeButtonToggle]);

  const handleChangeView = (i) => {
    if (scrollView) {
      window.history.back();
    } else {
      window.history.pushState(
        {
          scrollView: "scrollView",
        },
        "",
        ""
      );
    }

    setScrollView(!scrollView);
    setViewIndex(i);
  };

  const handleScrollViewPop = useCallback(() => {
    setScrollView(false);
  }, []);

  useEffect(() => {
    if (globalModalOpened) {
      window.removeEventListener("popstate", handleScrollViewPop);
    } else {
      window.addEventListener("popstate", handleScrollViewPop);
    }

    // cleanup this component
    return () => {
      window.removeEventListener("popstate", handleScrollViewPop);
    };
  }, [globalModalOpened]);

  const handleFollow = (i) => {
    if (localStorage.getItem("USER_ID")) {
      setFollowers((prevState) => [
        ...prevState,
        {
          id: localStorage.getItem("USER_ID"),
          userName: localStorage.getItem("USER_NAME"),
          picture: localStorage.getItem("PICTURE"),
        },
      ]);
      setIsFollowing(true);
    }
    setLikeButtonToggle(!likeButtonToggle);
  };

  const handleUnfollow = (i) => {
    if (localStorage.getItem("USER_ID")) {
      setFollowers(followers.slice(0, followers.length - 1));
      setIsFollowing(false);
    }
    setLikeButtonToggle(!likeButtonToggle);
  };

  const goBack = () => {
    history.goBack();
  };

  return (
    <>
      {scrollView ? (
        <ProfileFeed
          videos={videos}
          viewIndex={viewIndex}
          handleChangeView={handleChangeView}
        />
      ) : (
        <div className="ProProfile">
          <div className="pro_profile_top_header"></div>
          <div className="pro_profile_top">
            <div className="pro_profile_top_left">
              <div className="pro_profile_top_image_name">
                <div className="pro_profile_top_image">
                  {image ? (
                    <img
                      src={image}
                      className="pro_profile_top_image_circular"
                      alt="temp avatar"
                    />
                  ) : null}
                </div>
                <div className="pro_profile_top_name">
                  <p>@{username}</p>
                </div>
              </div>
              <div className="pro_profile_top_follow">
                {isFollowing ? (
                  <div
                    className="pro_profile_top_following_button"
                    onClick={handleUnfollow}
                  >
                    <p style={{ color: "white" }}>Following</p>
                  </div>
                ) : (
                  <div
                    className="pro_profile_top_follow_button"
                    onClick={handleFollow}
                  >
                    <p style={{ color: "white" }}>Follow</p>
                  </div>
                )}
              </div>
            </div>
            <div className="pro_profile_top_right">
              <div className="pro_profile_top_social_medias">
                {socialAccounts
                  .slice(0, 5)
                  .map(({ socialType, socialLink }) => (
                    <img
                      src={convertSocialTypeToImage(socialType)}
                      style={{ height: 23, margin: 10 }}
                      onClick={() => window.open(socialLink, "_blank")}
                    />
                  ))}
              </div>
              <div className="pro_profile_top_social_medias">
                {socialAccounts
                  .slice(5, 10)
                  .map(({ socialType, socialLink }) => (
                    <img
                      src={convertSocialTypeToImage(socialType)}
                      style={{ height: 23, margin: 10 }}
                      onClick={() => window.open(socialLink, "_blank")}
                    />
                  ))}
              </div>
              <div className="pro_profile_top_description">
                <span className="pro_profile_top_profileBio">{profileBio}</span>
              </div>
              <div className="pro_profile_top_linker">
                <div className="pro_profile_top_link_div">
                  <p>AMAZON SHOPPING FINDS</p>
                </div>
                <div className="pro_profile_top_link_div">
                  <p>AMAZON SHOPPING FINDS</p>
                </div>
                <div className="pro_profile_top_link_div">
                  <p>AMAZON SHOPPING FINDS</p>
                </div>
                <div className="pro_profile_top_link_div">
                  <p>AMAZON SHOPPING FINDS</p>
                </div>
                <div className="pro_profile_top_link_div">
                  <p>AMAZON SHOPPING FINDS</p>
                </div>
                <div className="pro_profile_top_link_div">
                  <p>AMAZON SHOPPING FINDS</p>
                </div>
                <div className="pro_profile_top_link_div">
                  <p>AMAZON SHOPPING FINDS</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pro_profile_top_selector">
            <div className="pro_profile_icon_and_name">
              <WallpaperOutlinedIcon style={{ color: "black" }} />
              <p style={{ color: "black" }}>gallery</p>
            </div>
            <div className="pro_profile_icon_and_name">
              <FavoriteBorderOutlinedIcon style={{ color: "gray" }} />
              <p style={{ color: "gray" }}>saved</p>
            </div>
            <div className="pro_profile_icon_and_name">
              <FavoriteBorderOutlinedIcon style={{ color: "gray" }} />
              <p style={{ color: "gray" }}>saved</p>
            </div>
            <div className="pro_profile_icon_and_name">
              <FavoriteBorderOutlinedIcon style={{ color: "gray" }} />
              <p style={{ color: "gray" }}>saved</p>
            </div>
            <div className="pro_profile_icon_and_name">
              <FavoriteBorderOutlinedIcon style={{ color: "gray" }} />
              <p style={{ color: "gray" }}>saved</p>
            </div>
            <div className="pro_profile_icon_and_name">
              <FavoriteBorderOutlinedIcon style={{ color: "gray" }} />
              <p style={{ color: "gray" }}>saved</p>
            </div>
            <div className="pro_profile_icon_and_name">
              <FavoriteBorderOutlinedIcon style={{ color: "gray" }} />
              <p style={{ color: "gray" }}>saved</p>
            </div>
            <div className="pro_profile_icon_and_name">
              <FavoriteBorderOutlinedIcon style={{ color: "gray" }} />
              <p style={{ color: "gray" }}>saved</p>
            </div>
            <div className="pro_profile_icon_and_name">
              <FavoriteBorderOutlinedIcon style={{ color: "gray" }} />
              <p style={{ color: "gray" }}>saved</p>
            </div>
            <div className="pro_profile_icon_and_name">
              <FavoriteBorderOutlinedIcon style={{ color: "gray" }} />
              <p style={{ color: "gray" }}>saved</p>
            </div>
            <div className="pro_profile_icon_and_name">
              <FavoriteBorderOutlinedIcon style={{ color: "gray" }} />
              <p style={{ color: "gray" }}>saved</p>
            </div>
            <div className="pro_profile_icon_and_name">
              <FavoriteBorderOutlinedIcon style={{ color: "gray" }} />
              <p style={{ color: "gray" }}>saved</p>
            </div>
            <div className="pro_profile_icon_and_name">
              <FavoriteBorderOutlinedIcon style={{ color: "gray" }} />
              <p style={{ color: "gray" }}>saved</p>
            </div>
          </div>

          <div className="pro_profile_bottom">
            <VideoGrid videos={videos} handleChangeView={handleChangeView} />
          </div>

          {voshBanner && (
            <div
              className="pro_profile_bottom_snackbar_temp"
              onClick={() => {
                history.push("/getVerified");
              }}
            ></div>
          )}

          <Snackbar
            open={voshBanner}
            message="Create Your Vosh Website Now"
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            action={
              <React.Fragment>
                <ClearOutlinedIcon onClick={() => setVoshBanner(false)} />
              </React.Fragment>
            }
          />

          {isLoggedIn ? null : (
            <StaySlidingSetUp
              open={loginCheck}
              handleClose={handleLoginClose}
            />
          )}
        </div>
      )}
    </>
  );
};
