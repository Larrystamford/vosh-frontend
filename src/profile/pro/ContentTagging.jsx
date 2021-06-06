import React, { useState, useEffect, useRef, useCallback } from "react";

import "./ProEdit.css";
import { useGlobalState } from "../../GlobalStates";
import { useHistory } from "react-router";
import { useDidMountEffect } from "../../customHooks/useDidMountEffect";
import * as constants from "../../helpers/CategoriesConstants";

import { ContentTikTok } from "./ContentTikTok";
import { ContentYoutube } from "./ContentYoutube";
import { ContentInsta } from "./ContentInsta";

import { SlidingSocials } from "./SlidingSocials";
import { SlidingCategories } from "./SlidingCategories";
import { SlidingItemLinks } from "./SlidingItemLinks";
import { SlidingHashtags } from "./SlidingHashtags";
import { ConfirmImport } from "./ConfirmImport";
import { ConfirmSelect } from "./ConfirmSelect";
import { ConfirmBack } from "./ConfirmBack";

import SlideshowOutlinedIcon from "@material-ui/icons/SlideshowOutlined";
import GridOnIcon from "@material-ui/icons/GridOn";
import WallpaperIcon from "@material-ui/icons/Wallpaper";
import BallotOutlinedIcon from "@material-ui/icons/BallotOutlined";

import { SimpleMiddleNotification } from "../../components/SimpleMiddleNotification";
import { downloadAndSaveTikToksWithRetry } from "../../helpers/CommonFunctions";
import { ContentCategory } from "./ContentCategory";
import { ContentInstructions } from "./ContentInstructions";

import { useSwipeable } from "react-swipeable";
import { makeStyles } from "@material-ui/core/styles";
import Collapse from "@material-ui/core/Collapse";
import SwapHorizOutlinedIcon from "@material-ui/icons/SwapHorizOutlined";
import ArrowBackIosOutlinedIcon from "@material-ui/icons/ArrowBackIosOutlined";
import PhotoLibraryIcon from "@material-ui/icons/PhotoLibrary";
import VideoLibraryIcon from "@material-ui/icons/VideoLibrary";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import AddIcon from "@material-ui/icons/Add";
import VolumeOffOutlinedIcon from "@material-ui/icons/VolumeOffOutlined";
import VolumeUpOutlinedIcon from "@material-ui/icons/VolumeUpOutlined";
import LoyaltyIcon from "@material-ui/icons/Loyalty";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import useOnScreen from "../../customHooks/useOnScreen";

import axios from "../../axios";

const useStyles = makeStyles((theme) => ({
  root: {
    height: 180,
  },
  container: {
    display: "flex",
  },
  paper: {
    margin: theme.spacing(1),
  },
  svg: {
    width: 100,
    height: 100,
  },
  polygon: {
    fill: theme.palette.common.white,
    stroke: theme.palette.divider,
    strokeWidth: 1,
  },
  buttonRoot: {
    backgroundColor: "#c7c7c7",
    color: "black",
  },
}));

const displayPreviewFile = (
  i,
  mediaType,
  url,
  coverImageUrl,
  tiktokCoverImageUrl,
  proCategories,
  heartSticker
) => {
  if (mediaType === "video") {
    return (
      <div
        className="content_tagging_video_box"
        style={{ position: "relative" }}
      >
        {proCategories.length > 0 || heartSticker.includes(i) ? (
          <LoyaltyIcon
            style={{ color: "rgb(182, 81, 81)" }}
            className="profile_bottom_imageOrVideoIcon"
          />
        ) : (
          <VideoLibraryIcon className="profile_bottom_imageOrVideoIcon" />
        )}
        <img
          className="content_tagging_video_box"
          src={tiktokCoverImageUrl ? tiktokCoverImageUrl : coverImageUrl}
        />
      </div>
    );
  } else if (mediaType === "image") {
    return (
      <div
        className="profile_bottom_grid_video"
        style={{ position: "relative" }}
      >
        <PhotoLibraryIcon className="profile_bottom_imageOrVideoIcon" />
        <img className="profile_bottom_grid_video" src={url} />
      </div>
    );
  }
};

