import React, { useState, useEffect, useCallback } from "react";
import "./Profile.css";
import { Link } from "react-router-dom";
import { VideoGrid } from "./VideoGrid";
import { useGlobalState } from "../GlobalStates";

import { ProfileFeed } from "../feed/ProfileFeed";
import { useDidMountEffect } from "../customHooks/useDidMountEffect";

import FavoriteBorderOutlinedIcon from "@material-ui/icons/FavoriteBorderOutlined";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import WallpaperOutlinedIcon from "@material-ui/icons/WallpaperOutlined";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import Button from "@material-ui/core/Button";
import AllInclusiveIcon from "@material-ui/icons/AllInclusive";

import { useHistory } from "react-router";

import axios from "../axios";

import { PageView } from "../components/tracking/Tracker";

export const Profile = ({ match, location }) => {
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

  const [scrollView, setScrollView] = useState(false);
  const [viewIndex, setViewIndex] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [likeButtonToggle, setLikeButtonToggle] = useState(false);

  const [fakeFollowers, setFakeFollowers] = useState(0);
  const [fakeFollowings, setFakeFollowings] = useState(0);
  const [fakeLikes, setFakeLikes] = useState(0);

  // load data
  useEffect(() => {
    axios
      .get("/v1/users/getByUserName/" + match.params.id.toLowerCase())
      .then((response) => {
        let data = response.data[0];
        setImage(data.picture);
        setFollowings(data.followings);
        setFollowers(data.followers);
        setVideos(data.videos.reverse());
        setUsername(data.userName);
        setUserId(data._id);
        if (data.profileBio) {
          setProfileBio(data.profileBio);
        }

        // check if already following
        for (const follower of data.followers) {
          if (follower.id === localStorage.getItem("USER_ID")) {
            setIsFollowing(true);
          }
        }
        // redirect t profile if user clicks on own userName

        if (data._id === localStorage.getItem("USER_ID")) {
          history.push("/profile");
        }

        setFakeFollowers(Math.floor(Math.random() * 88) + 199);
        setFakeFollowings(Math.floor(Math.random() * 88) + 199);
        setFakeLikes(Math.floor(Math.random() * 322) + 432);
      });

    PageView();
  }, []);

  // save data
  useDidMountEffect(() => {
    // update other user followers
    if (isFollowing === true) {
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
    } else if (isFollowing === false) {
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
    setFollowers((prevState) => [
      ...prevState,
      {
        id: localStorage.getItem("USER_ID"),
        userName: localStorage.getItem("USER_NAME"),
        picture: localStorage.getItem("PICTURE"),
      },
    ]);
    setIsFollowing(true);
    setLikeButtonToggle(!likeButtonToggle);
  };

  const handleUnfollow = (i) => {
    setFollowers(followers.slice(0, followers.length - 1));
    setIsFollowing(false);
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
        <div className="profile">
          <div className="profile_wrapper">
            <div className="profile_top">
              <div className="profile_top_header">
                <div>
                  <div
                    className="profile_arrow_and_desc"
                    onClick={() => goBack()}
                  >
                    <ArrowBackIosIcon fontSize="large" />
                    <p style={{ fontSize: "16px" }}>Back</p>
                  </div>
                  <MoreHorizIcon style={{ color: "white" }} fontSize="large" />
                </div>
              </div>
              <div className="profile_top_image_name">
                <div className="profile_top_image">
                  {image ? (
                    <img
                      src={image}
                      className="profile_top_image_circular"
                      alt="temp avatar"
                    />
                  ) : null}
                </div>
                <div className="profile_top_name">
                  <p>@{username}</p>
                </div>
              </div>
              <div className="profile_top_statistics">
                <div className="profile_top_statistics_details">
                  <p style={{ fontSize: "18px", fontWeight: "500" }}>
                    {fakeFollowings === 0 ? (
                      <AllInclusiveIcon />
                    ) : (
                      followings.length + fakeFollowings
                    )}
                  </p>
                  <p>Following</p>
                </div>
                <div className="profile_top_statistics_details">
                  <p style={{ fontSize: "18px", fontWeight: "500" }}>
                    {fakeFollowers === 0 ? (
                      <AllInclusiveIcon />
                    ) : (
                      followers.length + fakeFollowers
                    )}
                  </p>
                  <p>Followers</p>
                </div>
                <div className="profile_top_statistics_details">
                  <p style={{ fontSize: "18px", fontWeight: "500" }}>
                    {fakeLikes === 0 ? <AllInclusiveIcon /> : fakeLikes}
                  </p>
                  <p>Likes</p>
                </div>
              </div>
              <div className="profile_top_follow">
                {isFollowing ? (
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handleUnfollow}
                  >
                    Following
                  </Button>
                ) : (
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleFollow}
                  >
                    Follow
                  </Button>
                )}
              </div>
              <div className="profile_top_description">
                <span style={{ width: "80%", textAlign: "center" }}>
                  {profileBio}
                </span>
              </div>
              <div className="profile_top_selector">
                <div className="profile_icon_and_name">
                  <WallpaperOutlinedIcon style={{ color: "black" }} />
                  <p style={{ color: "black" }}>gallery</p>
                </div>
                <div className="profile_icon_and_name">
                  <FavoriteBorderOutlinedIcon style={{ color: "gray" }} />
                  <p style={{ color: "gray" }}>saved</p>
                </div>
              </div>
            </div>
            <div className="profile_bottom">
              <VideoGrid videos={videos} handleChangeView={handleChangeView} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
