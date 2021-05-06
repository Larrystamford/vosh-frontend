import React, { useState, useEffect, useCallback, useRef } from "react";
import "./ProProfile.css";
import { Link } from "react-router-dom";
import { VideoGrid } from "../VideoGrid";
import { useGlobalState } from "../../GlobalStates";
import { Snackbar } from "@material-ui/core";
import { StaySlidingSetUp } from "../../login/StaySlidingSetUp";
import { CaptionEdit } from "../CaptionEdit";
import { convertSocialTypeToImage } from "../../helpers/CommonFunctions";

import { ProfileFeed } from "../../feed/ProfileFeed";
import { useDidMountEffect } from "../../customHooks/useDidMountEffect";

import FavoriteBorderOutlinedIcon from "@material-ui/icons/FavoriteBorderOutlined";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import WallpaperOutlinedIcon from "@material-ui/icons/WallpaperOutlined";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import Button from "@material-ui/core/Button";
import AllInclusiveIcon from "@material-ui/icons/AllInclusive";
import ClearOutlinedIcon from "@material-ui/icons/ClearOutlined";
import ShareIcon from "@material-ui/icons/Share";
import CreateIcon from "@material-ui/icons/Create";

import { useHistory } from "react-router";

import axios from "../../axios";

import { PageView } from "../../components/tracking/Tracker";

export const EditProProfile = ({ match, location }) => {
  const history = useHistory();
  const [globalModalOpened, setGlobalModalOpened] = useGlobalState(
    "globalModalOpened"
  );
  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");
  const [image, setImage] = useState("");
  const [followers, setFollowers] = useState([]);
  const [followings, setFollowings] = useState([]);
  const [proVideos, setProVideos] = useState([]);
  const [profileBio, setProfileBio] = useState("");
  const [socialAccounts, setSocialAccounts] = useState([]);
  const [proLinks, setProLinks] = useState([]);

  const [scrollView, setScrollView] = useState(false);
  const [viewIndex, setViewIndex] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [likeButtonToggle, setLikeButtonToggle] = useState(false);

  // login in functions
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [loginCheck, setLoginCheck] = useState(true);
  const handleLoginOpen = () => {
    setLoginCheck(true);
  };
  const handleLoginClose = () => {
    setLoginCheck(false);
  };

  // change profile picture
  const hiddenFileInput = useRef(null);
  const handleUploadClick = (event) => {
    hiddenFileInput.current.click();
  };
  const handleFileUpload = async (file) => {
    const mediaType = file.type.split("/")[0];
    if (mediaType != "image") {
      alert("Please upload images only");
    } else {
      const imageUrl = await getFileUrl(file);
      await axios.put("/v1/users/update/" + localStorage.getItem("USER_ID"), {
        picture: imageUrl,
      });
      setImage(imageUrl);
    }
  };
  const getFileUrl = async (file) => {
    let formData = new FormData();
    formData.append("media", file);

    const result = await axios.post("/v1/upload/aws", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return result.data.url;
  };

  // caption change
  const [openCaption, setOpenCaption] = useState(false);
  const handleCaptionOpen = () => {
    setOpenCaption(true);
    window.history.pushState(
      {
        caption: "caption",
      },
      "",
      ""
    );
  };
  const handleCaptionClose = () => {
    setOpenCaption(false);
    window.history.back();
  };
  useDidMountEffect(() => {
    const handleCaptionPop = () => {
      setOpenCaption(false);
    };

    if (openCaption) {
      window.addEventListener("popstate", handleCaptionPop);
    } else {
      window.removeEventListener("popstate", handleCaptionPop);
    }
  }, [openCaption]);

  // load data
  useEffect(() => {
    const userId = localStorage.getItem("USER_ID");
    if (userId) {
      axios.get("/v1/users/get/" + userId).then((response) => {
        let data = response.data[0];
        setImage(data.picture);
        setFollowings(data.followings);
        setFollowers(data.followers);
        setProVideos(data.proVideos.reverse());
        setUsername(data.userName);
        setUserId(data._id);
        setSocialAccounts(data.socialAccounts);
        setProLinks(data.proLinks);

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
      });
    } else {
      setIsLoggedIn(false);
    }

    PageView();
  }, []);

  // save data
  useDidMountEffect(() => {
    // update other user followers
    if (isFollowing == true) {
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

  const goBack = () => {
    history.goBack();
  };

  return (
    <>
      {scrollView ? (
        <ProfileFeed
          videos={proVideos}
          viewIndex={viewIndex}
          handleChangeView={handleChangeView}
        />
      ) : (
        <div className="ProProfile">
          <div className="pro_profile_top">
            <div className="pro_profile_top_header"></div>
            <div className="pro_profile_top_with_left_right">
              <div className="pro_profile_top_left">
                <div className="pro_profile_top_image_name">
                  <div className="pro_profile_top_image">
                    {image ? (
                      <div
                        style={{ position: "relative" }}
                        onClick={handleUploadClick}
                      >
                        <img
                          src={image}
                          className="pro_profile_top_image_circular"
                          alt="temp avatar"
                        />
                        <div className="edit_pro_profile_edit_image_circle">
                          <CreateIcon
                            className="edit_pro_profile_edit_image"
                            style={{ fontSize: 14 }}
                          />
                        </div>
                        <input
                          ref={hiddenFileInput}
                          type="file"
                          name="file"
                          onChange={(e) => {
                            handleFileUpload(e.target.files[0]);
                          }}
                        />
                      </div>
                    ) : null}
                  </div>
                  <div className="pro_profile_top_name">
                    <p>@{username}</p>
                  </div>
                </div>
                <div className="pro_profile_top_follow">
                  <div className="edit_pro_profile_followers_flex_box">
                    <p style={{ fontSize: "16px", fontWeight: "700" }}>
                      {followers.length}
                    </p>
                    <p>Followers</p>
                  </div>
                </div>
                <div className="pro_profile_top_follow">
                  <div
                    className="edit_pro_profile_top_edit_button"
                    onClick={() => {
                      history.push("/ProEdit");
                    }}
                  >
                    <p>Edit</p>
                  </div>
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
                  <div
                    className="pro_profile_top_profileBio"
                    style={{ position: "relative", width: "90%" }}
                    onClick={handleCaptionOpen}
                  >
                    <span>{profileBio}</span>

                    <div className="edit_pro_profile_edit_image_circle_caption">
                      <CreateIcon
                        className="edit_pro_profile_edit_image_caption"
                        style={{ fontSize: 12 }}
                      />
                    </div>
                  </div>
                  <CaptionEdit
                    openCaption={openCaption}
                    setOpenCaption={setOpenCaption}
                    handleCaptionOpen={handleCaptionOpen}
                    handleCaptionClose={handleCaptionClose}
                    setProfileBio={setProfileBio}
                  />
                </div>
                <div className="pro_profile_top_linker">
                  {proLinks.map(({ proLinkName, proLink }) => (
                    <div
                      className="pro_profile_top_link_div"
                      onClick={() => window.open(proLink, "_blank")}
                    >
                      <p>{proLinkName.toUpperCase()}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pro_profile_top_selector">
              <div className="pro_profile_icon_and_name">
                <FavoriteBorderOutlinedIcon style={{ color: "gray" }} />
                <p style={{ color: "gray" }}>saved</p>
              </div>
              <div className="pro_profile_icon_and_name">
                <WallpaperOutlinedIcon style={{ color: "black" }} />
                <p style={{ color: "black" }}>all</p>
              </div>
            </div>
          </div>

          <div className="pro_profile_bottom">
            <VideoGrid videos={proVideos} handleChangeView={handleChangeView} />
          </div>

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