export const ContentTagging = () => {
  const classes = useStyles();
  const [checked, setChecked] = useState(true);
  const history = useHistory();

  const [socialItems, setSocialItems] = useState({ items: [] });
  const [openSocials, setOpenSocials] = useState(false);

  // TIKTOK
  const [tiktokSocialLink, setTikTokSocialLink] = useState("");
  const [importing, setImporting] = useGlobalState("tiktokImporting");
  const [proCategories, setProCategories] = useGlobalState("proCategories");
  const [showPublishOnly, setShowPublishOnly] = useState(false);
  const [displayImage, setDisplayImage] = useState("");
  const [displayVideo, setDisplayVideo] = useState("");
  const [displayVideoId, setDisplayVideoId] = useState("");
  const [changesMade, setChangesMade] = useState(false);
  const [safeToEdit, setSafeToEdit] = useState(false);
  const [videos, setVideos] = useState([]);
  const [proVideos, setProVideos] = useState([]);
  const [showNotif, setShowNotif] = useState("");
  const [openContentCategory, setOpenContentCategory] = useState(false);
  const [openImport, setOpenImport] = useState(false);
  const [openSelect, setOpenSelect] = useState(-1);
  const [openSelect2, setOpenSelect2] = useState(false);
  const [videoI, setVideoI] = useState(0);
  const [heartSticker, setHeartSticker] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);
  const [categorySelection, setCategorySelection] = useState({});
  const setCategorySelectionTrack = (values) => {
    setChangesMade(true);
    setCategorySelection(values);
  };
  const [itemLinks, setItemLinks] = useState({ items: [] });
  const [previousLinks, setPreviousLinks] = useState([]);
  const [previousCats, setPreviousCats] = useState([]);
  const [previousSubCats, setPreviousSubCats] = useState([]);
  const [isPublish, setIsPublish] = useState(false);

  // TIKTOK

  // YOUTUBE
  const [youtubeSocialLink, setYoutubeSocialLink] = useState("");
  const [youtubeVideos, setYoutubeVideos] = useState([]);
  const [proYoutubeVideos, setProYoutubeVideos] = useState([]);
  const [youtubeVideoI, setYoutubeVideoI] = useState(0);
  const [youtubeItemLinks, setYoutubeItemLinks] = useState({ items: [] });
  const [youtubeDisplayImage, setYoutubeDisplayImage] = useState("");
  const [youtubeDisplayVideo, setYoutubeDisplayVideo] = useState("");
  const [youtubeDisplayVideoId, setYoutubeDisplayVideoId] = useState("");
  const [youtubeShowPublishOnly, setYoutubeShowPublishOnly] = useState(false);
  const [youtubeIsPublish, setYoutubeIsPublish] = useState(false);
  //YOUTUBE

  useEffect(() => {
    const userId = localStorage.getItem("USER_ID");
    if (userId) {
      axios.get("/v1/users/getPro/" + userId).then((response) => {
        let data = response.data[0];
        setSocialItems({ items: data.socialAccounts });
        for (const eachSocialAccount of data.socialAccounts) {
          if (eachSocialAccount.socialType == "Youtube") {
            setYoutubeSocialLink(eachSocialAccount.socialLink);
          }
          if (eachSocialAccount.socialType == "TikTok") {
            setTikTokSocialLink(eachSocialAccount.socialLink);
          }
        }

        if (data.showSocialSelections.length > 1) {
          setShowSocialSelections(data.showSocialSelections.slice(0, 3));
          setShowSocial(data.showSocialSelections[0][0]);
        } else {
          setShowSocialSelections([
            ["tiktok", "all"],
            ["youtube", "all_youtube"],
            ["instagram", "all_instagram"],
          ]);
          setShowSocial("tiktok");
        }

        // TIKTOK
        const sortedVideos = data.videos.sort((a, b) => {
          return b.tiktokCreatedAt - a.tiktokCreatedAt;
        });
        const reducedProVideo = [];
        const sortedProVideos = data.proVideos.sort((a, b) => {
          return b.tiktokCreatedAt - a.tiktokCreatedAt;
        });
        for (const eachProVideo of sortedProVideos) {
          reducedProVideo.push(eachProVideo._id);
        }
        setProVideos(reducedProVideo);
        setVideos(sortedVideos);

        setProCategories({ items: data.proCategories });
        setShowPublishOnly(data.tiktokProOrAll);
        setPreviousLinks(data.allProductLinks);
        setPreviousCats(data.previousMainHashtags);
        setPreviousSubCats(data.previousSubHashtags);

        if (sortedVideos.length > 0) {
          setDisplayImage(sortedVideos[0].coverImageUrl);
          setDisplayVideo(sortedVideos[0].url);
          setDisplayVideoId(sortedVideos[0]._id);
          setVideoI(0);

          if (reducedProVideo.includes(sortedVideos[0]._id)) {
            setIsPublish(true);
          } else {
            setIsPublish(false);
          }

          if (
            sortedVideos[0].proCategories &&
            sortedVideos[0].proCategories.length > 0
          ) {
            const catSelection = {};
            for (const eachProCat of sortedVideos[0].proCategories) {
              catSelection[eachProCat] = true;
            }
            setCategorySelection(catSelection);
          }
          if (
            sortedVideos[0].categories &&
            sortedVideos[0].categories.length > 0
          ) {
            setSelectedCategories(sortedVideos[0].categories);
            setSelectedSubCategories(sortedVideos[0].subCategories);
          }
          if (
            sortedVideos[0].affiliateProducts &&
            sortedVideos[0].affiliateProducts.length > 0
          ) {
            setItemLinks({ items: sortedVideos[0].affiliateProducts });
          }
        }
        // TIKTOK

        // YOUTUBE
        setYoutubeVideos(data.youtubeVideos);
        const reducedProYoutubeVideo = [];
        for (const eachProYoutubeVideo of data.proYoutubeVideos) {
          reducedProYoutubeVideo.push(eachProYoutubeVideo._id);
        }
        setProYoutubeVideos(reducedProYoutubeVideo);
        setYoutubeShowPublishOnly(data.youtubeProOrAll);

        if (data.youtubeVideos.length > 0) {
          setYoutubeDisplayImage(data.youtubeVideos[0].coverImageUrl);
          setYoutubeDisplayVideo(data.youtubeVideos[0].videoId);
          setYoutubeDisplayVideoId(data.youtubeVideos[0]._id);
          setVideoI(0);

          if (data.proYoutubeVideos.includes(data.youtubeVideos[0]._id)) {
            setYoutubeIsPublish(true);
          } else {
            setYoutubeIsPublish(false);
          }

          if (data.youtubeVideos[0].affiliateProducts.length > 0) {
            setYoutubeItemLinks({
              items: data.youtubeVideos[0].affiliateProducts,
            });
          }
        }

        // YOUTUBE

        if (response.status === 200) {
          setSafeToEdit(true);
        }
      });
    }
  }, []);

  const [showSocialSelections, setShowSocialSelections] = useState([]);
  const [showSocial, setShowSocial] = useState("");
  const [tempSocial, setTempSocial] = useState("");
  const [rearrangeCount, setRearrangeCount] = useState(1);
  const handleRearrangeSocials = () => {
    const socialArrangements = [
      [
        ["tiktok", "all"],
        ["youtube", "all_youtube"],
        ["instagram", "all_instagram"],
      ],
      [
        ["youtube", "all_youtube"],
        ["tiktok", "all"],
        ["instagram", "all_instagram"],
      ],
      [
        ["youtube", "all_youtube"],
        ["instagram", "all_instagram"],
        ["tiktok", "all"],
      ],
      [
        ["tiktok", "all"],
        ["instagram", "all_instagram"],
        ["youtube", "all_youtube"],
      ],
      [
        ["instagram", "all_instagram"],
        ["youtube", "all_youtube"],
        ["tiktok", "all"],
      ],
      [
        ["instagram", "all_instagram"],
        ["tiktok", "all"],
        ["youtube", "all_youtube"],
      ],
    ];

    setShowSocial(
      socialArrangements[rearrangeCount % socialArrangements.length][0][0]
    );
    setShowSocialSelections(
      socialArrangements[rearrangeCount % socialArrangements.length]
    );

    setRearrangeCount(rearrangeCount + 1);
  };

  useDidMountEffect(() => {
    if (safeToEdit) {
      axios
        .put("/v1/users/update/" + localStorage.getItem("USER_ID"), {
          showSocialSelections: [
            ...showSocialSelections,
            ["allProductLinks", "nil"],
          ],
        })
        .then((res) => {
          console.log("updated category selection");
        });
    }
  }, [showSocialSelections]);

  // edit socials
  const handleSocialsOpen = () => {
    if (safeToEdit) {
      setOpenSocials(true);
      window.history.pushState(
        {
          socials: "socials",
        },
        "",
        ""
      );
    }
  };
  const handleSocialsClose = async () => {
    if (safeToEdit) {
      const res = await axios.put(
        "/v1/users/update/" + localStorage.getItem("USER_ID"),
        {
          socialAccounts: socialItems.items,
        }
      );

      for (const eachSocialAccount of socialItems.items) {
        if (eachSocialAccount.socialType == "Youtube") {
          setYoutubeSocialLink(eachSocialAccount.socialLink);
        }
        if (eachSocialAccount.socialType == "TikTok") {
          setTikTokSocialLink(eachSocialAccount.socialLink);
        }
      }

      if (res.status === 201) {
        setShowNotif("Saved");
        setTimeout(() => {
          setShowNotif("");
        }, 3000);
      } else {
        setShowNotif("Error");
      }

      setOpenSocials(false);
    }
  };
  const handleSocialsPop = useCallback(() => {
    setOpenSocials(false);
  }, []);
  useDidMountEffect(() => {
    if (openSocials) {
      window.addEventListener("popstate", handleSocialsPop);
    } else {
      handleSocialsClose();
      window.removeEventListener("popstate", handleSocialsPop);
    }

    return () => {
      window.removeEventListener("popstate", handleSocialsPop);
    };
  }, [openSocials]);

  const [instructionsOpen, setInstructionsOpen] = useState(false);

  return (
    <div className="SlidingEdit_Body">
      <div className="SlidingEdit_Header" style={{ border: "none" }}>
        <ArrowBackIosOutlinedIcon
          onClick={() => {
            if (changesMade) {
              setOpenSelect2(true);
            } else {
              history.push({
                pathname: "/ProEdit",
              });
            }
          }}
          style={{ paddingLeft: 10 }}
        />
        <span
          style={{
            fontSize: 14,
            position: "absolute",
            fontWeight: 700,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          Content Tagging
        </span>
      </div>
      <div
        className="pro_profile_social_selector"
        style={{
          borderBottom: "1px solid lightgrey",
          position: "relative",
          zIndex: "1",
        }}
      >
        <SwapHorizOutlinedIcon
          style={{
            position: "absolute",
            right: 5,
            top: 0,
            fontSize: 22,
            marginTop: "-5px",
          }}
          onClick={handleRearrangeSocials}
        />
        {showSocialSelections.map(([social, socialId]) => {
          return (
            <div
              className="pro_profile_social_selector_line"
              style={
                showSocial == social
                  ? {
                      borderBottom: `2px solid black`,
                    }
                  : {
                      borderBottom: `2px solid lightgrey`,
                    }
              }
              onClick={() => {
                if (changesMade) {
                  setOpenSelect(true);
                  setTempSocial(social);
                } else {
                  setShowSocial(social);
                }
              }}
            >
              {social == "tiktok" ? (
                <div className="pro_profile_icon_and_name">
                  <GridOnIcon
                    style={
                      showSocial == social
                        ? { fontSize: 22, color: "black" }
                        : {
                            fontSize: 22,
                            color: "lightgrey",
                          }
                    }
                  />
                  <p
                    style={
                      showSocial == social
                        ? null
                        : {
                            color: "lightgrey",
                          }
                    }
                  >
                    TikTok
                  </p>
                </div>
              ) : social == "youtube" ? (
                <div className="pro_profile_icon_and_name">
                  <SlideshowOutlinedIcon
                    style={
                      showSocial == social
                        ? { fontSize: 25, color: "black" }
                        : {
                            fontSize: 25,
                            color: "lightgrey",
                          }
                    }
                  />
                  <p
                    style={
                      showSocial == social
                        ? null
                        : {
                            color: "lightgrey",
                          }
                    }
                  >
                    YouTube
                  </p>
                </div>
              ) : social == "instagram" ? (
                <div className="pro_profile_icon_and_name">
                  <WallpaperIcon
                    style={
                      showSocial == social
                        ? { fontSize: 22, color: "black" }
                        : {
                            fontSize: 22,
                            color: "lightgrey",
                          }
                    }
                  />
                  <p
                    style={
                      showSocial == social
                        ? null
                        : {
                            color: "lightgrey",
                          }
                    }
                  >
                    Instagram
                  </p>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
      {safeToEdit && showSocial === "tiktok" && (
        <ContentTikTok
          tiktokSocialLink={tiktokSocialLink}
          setCategorySelection={setCategorySelection}
          setVideos={setVideos}
          setVideoI={setVideoI}
          setSelectedCategories={setSelectedCategories}
          setSelectedSubCategories={setSelectedSubCategories}
          videos={videos}
          setDisplayVideo={setDisplayVideo}
          setDisplayImage={setDisplayImage}
          setDisplayVideoId={setDisplayVideoId}
          safeToEdit={safeToEdit}
          proCategories={proCategories}
          previousCats={previousCats}
          previousSubCats={previousSubCats}
          selectedCategories={selectedCategories}
          categorySelection={categorySelection}
          selectedSubCategories={selectedSubCategories}
          displayVideoId={displayVideoId}
          videoI={videoI}
          setPreviousCats={setPreviousCats}
          setPreviousSubCats={setPreviousSubCats}
          displayImage={displayImage}
          displayVideo={displayVideo}
          setProCategories={setProCategories}
          previousLinks={previousLinks}
          setPreviousLinks={setPreviousLinks}
          itemLinks={itemLinks}
          setItemLinks={setItemLinks}
          changesMade={changesMade}
          setChangesMade={setChangesMade}
          setInstructionsOpen={setInstructionsOpen}
          showPublishOnly={showPublishOnly}
          setShowPublishOnly={setShowPublishOnly}
          proVideos={proVideos}
          setProVideos={setProVideos}
          isPublish={isPublish}
          setIsPublish={setIsPublish}
        />
      )}
      {safeToEdit && showSocial === "youtube" && (
        <ContentYoutube
          safeToEdit={safeToEdit}
          youtubeSocialLink={youtubeSocialLink}
          youtubeVideos={youtubeVideos}
          setYoutubeVideos={setYoutubeVideos}
          previousLinks={previousLinks}
          setPreviousLinks={setPreviousLinks}
          youtubeVideoI={youtubeVideoI}
          setYoutubeVideoI={setYoutubeVideoI}
          youtubeItemLinks={youtubeItemLinks}
          setYoutubeItemLinks={setYoutubeItemLinks}
          youtubeDisplayImage={youtubeDisplayImage}
          setYoutubeDisplayImage={setYoutubeDisplayImage}
          youtubeDisplayVideo={youtubeDisplayVideo}
          setYoutubeDisplayVideo={setYoutubeDisplayVideo}
          youtubeDisplayVideoId={youtubeDisplayVideoId}
          setYoutubeDisplayVideoId={setYoutubeDisplayVideoId}
          socialItems={socialItems}
          setSocialItems={setSocialItems}
          changesMade={changesMade}
          setChangesMade={setChangesMade}
          setInstructionsOpen={setInstructionsOpen}
          youtubeShowPublishOnly={youtubeShowPublishOnly}
          setYoutubeShowPublishOnly={setYoutubeShowPublishOnly}
          proYoutubeVideos={proYoutubeVideos}
          setProYoutubeVideos={setProYoutubeVideos}
          youtubeIsPublish={youtubeIsPublish}
          setYoutubeIsPublish={setYoutubeIsPublish}
        />
      )}

      {safeToEdit && showSocial === "instagram" && <ContentInsta />}

      <ConfirmSelect
        openSelect={openSelect}
        setOpenSelect={setOpenSelect}
        handleSelectVideo={() => {
          setShowSocial(tempSocial);
        }}
        setChangesMade={setChangesMade}
      />

      <ConfirmBack
        openSelect2={openSelect2}
        setOpenSelect2={setOpenSelect2}
        setChangesMade={setChangesMade}
      />

      <SlidingSocials
        openSocials={openSocials}
        socialItems={socialItems}
        setSocialItems={setSocialItems}
      />

      <ContentInstructions
        open={instructionsOpen}
        setInstructionsOpen={setInstructionsOpen}
        handleSocialsOpen={handleSocialsOpen}
      />

      {showNotif && <SimpleMiddleNotification message={showNotif} />}
    </div>
  );
};
