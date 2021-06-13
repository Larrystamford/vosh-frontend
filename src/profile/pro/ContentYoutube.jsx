import React, { useState, useEffect, useRef, useCallback } from "react";
import "./ProEdit.css";
import { useGlobalState } from "../../GlobalStates";
import { useHistory } from "react-router";
import { useDidMountEffect } from "../../customHooks/useDidMountEffect";
import * as constants from "../../helpers/CategoriesConstants";

import { SlidingItemLinks } from "./SlidingItemLinks";
import { ConfirmImport } from "./ConfirmImport";
import { ConfirmSelect } from "./ConfirmSelect";
import { ConfirmBack } from "./ConfirmBack";
import { ConfirmYoutubeImport } from "./ConfirmYoutubeImport";

import SlideshowOutlinedIcon from "@material-ui/icons/SlideshowOutlined";
import GridOnIcon from "@material-ui/icons/GridOn";
import WallpaperIcon from "@material-ui/icons/Wallpaper";
import BallotOutlinedIcon from "@material-ui/icons/BallotOutlined";

import { SimpleMiddleNotification } from "../../components/SimpleMiddleNotification";
import { downloadAndSaveTikToksWithRetry } from "../../helpers/CommonFunctions";
import { ContentCategory } from "./ContentCategory";

import { useSwipeable } from "react-swipeable";
import { makeStyles } from "@material-ui/core/styles";
import Collapse from "@material-ui/core/Collapse";
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

import Checkbox from "@material-ui/core/Checkbox";

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

const displayPreviewFile = (i, coverImageUrl, proYoutubeVideos, videoId) => {
  return (
    <div className="content_tagging_video_box" style={{ position: "relative" }}>
      {proYoutubeVideos.includes(videoId) ? (
        <LoyaltyIcon
          style={{ color: "rgb(182, 81, 81)" }}
          className="profile_bottom_imageOrVideoIcon"
        />
      ) : (
        <VideoLibraryIcon className="profile_bottom_imageOrVideoIcon" />
      )}
      <img className="content_tagging_video_box" src={coverImageUrl} />
    </div>
  );
};

