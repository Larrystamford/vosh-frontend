import React, { useState, useEffect, useCallback, useRef } from "react";
import "./ProProfile.css";
import { Link } from "react-router-dom";
import { VideoGrid } from "../VideoGrid";
import { useGlobalState } from "../../GlobalStates";
import useOnScreen from "../../customHooks/useOnScreen";

import { ImageLoad } from "../../components/ImageLoad";
import { ScrollVideo } from "./ScrollVideo";

import { Snackbar } from "@material-ui/core";
import { StaySlidingSetUp } from "../../login/StaySlidingSetUp";
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

import { CopyToClipboard } from "react-copy-to-clipboard";

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

  const [voshBanner, setVoshBanner] = useState(false);

  const [selectedCategoryId, setSelectedCategoryId] = useState("all");
  const handleCategorySelection = (id) => {
    setScrolledBottomCount(0);
    setSelectedCategoryId(id);
  };

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
        setTimeout(() => {
          setVoshBanner(true);
        }, 60000);
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
      setLikeButtonToggle(!likeButtonToggle);
    } else {
      setLoginCheck(true);
    }
  };

  const handleUnfollow = (i) => {
    if (localStorage.getItem("USER_ID")) {
      setFollowers(followers.slice(0, followers.length - 1));
      setIsFollowing(false);
      setLikeButtonToggle(!likeButtonToggle);
    } else {
      setLoginCheck(true);
    }
  };

  const topRef = useRef();
  const isVisible = useOnScreen(topRef);

  const [shareStatus, setShareStatus] = useState(false);
  const handleShareClicked = () => {
    setShareStatus(true);
    setTimeout(() => setShareStatus(false), 1300);
  };

  const [loginCheck, setLoginCheck] = useState(false);
  const handleLoginClose = () => {
    setLoginCheck(false);
  };

  return (
    <div
      className="ProProfile"
      ref={scrollRef}
      style={{
        backgroundImage: `url(${proTheme.background1})`,
      }}
    >
      {isLoading ? (
        <div className="pro_profile_top">
          <div ref={topRef} className="pro_profile_top_with_left_right">
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
                    <div style={{ position: "relative" }}>
                      <ImageLoad
                        src={image}
                        className="pro_profile_top_image_circular"
                      />
                    </div>
                  ) : null}
                </div>
                <div
                  className="pro_profile_top_name"
                  style={{
                    color: proTheme.primaryFontColor,
                  }}
                >
                  <p>{username}</p>
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

              <div className="pro_profile_top_follow">
                <CopyToClipboard text={"https://vosh.club/" + username}>
                  {isFollowing ? (
                    <div
                      className="pro_profile_top_following_button"
                      onClick={handleShareClicked}
                    >
                      <p style={{ color: "white" }}>Share</p>
                    </div>
                  ) : (
                    <div
                      className="pro_profile_top_follow_button"
                      onClick={handleShareClicked}
                    >
                      <p style={{ color: "white" }}>Share</p>
                    </div>
                  )}
                </CopyToClipboard>
              </div>
            </div>
            <div className="pro_profile_top_right">
              <div className="pro_profile_top_social_medias">
                {socialAccounts
                  .slice(0, 5)
                  .map(({ socialType, socialLink }) => (
                    <img
                      src={convertSocialTypeToImage(socialType)}
                      style={
                        proTheme.socialIconsColor == "white"
                          ? {
                              height: 23,
                              margin: 10,
                              filter: "invert(100%)",
                              WebkitFilter: "invert(100%)",
                            }
                          : {
                              height: 23,
                              margin: 10,
                              filter: "invert(0%)",
                              WebkitFilter: "invert(0%)",
                            }
                      }
                      onClick={() => {
                        if (socialType == "Email") {
                          window.open(`mailto:${socialLink}?subject=From Vosh`);
                        } else {
                          window.open(socialLink, "_blank");
                        }
                      }}
                    />
                  ))}
              </div>
              <div className="pro_profile_top_social_medias">
                {socialAccounts
                  .slice(5, 10)
                  .map(({ socialType, socialLink }) => (
                    <img
                      src={convertSocialTypeToImage(socialType)}
                      style={
                        proTheme.socialIconsColor == "white"
                          ? {
                              height: 23,
                              margin: 10,
                              filter: "invert(100%)",
                              WebkitFilter: "invert(100%)",
                            }
                          : {
                              height: 23,
                              margin: 10,
                              filter: "invert(0%)",
                              WebkitFilter: "invert(0%)",
                            }
                      }
                      onClick={() => {
                        if (socialType == "Email") {
                          window.open(`mailto:${socialLink}?subject=From Vosh`);
                        } else {
                          window.open(socialLink, "_blank");
                        }
                      }}
                    />
                  ))}
              </div>
              <div className="pro_profile_top_description">
                <div
                  className="pro_profile_top_profileBio"
                  style={{
                    position: "relative",
                    width: "90%",
                    color: proTheme.primaryFontColor,
                  }}
                >
                  <span>{profileBio}</span>
                </div>
              </div>
              <div
                className="pro_profile_top_linker"
                style={{
                  backgroundImage: `url(${proTheme.background2})`,
                }}
              >
                {proLinks.map(({ proLinkName, proLink }) => (
                  <div
                    className="pro_profile_top_link_div"
                    onClick={() => window.open(proLink, "_blank")}
                    style={{
                      backgroundColor: proTheme.linkBoxColor,
                    }}
                  >
                    <p style={{ color: proTheme.linkWordsColor }}>
                      {proLinkName}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div
            className="pro_profile_top_selector"
            style={
              isVisible
                ? {
                    backgroundImage: `url(${proTheme.background2})`,
                  }
                : {
                    backgroundImage: `url(${proTheme.background2})`,
                    position: "fixed",
                  }
            }
          >
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
              <p
                style={{
                  color: proTheme.categoryWordsColor,
                }}
              >
                all
              </p>

              <div
                className="pro_profile_icon_and_name_underline"
                style={selectedCategoryId == "all" ? null : { display: "none" }}
              ></div>
            </div>
            {proCategories.map(({ id, proCategoryName, proCategoryImage }) => (
              <div
                className="pro_profile_icon_and_name"
                onClick={() => {
                  handleCategorySelection(id);
                }}
              >
                <img src={proCategoryImage} style={{ height: 20 }} />
                <p
                  style={{
                    color: proTheme.categoryWordsColor,
                  }}
                >
                  {proCategoryName}
                </p>
                <div
                  className="pro_profile_icon_and_name_underline"
                  style={selectedCategoryId == id ? null : { display: "none" }}
                ></div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="pro_profile_bottom">
        {isLoading ? (
          <div></div>
        ) : (
          <VideoGrid
            videos={proVideos.filter((video) => {
              if (selectedCategoryId == "all") {
                return video;
              } else {
                return video.proCategories.includes(selectedCategoryId);
              }
            })}
            showVideos={showVideos}
            setShowVideos={setShowVideos}
            handleChangeView={handleChangeView}
            scrolledBottomCount={scrolledBottomCount}
            selectedCategoryId={selectedCategoryId}
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
        style={{ zIndex: 4000 }}
        open={voshBanner}
        message="Create Your Vosh Website Now"
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        action={
          <React.Fragment>
            <ClearOutlinedIcon onClick={() => setVoshBanner(false)} />
          </React.Fragment>
        }
      />

      {scrollView && (
        <ScrollVideo
          openScrollVideo={scrollView}
          proVideos={proVideos}
          viewIndex={viewIndex}
          handleChangeView={handleChangeView}
          selectedCategoryId={selectedCategoryId}
          proTheme={proTheme}
        />
      )}

      <Snackbar
        open={shareStatus}
        message="Profile copied!"
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      />

      <StaySlidingSetUp open={loginCheck} handleClose={handleLoginClose} />
    </div>
  );
};
