import React, { useState, useEffect, useCallback, useRef } from "react";
import "./ProProfile.css";
import { VideoGrid } from "../VideoGrid";
import { useGlobalState } from "../../GlobalStates";
import { useDidMountEffect } from "../../customHooks/useDidMountEffect";
import useOnScreen from "../../customHooks/useOnScreen";

import { ImageLoad } from "../../components/ImageLoad";
import { ScrollVideo } from "./ScrollVideo";

import { Snackbar } from "@material-ui/core";
import { StaySlidingSetUp } from "../../login/StaySlidingSetUp";
import {
  convertSocialTypeToImage,
  titleCase,
} from "../../helpers/CommonFunctions";
import * as legoData from "../../components/lego-loader";
import ClearOutlinedIcon from "@material-ui/icons/ClearOutlined";

import { useHistory } from "react-router";
import axios from "../../axios";
import { PageView } from "../../components/tracking/Tracker";

import Lottie from "react-lottie";
import { useBottomScrollListener } from "react-bottom-scroll-listener";

import { CopyToClipboard } from "react-copy-to-clipboard";
import { useWindowSize } from "../../customHooks/useWindowSize";
import ReplyOutlinedIcon from "@material-ui/icons/ReplyOutlined";

export const ProProfile = ({ match, location }) => {
  const history = useHistory();
  const size = useWindowSize();

  const [globalModalOpened, setGlobalModalOpened] =
    useGlobalState("globalModalOpened");
  const [scrolledBottomCount, setScrolledBottomCount] = useState(0);
  const scrollRef = useBottomScrollListener(() => {
    setScrolledBottomCount(scrolledBottomCount + 1);
  });

  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");
  const [image, setImage] = useState("");
  const [proVideos, setProVideos] = useState([]);
  const [profileBio, setProfileBio] = useState("");
  const [socialAccounts, setSocialAccounts] = useState([]);
  const [proLinks, setProLinks] = useState([]);
  const [proCategories, setProCategories] = useState([]);
  const [proTheme, setProTheme] = useState({});

  const [showVideos, setShowVideos] = useState([]);

  const [isFollowing, setIsFollowing] = useState(false);
  const [likeButtonToggle, setLikeButtonToggle] = useState(false);

  const [voshBanner, setVoshBanner] = useState(false);

  const [selectedCategoryName, setSelectedCategoryName] = useState("all");
  const [selectedCategoryId, setSelectedCategoryId] = useState("all");
  const handleCategorySelection = (id, name) => {
    setScrolledBottomCount(0);
    setSelectedCategoryId(id);
    setSelectedCategoryName(name);
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

            // redirect to profile if user clicks on own userName
            if (data._id === localStorage.getItem("USER_ID")) {
              history.push("/profile");
            }

            setImage(data.picture);
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

            // check if already following
            axios
              .get(
                `/v1/follow/isFollowing/${localStorage.getItem("USER_ID")}/${
                  data._id
                }`
              )
              .then((res) => {
                setIsFollowing(res.data.isFollowing);
              });

            setIsLoading(false);
          });

        axios.post("/v1/metrics/incrementMetrics", {
          id: userId,
          unqiueIdentifier: "total page visits",
        });

        PageView();
        setTimeout(() => {
          setVoshBanner(true);
        }, 60000);
      } else {
        history.push("/404");
      }
    });
  }, []);

  // SCROLL VIEW
  const [scrollView, setScrollView] = useState(false);
  const [viewIndex, setViewIndex] = useState(0);
  const handleScrollViewOpen = (i) => {
    setScrollView(true);
    setViewIndex(i);

    window.history.pushState(
      {
        scrollView: "scrollView",
      },
      "",
      ""
    );
  };
  const handleScrollViewClose = () => {
    history.goBack();
  };
  const handleScrollViewPop = useCallback(() => {
    setScrollView(false);
  }, []);
  useDidMountEffect(() => {
    if (globalModalOpened) {
      window.removeEventListener("popstate", handleScrollViewPop, true);
    } else if (scrollView) {
      window.addEventListener("popstate", handleScrollViewPop, true);
    } else {
      window.removeEventListener("popstate", handleScrollViewPop, true);
    }
  }, [scrollView, globalModalOpened]);

  // SCROLL VIEW END

  const handleFollow = (i) => {
    if (localStorage.getItem("USER_ID")) {
      setIsFollowing(true);
      setLikeButtonToggle(!likeButtonToggle);

      axios
        .post("/v1/follow/followUser", {
          followerId: localStorage.getItem("USER_ID"),
          followingId: userId,
        })
        .then(() => {
          console.log("followed");
        });
    } else {
      setLoginCheck(true);
    }
  };

  const handleUnfollow = (i) => {
    if (localStorage.getItem("USER_ID")) {
      setIsFollowing(false);
      setLikeButtonToggle(!likeButtonToggle);

      axios
        .post("/v1/follow/unfollowUser", {
          followerId: localStorage.getItem("USER_ID"),
          followingId: userId,
        })
        .then(() => {
          console.log("unfollowed");
        });
    } else {
      setLoginCheck(true);
    }
  };

  const topRef = useRef();
  const isVisible = useOnScreen(topRef);

  const [shareStatus, setShareStatus] = useState(false);
  const handleShareClicked = () => {
    axios.post("/v1/metrics/incrementMetrics", {
      id: userId,
      unqiueIdentifier: "total profile shares",
    });
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
        objectFit: "contain",
        height: "100%",
        width: "100%",
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
          <div className="pro_profile_top_with_left_right">
            <div className="pro_profile_top_right">
              <div className="pro_profile_top_photo_and_social">
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
                  <CopyToClipboard text={"vosh.club/" + username}>
                    <div
                      className="pro_profile_top_follow"
                      onClick={() => {
                        handleShareClicked();
                        handleFollow();
                      }}
                    >
                      <div className="edit_pro_profile_top_edit_button">
                        <ReplyOutlinedIcon
                          style={{
                            fontSize: 18,
                            color: proTheme.socialIconsColor,
                          }}
                        />
                        <p style={{ color: proTheme.socialIconsColor }}>
                          Share
                        </p>
                      </div>
                    </div>
                  </CopyToClipboard>
                </div>

                <div className="pro_profile_top_name_social_cta">
                  <div className="pro_profile_top_social_medias">
                    <div
                      className="pro_profile_top_name"
                      style={{
                        color: proTheme.primaryFontColor,
                      }}
                    >
                      <p
                        className="pro_profile_top_name"
                        style={{
                          color: proTheme.primaryFontColor,
                        }}
                      >
                        @{username}
                      </p>
                    </div>
                  </div>

                  {socialAccounts.length < 7 ? (
                    <div className="pro_profile_top_social_medias">
                      {socialAccounts
                        .slice(0, 6)
                        .map(({ socialType, socialLink }) => (
                          <img
                            src={convertSocialTypeToImage(socialType)}
                            style={
                              proTheme.socialIconsColor === "white"
                                ? {
                                    height: 19,
                                    margin: 10,
                                    filter: "invert(100%)",
                                    WebkitFilter: "invert(100%)",
                                  }
                                : {
                                    height: 19,
                                    margin: 10,
                                    filter: "invert(0%)",
                                    WebkitFilter: "invert(0%)",
                                  }
                            }
                            onClick={() => {
                              if (socialType == "Email") {
                                window.open(
                                  `mailto:${socialLink}?subject=From Vosh`
                                );
                              } else {
                                window.open(socialLink, "_blank");
                              }
                            }}
                          />
                        ))}
                    </div>
                  ) : (
                    <>
                      <div className="pro_profile_top_social_medias">
                        {socialAccounts
                          .slice(0, 6)
                          .map(({ socialType, socialLink }) => (
                            <img
                              src={convertSocialTypeToImage(socialType)}
                              style={
                                proTheme.socialIconsColor === "white"
                                  ? {
                                      height: 15,
                                      margin: 6,
                                      filter: "invert(100%)",
                                      WebkitFilter: "invert(100%)",
                                    }
                                  : {
                                      height: 15,
                                      margin: 6,
                                      filter: "invert(0%)",
                                      WebkitFilter: "invert(0%)",
                                    }
                              }
                              onClick={() => {
                                if (socialType == "Email") {
                                  window.open(
                                    `mailto:${socialLink}?subject=From Vosh`
                                  );
                                } else {
                                  window.open(socialLink, "_blank");
                                }
                              }}
                            />
                          ))}
                      </div>
                      <div className="pro_profile_top_social_medias">
                        {socialAccounts
                          .slice(6, 12)
                          .map(({ socialType, socialLink }) => (
                            <img
                              src={convertSocialTypeToImage(socialType)}
                              style={
                                proTheme.socialIconsColor === "white"
                                  ? {
                                      height: 15,
                                      margin: 6,
                                      filter: "invert(100%)",
                                      WebkitFilter: "invert(100%)",
                                    }
                                  : {
                                      height: 15,
                                      margin: 6,
                                      filter: "invert(0%)",
                                      WebkitFilter: "invert(0%)",
                                    }
                              }
                              onClick={() => {
                                if (socialType == "Email") {
                                  window.open(
                                    `mailto:${socialLink}?subject=From Vosh`
                                  );
                                } else {
                                  window.open(socialLink, "_blank");
                                }
                              }}
                            />
                          ))}
                      </div>
                    </>
                  )}
                </div>
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
                style={
                  proLinks.length > 0
                    ? {
                        backgroundImage: `url(${proTheme.background2})`,
                      }
                    : {
                        display: "none",
                      }
                }
              >
                {proLinks.map(({ id, proLinkName, proLink }) => (
                  <div
                    className="pro_profile_top_link_div"
                    onClick={() => {
                      axios.post("/v1/metrics/incrementMetrics", {
                        id: userId,
                        unqiueIdentifier: id,
                      });
                      window.open(proLink, "_blank");
                    }}
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

              <div
                className="pro_profile_shop_div"
                style={{
                  color: proTheme.primaryFontColor,
                }}
              >
                <p>
                  Shop{" "}
                  <span
                    style={{ fontStyle: "italic", textDecoration: "underline" }}
                  >
                    {titleCase(selectedCategoryName)}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div
            className="pro_profile_top_selector"
            style={
              isVisible
                ? {
                    display: "none",
                  }
                : {}
            }
          ></div>
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
                handleCategorySelection("all", "all");
              }}
            >
              <span
                style={
                  selectedCategoryId == "all"
                    ? { margin: 3, fontSize: 20, fontWeight: "bold" }
                    : { margin: 3, fontSize: 16 }
                }
              >
                🌎
              </span>
              <p
                style={{
                  color: proTheme.categoryWordsColor,
                }}
              >
                all
              </p>
            </div>
            {proCategories.map(({ id, proCategoryName, proCategoryImage }) => (
              <div
                className="pro_profile_icon_and_name"
                onClick={() => {
                  handleCategorySelection(id, proCategoryName);
                }}
              >
                {proCategoryImage.includes(".png") ? (
                  <img src={proCategoryImage} style={{ height: 20 }} />
                ) : (
                  <span
                    style={
                      selectedCategoryId == id
                        ? { margin: 3, fontSize: 20, fontWeight: "bold" }
                        : { margin: 3, fontSize: 16 }
                    }
                  >
                    {proCategoryImage}
                  </span>
                )}

                <p
                  style={{
                    color: proTheme.categoryWordsColor,
                  }}
                >
                  {proCategoryName}
                </p>
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
              if (selectedCategoryId === "all") {
                return video;
              } else {
                return video.proCategories.includes(selectedCategoryId);
              }
            })}
            showVideos={showVideos}
            setShowVideos={setShowVideos}
            handleChangeView={handleScrollViewOpen}
            scrolledBottomCount={scrolledBottomCount}
            selectedCategoryId={selectedCategoryId}
          />
        )}
      </div>

      {voshBanner && (
        <div
          style={{ zIndex: 4001 }}
          className="pro_profile_bottom_snackbar_temp"
          onClick={() => {
            history.push("/getStarted");
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
          handleScrollViewClose={handleScrollViewClose}
          selectedCategoryId={selectedCategoryId}
          proTheme={proTheme}
          userId={userId}
        />
      )}

      <Snackbar
        open={shareStatus}
        message="Profile copied!"
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      />

      {loginCheck && (
        <StaySlidingSetUp open={loginCheck} handleClose={handleLoginClose} />
      )}
    </div>
  );
};
