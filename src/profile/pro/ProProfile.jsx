import React, { useState, useEffect, useCallback, useRef } from "react";
import "./ProProfile.css";
import { Link } from "react-router-dom";
import { VideoGrid } from "../VideoGrid";
import { useGlobalState } from "../../GlobalStates";

import { ImageLoad } from "../../components/ImageLoad";

import { Snackbar } from "@material-ui/core";
import { StaySlidingSetUp } from "../../login/StaySlidingSetUp";
import { CaptionEdit } from "../CaptionEdit";
import { convertSocialTypeToImage } from "../../helpers/CommonFunctions";

import { ProfileFeed } from "../../feed/ProfileFeed";
import { useDidMountEffect } from "../../customHooks/useDidMountEffect";
import CreateIcon from "@material-ui/icons/Create";
import * as legoData from "../../components/lego-loader";
import ClearOutlinedIcon from "@material-ui/icons/ClearOutlined";

import { useHistory } from "react-router";
import axios from "../../axios";
import { PageView } from "../../components/tracking/Tracker";

import Lottie from "react-lottie";
import { useBottomScrollListener } from "react-bottom-scroll-listener";

export const ProProfile = ({ match, location }) => {
  const history = useHistory();
  const [globalModalOpened, setGlobalModalOpened] = useGlobalState(
    "globalModalOpened"
  );
  const [scrolledBottomCount, setScrolledBottomCount] = useState(0);
  const scrollRef = useBottomScrollListener(() => {
    setScrolledBottomCount(scrolledBottomCount + 1);
  });

  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");
  const [image, setImage] = useState("");
  const [followers, setFollowers] = useState([]);
  const [followings, setFollowings] = useState([]);
  const [proVideos, setProVideos] = useState([]);
  const [profileBio, setProfileBio] = useState("");
  const [socialAccounts, setSocialAccounts] = useState([]);
  const [proLinks, setProLinks] = useState([]);
  const [proCategories, setProCategories] = useState([]);
  const [proTheme, setProTheme] = useState({});

  const [showVideos, setShowVideos] = useState([]);

  const [scrollView, setScrollView] = useState(false);
  const [viewIndex, setViewIndex] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [likeButtonToggle, setLikeButtonToggle] = useState(false);

  const [voshBanner, setVoshBanner] = useState(true);

  const [selectedCategoryName, setSelectedCategoryName] = useState("");
  const handleCategorySelection = (name) => {
    setSelectedCategoryName(name);
  };

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
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const windowLocationName = window.location.pathname.slice(1);
    axios.get("/v1/users/userNameIsPro/" + windowLocationName).then((res) => {
      if (res.data.userNameIsPro) {
        axios
          .get("/v1/users/getByUserNamePro/" + windowLocationName)
          .then((response) => {
            let data = response.data[0];
            setImage(data.picture);
            setFollowings(data.followings);
            setFollowers(data.followers);
            setProTheme(data.proTheme);

            const sortedProVideos = data.proVideos.sort((a, b) => {
              return b.tiktokCreatedAt - a.tiktokCreatedAt;
            });
            setProVideos(sortedProVideos);

            setUsername(data.userName);
            setUserId(data._id);
            setSocialAccounts(data.socialAccounts);
            setProLinks(data.proLinks);
            setProCategories(data.proCategories);

            if (data.profileBio) {
              setProfileBio(data.profileBio);
            }

            // set theme up
            // theme1 to theme6 -> front end helper function to return the respective colors
            document.documentElement.style.setProperty(
              "--background1",
              data.proTheme.background1
            );

            setSelectedCategoryName("all");

            // check if already following
            for (const follower of data.followers) {
              if (follower.id == localStorage.getItem("USER_ID")) {
                setIsFollowing(true);
              }
            }

            // redirect to profile if user clicks on own userName
            if (data._id == localStorage.getItem("USER_ID")) {
              history.push("/ProProfile");
            }
          });

        setIsLoading(false);
        PageView();
      } else {
        history.push("/404");
      }
    });
  }, []);

  // handle follow
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

  return (
    <>
      {scrollView ? (
        <ProfileFeed
          videos={proVideos.filter((video) => {
            if (selectedCategoryName == "all") {
              return video;
            } else {
              return video.proCategories.includes(selectedCategoryName);
            }
          })}
          viewIndex={viewIndex}
          handleChangeView={handleChangeView}
        />
      ) : (
        <div className="ProProfile" ref={scrollRef}>
          {isLoading ? (
            <div className="pro_profile_top">
              <div className="pro_profile_loading">
                <Lottie
                  options={{
                    loop: true,
                    autoPlay: true,
                    animationData: legoData.default,
                    rendererSettings: {
                      preserveAspectRatio: "xMidYMid slice",
                    },
                  }}
                  height={220}
                  width={220}
                />
                <p className="pro_profile_loading_word">Vosh</p>
              </div>
            </div>
          ) : (
            <div className="pro_profile_top">
              <div
                className="pro_profile_top_with_left_right"
                style={{
                  backgroundImage: `url(${proTheme.background1})`,
                }}
              >
                <div className="pro_profile_top_left">
                  <div className="pro_profile_top_image_name">
                    <div className="pro_profile_top_image">
                      {image ? (
                        <div
                          style={{ position: "relative" }}
                          onClick={handleUploadClick}
                        >
                          <ImageLoad
                            src={image}
                            className="pro_profile_top_image_circular"
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
                  <div
                    className="pro_profile_top_linker"
                    style={{
                      backgroundImage: `url(${proTheme.background2})`,
                    }}
                  >
                    {proLinks.length > 0 ? (
                      proLinks.map(({ proLinkName, proLink }) => (
                        <div
                          className="pro_profile_top_link_div"
                          onClick={() => window.open(proLink, "_blank")}
                        >
                          <p>{proLinkName}</p>
                        </div>
                      ))
                    ) : (
                      <div
                        className="pro_profile_top_link_div"
                        onClick={() => {
                          history.push("/ProEdit");
                        }}
                      >
                        <p>Set Up Your Links!</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="pro_profile_top_selector">
                <div
                  className="pro_profile_icon_and_name"
                  onClick={() => {
                    handleCategorySelection("all");
                  }}
                >
                  <img
                    src="https://dciv99su0d7r5.cloudfront.net/all.png"
                    style={{ height: 20 }}
                  />
                  <p style={{ color: "black" }}>all</p>

                  <div
                    className="pro_profile_icon_and_name_underline"
                    style={
                      selectedCategoryName == "all" ? null : { display: "none" }
                    }
                  ></div>
                </div>
                {proCategories.map(
                  ({ id, proCategoryName, proCategoryImage }) => (
                    <div
                      className="pro_profile_icon_and_name"
                      onClick={() => {
                        handleCategorySelection(proCategoryName);
                      }}
                    >
                      <img src={proCategoryImage} style={{ height: 20 }} />
                      <p style={{ color: "black" }}>{proCategoryName}</p>
                      <div
                        className="pro_profile_icon_and_name_underline"
                        style={
                          selectedCategoryName == proCategoryName
                            ? null
                            : { display: "none" }
                        }
                      ></div>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          <div className="pro_profile_bottom">
            {isLoading ? (
              <div></div>
            ) : (
              <VideoGrid
                videos={proVideos.filter((video) => {
                  if (selectedCategoryName == "all") {
                    return video;
                  } else {
                    return video.proCategories.includes(selectedCategoryName);
                  }
                })}
                showVideos={showVideos}
                setShowVideos={setShowVideos}
                handleChangeView={handleChangeView}
                scrolledBottomCount={scrolledBottomCount}
                selectedCategoryName={selectedCategoryName}
              />
            )}
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
        </div>
      )}
    </>
  );
};
