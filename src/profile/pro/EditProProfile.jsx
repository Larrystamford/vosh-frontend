import React, { useState, useEffect, useCallback, useRef } from "react";
import "./ProProfile.css";
import { VideoGrid } from "../VideoGrid";
import { YoutubeGrid } from "../YoutubeGrid";
import { ReadGrid } from "../ReadGrid";
import { useGlobalState } from "../../GlobalStates";
import { useDidMountEffect } from "../../customHooks/useDidMountEffect";
import useDeviceDetect from "../../customHooks/useDeviceDetect";

import { CategoriesSelector } from "./CategoriesSelector";
import { CopyToClipboard } from "react-copy-to-clipboard";
import ReplyOutlinedIcon from "@material-ui/icons/ReplyOutlined";

import { Snackbar } from "@material-ui/core";

import useOnScreen from "../../customHooks/useOnScreen";

import { ScrollVideo } from "./ScrollVideo";

import { ImageLoad } from "../../components/ImageLoad";

import { StaySlidingSetUp } from "../../login/StaySlidingSetUp";
import {
  convertSocialTypeToImage,
  titleCase,
} from "../../helpers/CommonFunctions";

import CreateIcon from "@material-ui/icons/Create";
import SlideshowOutlinedIcon from "@material-ui/icons/SlideshowOutlined";
import GridOnIcon from "@material-ui/icons/GridOn";
import WallpaperIcon from "@material-ui/icons/Wallpaper";
import BallotOutlinedIcon from "@material-ui/icons/BallotOutlined";

import * as legoData from "../../components/lego-loader";

import { useHistory } from "react-router";
import axios from "../../axios";
import { PageView } from "../../components/tracking/Tracker";

import Lottie from "react-lottie";
import { useBottomScrollListener } from "react-bottom-scroll-listener";
import { useWindowSize } from "../../customHooks/useWindowSize";

import SettingsOutlinedIcon from "@material-ui/icons/SettingsOutlined";
import { database } from "firebase";