export const ContentYoutube = ({
  safeToEdit,
  youtubeSocialLink,
  youtubeVideos,
  setYoutubeVideos,
  previousLinks,
  setPreviousLinks,
  youtubeVideoI,
  setYoutubeVideoI,
  youtubeItemLinks,
  setYoutubeItemLinks,
  youtubeDisplayImage,
  setYoutubeDisplayImage,
  youtubeDisplayVideo,
  setYoutubeDisplayVideo,
  youtubeDisplayVideoId,
  setYoutubeDisplayVideoId,
  socialItems,
  setSocialItems,
  changesMade,
  setChangesMade,
  setInstructionsOpen,
  youtubeShowPublishOnly,
  setYoutubeShowPublishOnly,
  proYoutubeVideos,
  setProYoutubeVideos,
  youtubeIsPublish,
  setYoutubeIsPublish,
}) => {
  const [youtubeImporting, setYoutubeImporting] = useState(false);
  const [openImport, setOpenImport] = useState(false);

  useEffect(() => {
    if (!youtubeSocialLink) {
      setInstructionsOpen(true);
    }
  }, []);
  const classes = useStyles();
  const [checked, setChecked] = useState(true);

  const history = useHistory();

  const [showNotif, setShowNotif] = useState("");
  const [openSelect, setOpenSelect] = useState(-1);
  const [openSelect2, setOpenSelect2] = useState(false);

  const handleImportClicked = async () => {
    setYoutubeImporting(true);

    let isMounted = true; // note this flag denote mount status

    const userId = localStorage.getItem("USER_ID");
    if (userId) {
      axios
        .post("/v1/youtube/getYoutubeVideosByChannel/", {
          userId: userId,
        })
        .then((response) => {
          let youtubeVideos = response.data.youtubeVideos;

          if (isMounted) {
            setYoutubeVideos(youtubeVideos);
            alert("Import done");
          }

          setYoutubeImporting(false);
        })
        .catch((err) => {
          setYoutubeImporting(false);
          alert("Import Error. Check if your youtube channel link is correct.");
        });
    }

    return () => {
      isMounted = false;
    };
  };

  const handleSelectVideoWithChanges = (i) => {
    if (changesMade) {
      setOpenSelect(i);
    } else {
      handleSelectVideo(i);
    }
  };

  const handleSelectVideo = (i) => {
    setChecked(true);

    if (proYoutubeVideos.includes(youtubeVideos[i]._id)) {
      setYoutubeIsPublish(true);
    } else {
      setYoutubeIsPublish(false);
    }

    setYoutubeVideoI(i);
    setYoutubeItemLinks({ items: [] });
    setYoutubeDisplayImage(youtubeVideos[i].coverImageUrl);
    setYoutubeDisplayVideo(youtubeVideos[i].videoId);
    setYoutubeDisplayVideoId(youtubeVideos[i]._id);

    if (
      youtubeVideos[i].affiliateProducts &&
      youtubeVideos[i].affiliateProducts.length > 0
    ) {
      setYoutubeItemLinks({ items: youtubeVideos[i].affiliateProducts });
    }
  };

  const [openItemLinks, setOpenItemLinks] = useState(false);
  const handleItemLinksOpen = () => {
    setOpenItemLinks(true);
    window.history.pushState(
      {
        youtubeItemLinks: "youtubeItemLinks",
      },
      "",
      ""
    );
  };
  useDidMountEffect(() => {
    const handleItemLinksPop = () => {
      setOpenItemLinks(false);
    };

    if (openItemLinks) {
      window.addEventListener("popstate", handleItemLinksPop);
    } else {
      window.removeEventListener("popstate", handleItemLinksPop);
    }

    return () => {
      window.removeEventListener("popstate", handleItemLinksPop);
    };
  }, [openItemLinks]);

  // submit
  const handleSubmit = async () => {
    try {
      const res = await axios.put(
        "/v1/youtube/update/" + youtubeDisplayVideoId,
        {
          affiliateGroupName: "Links",
          affiliateProducts: youtubeItemLinks.items,
        }
      );

      const res1 = await axios.put(
        "/v1/users/pushPreviousProductLinks/" + localStorage.getItem("USER_ID"),
        {
          allProductLinks: youtubeItemLinks.items,
          proYoutubeVideos: youtubeDisplayVideoId,
        }
      );

      if (res.status === 201 && res1.status === 201) {
        setShowNotif("Saved");
        setTimeout(() => {
          setShowNotif("");
        }, 3000);
      } else {
        setShowNotif("Error");
      }

      setChangesMade(false);
      setProYoutubeVideos([...proYoutubeVideos, youtubeDisplayVideoId]);
      setYoutubeIsPublish(true);

      youtubeVideos[youtubeVideoI].affiliateProducts = youtubeItemLinks.items;
    } catch {
      alert("Try publishing again");
    }
  };

  const handleUnsubmit = async () => {
    try {
      const res = await axios.put("/v1/youtube/unpublish", {
        userId: localStorage.getItem("USER_ID"),
        videoId: youtubeDisplayVideoId,
      });

      if (res.status === 201) {
        setShowNotif("Saved");
        setTimeout(() => {
          setShowNotif("");
        }, 3000);
      } else {
        setShowNotif("Error");
      }

      setChangesMade(false);
      setProYoutubeVideos(
        proYoutubeVideos.filter((e) => e !== youtubeDisplayVideoId)
      );
      setYoutubeIsPublish(false);
    } catch {
      alert("Try publishing again");
    }
  };

  const topRef = useRef();
  const isVisible = useOnScreen(topRef);

  const handlers = useSwipeable({
    onSwiped: (event) => {
      if (event.dir === "Up") {
        setChecked(false);
      } else if (event.dir === "Down" && isVisible) {
        setChecked(true);
      }
    },
    ...{ delta: 15, trackMouse: true, trackTouch: true },
  });

  const handlePublishToggle = async () => {
    try {
      await axios.put("/v1/youtube/youtubeProOrAll/", {
        userId: localStorage.getItem("USER_ID"),
        youtubeProOrAll: !youtubeShowPublishOnly,
      });
      setYoutubeShowPublishOnly(!youtubeShowPublishOnly);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="Tagging_Main">
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "12px",
          position: "absolute",
          top: 0,
          right: 0,
        }}
      >
        <p>show viewers published videos only</p>
        <Checkbox
          checked={youtubeShowPublishOnly}
          onChange={handlePublishToggle}
          color="secondary"
        />
      </div>

      <Collapse in={checked}>
        <div className="Tagging_Top_Main_Youtube">
          <div className="Tagging_Top_Main_Youtube_video">
            <iframe
              width="300"
              height="170"
              src={"https://www.youtube.com/embed/" + youtubeDisplayVideo}
            ></iframe>
          </div>

          <div className="Tagging_Top_Main_Youtube_Tag_Body">
            <div
              className="Tagging_Choices"
              onClick={handleItemLinksOpen}
              style={
                changesMade && youtubeItemLinks.items.length > 0
                  ? {
                      border: "1px solid orange",
                      width: "7rem",
                      height: "2.6rem",
                    }
                  : {
                      border: "1px solid lightgrey",
                      width: "7rem",
                      height: "2.6rem",
                    }
              }
            >
              Add Links
            </div>

            {youtubeIsPublish ? (
              <Button
                style={{ height: "2.7rem", width: "7rem", marginTop: "2rem" }}
                variant="contained"
                size="small"
                className={classes.button}
                color="secondary"
                onClick={handleUnsubmit}
              >
                Unpublish
              </Button>
            ) : (
              <Button
                style={{ height: "2.7rem", width: "7rem", marginTop: "2rem" }}
                variant="contained"
                size="small"
                className={classes.button}
                color="secondary"
                onClick={handleSubmit}
              >
                Publish
              </Button>
            )}
          </div>
        </div>
      </Collapse>
      <Collapse {...handlers} in={checked} collapsedHeight={"95vh"}>
        <div className="gallery_slider_header">
          <div className="SlidingEdit_TypeLeft">
            <p style={{ fontSize: 15, fontWeight: "bold" }}>Gallery</p>
          </div>
          {!checked && (
            <div
              style={{
                marginTop: 15,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: 10,
              }}
            >
              <ExpandMoreIcon style={{ fontSize: 24 }} />
              <p style={{ fontSize: 9 }}>Drag Down</p>
            </div>
          )}
          <div className="SlidingEdit_TypeAndIcon">
            {youtubeImporting ? (
              <Button
                variant="contained"
                classes={{
                  root: classes.buttonRoot,
                }}
                size="small"
                className={classes.button}
                startIcon={
                  <CircularProgress size={20} style={{ color: "white" }} />
                }
              >
                Importing
              </Button>
            ) : (
              <Button
                variant="contained"
                size="small"
                className={classes.button}
                onClick={() => {
                  setOpenImport(true);
                }}
                color="primary"
              >
                Import
              </Button>
            )}
          </div>
        </div>
        <div {...handlers} className="gallery_slider_body_wrapper">
          <div className="gallery_slider_body">
            {youtubeVideos.length > 0 ? (
              <div
                ref={topRef}
                className="gallery_image_box"
                onClick={() => handleSelectVideoWithChanges(0)}
                style={
                  0 === youtubeVideoI ? { border: "3px solid #f5f5f5" } : null
                }
              >
                {displayPreviewFile(
                  0,
                  youtubeVideos[0].coverImageUrl,
                  proYoutubeVideos,
                  youtubeVideos[0]._id
                )}
              </div>
            ) : (
              <div ref={topRef} className="gallery_image_box"></div>
            )}

            {youtubeVideos.slice(1).map((eachVideo, i) => (
              <div
                className="gallery_image_box"
                onClick={() => handleSelectVideoWithChanges(i + 1)}
                style={
                  i + 1 === youtubeVideoI
                    ? { border: "3px solid #f5f5f5" }
                    : null
                }
              >
                {displayPreviewFile(
                  i + 1,
                  eachVideo.coverImageUrl,
                  proYoutubeVideos,
                  youtubeVideos[i + 1]._id
                )}
              </div>
            ))}
            <div className="gallery_image_box"></div>
            <div className="gallery_image_box"></div>
            <div className="gallery_image_box"></div>
            <div className="gallery_image_box"></div>
          </div>
        </div>
      </Collapse>

      <SlidingItemLinks
        openItemLinks={openItemLinks}
        itemLinks={youtubeItemLinks}
        setItemLinks={setYoutubeItemLinks}
        previousLinks={previousLinks}
        setPreviousLinks={setPreviousLinks}
        setChangesMade={setChangesMade}
      />

      <ConfirmYoutubeImport
        openImport={openImport}
        setOpenImport={setOpenImport}
        handleImportClicked={handleImportClicked}
      />

      <ConfirmSelect
        openSelect={openSelect}
        setOpenSelect={setOpenSelect}
        handleSelectVideo={handleSelectVideo}
        setChangesMade={setChangesMade}
      />

      {showNotif && <SimpleMiddleNotification message={showNotif} />}
    </div>
  );
};
