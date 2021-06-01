import React, { useState, useEffect, useCallback, useRef } from "react";
import "./ProProfile.css";
import { VideoGrid } from "../VideoGrid";
import { YoutubeGrid } from "../YoutubeGrid";
import { ReadGrid } from "../ReadGrid";
import { useGlobalState } from "../../GlobalStates";
import { useDidMountEffect } from "../../customHooks/useDidMountEffect";

import { CategoriesSelector } from "./CategoriesSelector";

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

export const EditProProfile = ({ match, location }) => {
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
  const [socialAccounts, setSocialAccounts] = useState([]);
  const [proLinks, setProLinks] = useState([]);
  const [allProductLinks, setAllProductLinks] = useState([]);

  const [proCategories, setProCategories] = useState([]);
  const [proCategories_youtube, setProCategories_youtube] = useState([]);
  const [proCategories_instagram, setProCategories_instagram] = useState([]);

  const [proTheme, setProTheme] = useState({});
  const [profileBio, setProfileBio] = useState("");

  const [showVideos, setShowVideos] = useState([]);

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

  // load data
  useEffect(() => {
    const userId = localStorage.getItem("USER_ID");
    if (userId) {
      axios.get("/v1/users/getPro/" + userId).then((response) => {
        let data = response.data[0];
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
        setAllProductLinks(data.allProductLinks);

        if (data.profileBio) {
          setProfileBio(data.profileBio);
        }

        // set theme up
        // theme1 to theme6 -> front end helper function to return the respective colors
        document.documentElement.style.setProperty(
          "--background1",
          data.proTheme.background1
        );

        setIsLoading(false);
      });
    }

    PageView();
  }, [loginCheck]);

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
  const [showSocialSelections, setShowSocialSelections] = useState([
    ["tiktok", "all"],
    ["youtube", "all_youtube"],
    ["instagram", "all_instagram"],
    ["allProductLinks", "nil"],
  ]);

  const [showSocial, setShowSocial] = useState(showSocialSelections[0][0]);

  // to be deprecated
  const [selectedCategoryName, setSelectedCategoryName] = useState(
    showSocialSelections[0][0]
  );

  const [selectedCategoryId, setSelectedCategoryId] = useState(
    showSocialSelections[0][1]
  );
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
          <div ref={topRef} className="pro_profile_social_selector"></div>
        </div>
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
                          .slice(5, 10)
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

              <div className="pro_profile_top_linker">
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
                    style={{
                      backgroundColor: proTheme.linkBoxColor,
                    }}
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
            <div
              className="pro_profile_social_selector_line"
              style={
                showSocial == "tiktok"
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
                setShowSocial("tiktok");
                handleCategorySelection("all");
              }}
            >
              <GridOnIcon
                style={
                  showSocial == "tiktok"
                    ? { fontSize: 22, color: proTheme.socialIconsColor }
                    : {
                        fontSize: 22,
                        color: getSimilarSocialColor(proTheme.socialIconsColor),
                      }
                }
              />
            </div>
            <div
              className="pro_profile_social_selector_line"
              style={
                showSocial == "youtube"
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
                setShowSocial("youtube");
                handleCategorySelection("all_youtube");
              }}
            >
              <SlideshowOutlinedIcon
                style={
                  showSocial == "youtube"
                    ? { fontSize: 25, color: proTheme.socialIconsColor }
                    : {
                        fontSize: 25,
                        color: getSimilarSocialColor(proTheme.socialIconsColor),
                      }
                }
              />
            </div>

            <div
              className="pro_profile_social_selector_line"
              style={
                showSocial == "instagram"
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
                setShowSocial("instagram");
                handleCategorySelection("all_instagram");
              }}
            >
              <WallpaperIcon
                style={
                  showSocial == "instagram"
                    ? { fontSize: 22, color: proTheme.socialIconsColor }
                    : {
                        fontSize: 22,
                        color: getSimilarSocialColor(proTheme.socialIconsColor),
                      }
                }
              />
            </div>

            <div
              className="pro_profile_social_selector_line"
              style={
                showSocial == "allProductLinks"
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
                setShowSocial("allProductLinks");
                handleCategorySelection("nil");
              }}
            >
              <BallotOutlinedIcon
                style={
                  showSocial == "allProductLinks"
                    ? { fontSize: 25, color: proTheme.socialIconsColor }
                    : {
                        fontSize: 25,
                        color: getSimilarSocialColor(proTheme.socialIconsColor),
                      }
                }
              />
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

          <CategoriesSelector
            proTheme={proTheme}
            isVisible={isVisible}
            showSocial={showSocial}
            selectedCategoryId={selectedCategoryId}
            proCategories={proCategories}
            proCategories_youtube={proCategories_youtube}
            proCategories_instagram={proCategories_instagram}
            handleCategorySelection={handleCategorySelection}
          />
        </div>
      )}

      <div className="pro_profile_bottom">
        {isLoading ? (
          <div></div>
        ) : showSocial === "tiktok" ? (
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
        ) : showSocial === "youtube" ? (
          <YoutubeGrid />
        ) : showSocial === "instagram" ? (
          <YoutubeGrid />
        ) : showSocial === "allProductLinks" ? (
          <ReadGrid
            allProductLinks={allProductLinks}
            size={size}
            proTheme={proTheme}
          />
        ) : null}
      </div>

      {localStorage.getItem("USER_ID") ? null : (
        <StaySlidingSetUp open={loginCheck} handleClose={handleLoginClose} />
      )}

      {scrollView && (
        <ScrollVideo
          openScrollVideo={scrollView}
          proVideos={proVideos}
          viewIndex={viewIndex}
          handleScrollViewClose={handleScrollViewClose}
          selectedCategoryId={selectedCategoryId}
          proTheme={proTheme}
        />
      )}
    </div>
  );
};