export const EditProProfile = ({ match, location }) => {
  const { isMobile } = useDeviceDetect();
  const size = useWindowSize();

  const history = useHistory();

  const [globalModalOpened, setGlobalModalOpened] =
    useGlobalState("globalModalOpened");
  const [scrolledBottomCount, setScrolledBottomCount] = useState(0);
  const scrollRef = useBottomScrollListener(() => {
    setScrolledBottomCount(scrolledBottomCount + 1);
  });

  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");
  const [image, setImage] = useState("");
  const [videos, setVideos] = useState([]);
  const [socialAccounts, setSocialAccounts] = useState([]);
  const [proLinks, setProLinks] = useState([]);
  const [allProductLinks, setAllProductLinks] = useState([]);
  const [youtubeVideos, setYoutubeVideos] = useState([]);

  const [proCategories, setProCategories] = useState([]);
  const [proCategories_youtube, setProCategories_youtube] = useState([]);

  const [proTheme, setProTheme] = useState({});
  const [profileBio, setProfileBio] = useState("");

  const [showVideos, setShowVideos] = useState([]);
  const [showYoutubeVideos, setShowYoutubeVideos] = useState([]);
  const [showReadProducts, setShowReadProducts] = useState([]);

  const [likeButtonToggle, setLikeButtonToggle] = useState(false);

  // login in functions
  const [isLoading, setIsLoading] = useState(true);
  const [loginCheck, setLoginCheck] = useState(true);
  const handleLoginOpen = () => {
    setLoginCheck(true);
  };
  const handleLoginClose = () => {
    setLoginCheck(false);
    history.push("/profile");
  };

  // change profile picture
  const hiddenFileInput = useRef(null);
  const handleUploadClick = (event) => {
    if (onProfile) {
      hiddenFileInput.current.click();
    }
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
      localStorage.setItem("PICTURE", imageUrl);
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

  const [onProfile, setOnProfile] = useState(false);

  const handleProfileLoad = () => {
    setOnProfile(true);
    const userId = localStorage.getItem("USER_ID");
    if (userId) {
      axios.get("/v1/users/getPro/" + userId).then((response) => {
        let data = response.data[0];
        setImage(data.picture);
        setProTheme(data.proTheme);

        if (data.tiktokProOrAll) {
          const sortedVideos1 = data.proVideos.sort((a, b) => {
            return b.tiktokCreatedAt - a.tiktokCreatedAt;
          });
          setVideos(sortedVideos1);
        } else {
          const sortedVideos2 = data.videos.sort((a, b) => {
            return b.tiktokCreatedAt - a.tiktokCreatedAt;
          });
          setVideos(sortedVideos2);
        }

        setUsername(data.userName);
        setUserId(data._id);
        setSocialAccounts(data.socialAccounts);
        setProLinks(data.proLinks);
        setProCategories(data.proCategories);
        setAllProductLinks(data.allProductLinks);

        if (data.youtubeProOrAll) {
          setYoutubeVideos(data.proYoutubeVideos.reverse());
        } else {
          setYoutubeVideos(data.youtubeVideos);
        }

        if (data.profileBio) {
          setProfileBio(data.profileBio);
        }

        if (!(data.proVideos.length === 0 && data.youtubeVideos.length === 0)) {
          let showSocialSelection;
          if (data.showSocialSelections.length > 0) {
            showSocialSelection = data.showSocialSelections;
          } else {
            showSocialSelection = [
              ["tiktok", "all"],
              ["youtube", "all_youtube"],
              ["allProductLinks", "all_read"],
            ];
          }

          const filteredShowSocialSelections = [];
          for (const eachSocial of showSocialSelection) {
            if (eachSocial[0] == "tiktok") {
              if (
                data.tiktokProOrAll &&
                data.proVideos.length !== 0 &&
                !data.proVideos.includes(null)
              ) {
                filteredShowSocialSelections.push(eachSocial);
              } else if (!data.tiktokProOrAll && data.videos.length !== 0) {
                filteredShowSocialSelections.push(eachSocial);
              }
            }
            if (eachSocial[0] == "youtube" && data.youtubeVideos.length !== 0) {
              if (data.youtubeProOrAll && data.proYoutubeVideos.length !== 0) {
                filteredShowSocialSelections.push(eachSocial);
              } else if (
                !data.youtubeProOrAll &&
                data.youtubeVideos.length !== 0
              ) {
                filteredShowSocialSelections.push(eachSocial);
              }
            }
            if (
              eachSocial[0] == "allProductLinks" &&
              data.allProductLinks.length > 0
            ) {
              filteredShowSocialSelections.push(eachSocial);
            }
          }

          if (filteredShowSocialSelections.length > 0) {
            setShowSocialSelections(filteredShowSocialSelections);
            setShowSocial(filteredShowSocialSelections[0][0]);
            setSelectedCategoryName(filteredShowSocialSelections[0][0]);
            setSelectedCategoryId(filteredShowSocialSelections[0][1]);
          }
        } else {
          setShowSocialSelections([
            ["tiktok", "all"],
            ["youtube", "all_youtube"],
            ["allProductLinks", "all_read"],
          ]);
        }

        setIsLoading(false);
      });
    }
  };

  // load data
  useEffect(() => {
    const windowLocationName = window.location.pathname.slice(1);
    if (windowLocationName === "profile" || windowLocationName === "profile/") {
      handleProfileLoad();
    } else {
      axios
        .get("/v1/users/getByUserNamePro/" + windowLocationName)
        .then((response) => {
          let data = response.data[0];

          if (!data || !data._id) {
            history.push("/404");
          } else {
            // load profile if user is on his own page
            if (data._id === localStorage.getItem("USER_ID")) {
              handleProfileLoad();
            } else {
              setImage(data.picture);
              setProTheme(data.proTheme);

              const sortedVideos = data.proVideos.sort((a, b) => {
                return b.tiktokCreatedAt - a.tiktokCreatedAt;
              });
              setVideos(sortedVideos);

              setUsername(data.userName);
              setUserId(data._id);
              setSocialAccounts(data.socialAccounts);
              setProLinks(data.proLinks);
              setProCategories(data.proCategories);
              setAllProductLinks(data.allProductLinks);

              if (data.youtubeProOrAll) {
                setYoutubeVideos(data.proYoutubeVideos.reverse());
              } else {
                setYoutubeVideos(data.youtubeVideos);
              }

              if (data.profileBio) {
                setProfileBio(data.profileBio);
              }

              if (
                !(
                  data.proVideos.length === 0 && data.youtubeVideos.length === 0
                )
              ) {
                let showSocialSelection;
                if (data.showSocialSelections.length > 0) {
                  showSocialSelection = data.showSocialSelections;
                } else {
                  showSocialSelection = [
                    ["tiktok", "all"],
                    ["youtube", "all_youtube"],
                    ["allProductLinks", "all_read"],
                  ];
                }
                const filteredShowSocialSelections = [];
                for (const eachSocial of showSocialSelection) {
                  if (eachSocial[0] == "tiktok") {
                    if (
                      data.tiktokProOrAll &&
                      data.proVideos.length !== 0 &&
                      !data.proVideos.includes(null)
                    ) {
                      filteredShowSocialSelections.push(eachSocial);
                    } else if (
                      !data.tiktokProOrAll &&
                      data.videos.length !== 0
                    ) {
                      filteredShowSocialSelections.push(eachSocial);
                    }
                  }
                  if (
                    eachSocial[0] == "youtube" &&
                    data.youtubeVideos.length !== 0
                  ) {
                    if (
                      data.youtubeProOrAll &&
                      data.proYoutubeVideos.length !== 0
                    ) {
                      filteredShowSocialSelections.push(eachSocial);
                    } else if (
                      !data.youtubeProOrAll &&
                      data.youtubeVideos.length !== 0
                    ) {
                      filteredShowSocialSelections.push(eachSocial);
                    }
                  }
                  if (
                    eachSocial[0] == "allProductLinks" &&
                    data.allProductLinks.length > 0
                  ) {
                    filteredShowSocialSelections.push(eachSocial);
                  }
                }
                if (filteredShowSocialSelections.length > 0) {
                  setShowSocialSelections(filteredShowSocialSelections);
                  setShowSocial(filteredShowSocialSelections[0][0]);
                  setSelectedCategoryName(filteredShowSocialSelections[0][0]);
                  setSelectedCategoryId(filteredShowSocialSelections[0][1]);
                }
              } else {
                setShowSocialSelections([
                  ["tiktok", "all"],
                  ["youtube", "all_youtube"],
                  ["allProductLinks", "all_read"],
                ]);
              }

              // check if already following
              // axios
              //   .get(
              //     `/v1/follow/isFollowing/${localStorage.getItem("USER_ID")}/${
              //       data._id
              //     }`
              //   )
              //   .then((res) => {
              //     setIsFollowing(res.data.isFollowing);
              //   });

              setIsLoading(false);
            }
          }
        });
      axios.post("/v1/metrics/incrementMetrics", {
        id: userId,
        unqiueIdentifier: "total page visits",
      });
    }

    PageView();
  }, [loginCheck]);

  const [shareStatus, setShareStatus] = useState(false);
  const handleShareClicked = () => {
    axios.post("/v1/metrics/incrementMetrics", {
      id: userId,
      unqiueIdentifier: "total profile shares",
    });
    axios
      .post("/v1/follow/followUser", {
        followerId: localStorage.getItem("USER_ID"),
        followingId: userId,
      })
      .then(() => {
        console.log("followed");
      });
    setShareStatus(true);
    setTimeout(() => setShareStatus(false), 1300);
  };

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
  const [showSocialSelections, setShowSocialSelections] = useState([]);

  const [showSocial, setShowSocial] = useState("tiktok");
  // to be deprecated
  const [selectedCategoryName, setSelectedCategoryName] = useState("tiktok");
  const [selectedCategoryId, setSelectedCategoryId] = useState("all");

  const handleCategorySelection = (id, name) => {
    setScrolledBottomCount(0);
    setSelectedCategoryId(id);

    // to be deprecated
    setSelectedCategoryName(name);
  };

  const topRef = useRef();
  const isVisible = useOnScreen(topRef);

  const getSimilarSocialColor = (color) => {
    if (color == "white") {
      return "grey";
    } else if (color == "black") {
      return "#f2f2f2";
    }
  };

  return (
    <div className="ProProfile" ref={scrollRef}>
      {isLoading ? (
        !isMobile ? (
          <div ref={topRef} className="pro_profile_top_with_left_right"></div>
        ) : (
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
            <div ref={topRef} className="pro_profile_social_selector"></div>
          </div>
        )
      ) : (
        <div className="pro_profile_top">
          <div className="pro_profile_top_with_left_right">
            <div className="pro_profile_top_right">
              <div className="pro_profile_top_photo_and_social">
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

                        {onProfile && (
                          <div>
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
                        )}
                      </div>
                    ) : null}
                  </div>
                  {onProfile ? (
                    <div className="pro_profile_top_follow">
                      <div
                        className="edit_pro_profile_top_edit_button"
                        onClick={() => {
                          history.push("/ProEdit");
                        }}
                      >
                        <SettingsOutlinedIcon
                          style={{
                            fontSize: 18,
                            color: proTheme.socialIconsColor,
                          }}
                        />
                        <p style={{ color: proTheme.socialIconsColor }}>Edit</p>
                      </div>
                    </div>
                  ) : (
                    <CopyToClipboard text={"vosh.club/" + username}>
                      <div
                        className="pro_profile_top_follow"
                        onClick={() => {
                          handleShareClicked();
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
                  )}
                </div>

                <div className="pro_profile_top_name_social_cta">
                  <div className="pro_profile_top_social_medias">
                    <div
                      className="pro_profile_top_name"
                      style={{
                        color: proTheme.socialIconsColor,
                      }}
                    >
                      <p
                        className="pro_profile_top_name"
                        style={{
                          color: proTheme.socialIconsColor,
                        }}
                      >
                        @{username}
                      </p>
                    </div>
                  </div>

                  {socialAccounts.length < 6 ? (
                    <div className="pro_profile_top_social_medias">
                      {socialAccounts
                        .slice(0, 5)
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
                    <div>
                      <div className="pro_profile_top_social_medias">
                        {socialAccounts
                          .slice(0, 5)
                          .map(({ socialType, socialLink }) => (
                            <img
                              src={convertSocialTypeToImage(socialType)}
                              style={
                                proTheme.socialIconsColor === "white"
                                  ? {
                                      height: 16,
                                      margin: 6,
                                      filter: "invert(100%)",
                                      WebkitFilter: "invert(100%)",
                                    }
                                  : {
                                      height: 16,
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
                          .slice(5, 10)
                          .map(({ socialType, socialLink }) => (
                            <img
                              src={convertSocialTypeToImage(socialType)}
                              style={
                                proTheme.socialIconsColor === "white"
                                  ? {
                                      height: 16,
                                      margin: 6,
                                      filter: "invert(100%)",
                                      WebkitFilter: "invert(100%)",
                                    }
                                  : {
                                      height: 16,
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
                    </div>
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
                style={proLinks.length == 0 ? { margin: "0.5rem" } : null}
              >
                {proLinks.length > 0 ? (
                  proLinks.map(({ proLinkName, proLink }) => (
                    <div
                      className="pro_profile_top_link_div"
                      onClick={() => window.open(proLink, "_blank")}
                      style={{
                        backgroundColor: proTheme.linkBoxColor,
                      }}
                    >
                      <h4 style={{ color: proTheme.linkWordsColor }}>
                        {proLinkName}
                      </h4>
                    </div>
                  ))
                ) : (
                  <div
                    className="pro_profile_top_link_div"
                    onClick={() => {
                      history.push("/ProEdit");
                    }}
                    style={
                      onProfile
                        ? {
                            backgroundColor: proTheme.linkBoxColor,
                          }
                        : { display: "none" }
                    }
                  >
                    <p style={{ color: proTheme.linkWordsColor }}>
                      Set Up Your Links!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="pro_profile_social_selector">
            {!(
              showVideos.length == 0 &&
              showYoutubeVideos.length == 0 &&
              showReadProducts.length == 0
            ) &&
              showSocialSelections.map(([social, socialId]) => {
                return (
                  <div
                    className="pro_profile_social_selector_line"
                    style={
                      showSocial == social
                        ? {
                            borderBottom: `1px solid ${proTheme.socialIconsColor}`,
                          }
                        : {
                            borderBottom: `1px solid ${getSimilarSocialColor(
                              proTheme.socialIconsColor
                            )}`,
                          }
                    }
                    onClick={() => {
                      setShowSocial(social);
                      handleCategorySelection(socialId);
                    }}
                  >
                    {social == "tiktok" ? (
                      <GridOnIcon
                        style={
                          showSocial == social
                            ? { fontSize: 22, color: proTheme.socialIconsColor }
                            : {
                                fontSize: 22,
                                color: getSimilarSocialColor(
                                  proTheme.socialIconsColor
                                ),
                              }
                        }
                      />
                    ) : social == "youtube" ? (
                      <SlideshowOutlinedIcon
                        style={
                          showSocial == social
                            ? { fontSize: 25, color: proTheme.socialIconsColor }
                            : {
                                fontSize: 25,
                                color: getSimilarSocialColor(
                                  proTheme.socialIconsColor
                                ),
                              }
                        }
                      />
                    ) : social == "allProductLinks" ? (
                      <BallotOutlinedIcon
                        style={
                          showSocial == social
                            ? { fontSize: 25, color: proTheme.socialIconsColor }
                            : {
                                fontSize: 25,
                                color: getSimilarSocialColor(
                                  proTheme.socialIconsColor
                                ),
                              }
                        }
                      />
                    ) : null}
                  </div>
                );
              })}
          </div>

          <CategoriesSelector
            proTheme={proTheme}
            isVisible={isVisible}
            showSocial={showSocial}
            selectedCategoryId={selectedCategoryId}
            proCategories={proCategories}
            handleCategorySelection={handleCategorySelection}
          />
        </div>
      )}

      <div className="pro_profile_bottom">
        {isLoading ? (
          <div></div>
        ) : showSocial === "tiktok" ? (
          <VideoGrid
            videos={videos.filter((video) => {
              if (selectedCategoryId === "all") {
                return video;
              } else {
                if (video) {
                  return video.proCategories.includes(selectedCategoryId);
                }
              }
            })}
            showVideos={showVideos}
            setShowVideos={setShowVideos}
            handleChangeView={handleScrollViewOpen}
            scrolledBottomCount={scrolledBottomCount}
            selectedCategoryId={selectedCategoryId}
            onProfile={onProfile}
          />
        ) : showSocial === "youtube" ? (
          <YoutubeGrid
            youtubeVideos={youtubeVideos}
            size={size}
            proTheme={proTheme}
            showYoutubeVideos={showYoutubeVideos}
            setShowYoutubeVideos={setShowYoutubeVideos}
            scrolledBottomCount={scrolledBottomCount}
            onProfile={onProfile}
          />
        ) : showSocial === "allProductLinks" ? (
          <ReadGrid
            allProductLinks={allProductLinks}
            size={size}
            proTheme={proTheme}
            showReadProducts={showReadProducts}
            setShowReadProducts={setShowReadProducts}
            scrolledBottomCount={scrolledBottomCount}
          />
        ) : null}
      </div>

      {!localStorage.getItem("USER_ID") && onProfile ? (
        <StaySlidingSetUp open={loginCheck} handleClose={handleLoginClose} />
      ) : null}

      {scrollView && (
        <ScrollVideo
          openScrollVideo={scrollView}
          videos={videos}
          viewIndex={viewIndex}
          handleScrollViewClose={handleScrollViewClose}
          selectedCategoryId={selectedCategoryId}
          proTheme={proTheme}
        />
      )}

      {!isMobile &&
      (size.width > 1100 || size.width == 640) ? null : proTheme.background3 &&
        proTheme.background3.videoUrl &&
        proTheme.background3.imageUrl ? (
        <video
          src={proTheme.background3.videoUrl}
          poster={proTheme.background3.imageUrl}
          playsInline
          autoPlay
          muted
          loop
          id="backgroundVideo"
        />
      ) : (
        <img id="backgroundImage" src={proTheme.background1} />
      )}

      <Snackbar
        open={shareStatus}
        message="Profile copied!"
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      />
    </div>
  );
};
