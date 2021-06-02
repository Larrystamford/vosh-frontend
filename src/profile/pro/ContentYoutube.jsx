import React, { useState, useEffect, useRef } from "react";
import "./ProEdit.css";
import { useGlobalState } from "../../GlobalStates";
import { useHistory } from "react-router";
import { useDidMountEffect } from "../../customHooks/useDidMountEffect";
import * as constants from "../../helpers/CategoriesConstants";

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
  coverImageUrl,
  heartSticker,
  youtubeItemLinks
) => {
  return (
    <div className="content_tagging_video_box" style={{ position: "relative" }}>
      {youtubeItemLinks.items.length > 0 || heartSticker.includes(i) ? (
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
  youtubeVideos,
  setYoutubeVideos,
  previousLinks,
  setPreviousLinks,
  youtubeImporting,
  setYoutubeImporting,
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
}) => {
  const classes = useStyles();
  const [checked, setChecked] = useState(true);

  const history = useHistory();

  const [changesMade, setChangesMade] = useState(false);

  const [proyoutubeVideos, setProyoutubeVideos] = useState([]);
  const [showNotif, setShowNotif] = useState("");
  const [openContentCategory, setOpenContentCategory] = useState(false);
  const [openImport, setOpenImport] = useState(false);
  const [openSelect, setOpenSelect] = useState(-1);
  const [openSelect2, setOpenSelect2] = useState(false);

  const [heartSticker, setHeartSticker] = useState([]);

  const handleImportClicked = async () => {
    let isMounted = true; // note this flag denote mount status

    setYoutubeImporting(true);

    const result = await downloadAndSaveTikToksWithRetry(1);

    const userId = localStorage.getItem("USER_ID");
    if (userId) {
      axios
        .post("/v1/youtube/getYoutubeyoutubeVideosByChannel/", {
          userId: userId,
          channelLink:
            "https://www.youtube.com/channel/UCoqWWM5IKCiPqDisy4lD47g",
        })
        .then((response) => {
          let data = response.data[0];

          if (isMounted) {
            setYoutubeVideos(data.youtubeVideos);
          }
        });
    }

    if (result === "success") {
      alert("Import done");
    }

    setYoutubeImporting(false);

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
  }, [openItemLinks]);

  // submit
  const handleSubmit = async () => {
    if (youtubeItemLinks.items.length === 0) {
      alert("Add at least one product link");
    } else {
      try {
        // const res = await axios.put(
        //   "/v1/video/update/" + youtubeDisplayVideoId,
        //   {
        //     categories: selectedCategories,
        //     subCategories: selectedSubCategories,
        //     proCategories: proCategoriesUpdate,
        //     affiliateGroupName: "Products",
        //     affiliateProducts: youtubeItemLinks.items,
        //   }
        // );

        // const res2 = await axios.put(
        //   "/v1/users/pushPreviousProductLinks/" +
        //     localStorage.getItem("USER_ID"),
        //   {
        //     allProductLinks: youtubeItemLinks.items,
        //     proVideo: youtubeDisplayVideoId,
        //   }
        // );

        // if (res.status === 201 && res1.status === 201 && res2.status === 201) {
        //   setShowNotif("Saved");
        //   setTimeout(() => {
        //     setShowNotif("");
        //   }, 3000);
        // } else {
        //   setShowNotif("Error");
        // }

        setHeartSticker([...heartSticker, youtubeVideoI]);
        setChangesMade(false);

        youtubeVideos[youtubeVideoI].affiliateProducts = youtubeItemLinks.items;
      } catch {
        alert("Try publishing again");
      }
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

  return (
    <div className="Tagging_Main">
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
              Links
            </div>

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
                  heartSticker,
                  youtubeItemLinks
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
                  heartSticker,
                  youtubeItemLinks
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

      <ConfirmImport
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

      <ConfirmBack
        openSelect2={openSelect2}
        setOpenSelect2={setOpenSelect2}
        setChangesMade={setChangesMade}
      />

      {showNotif && <SimpleMiddleNotification message={showNotif} />}
    </div>
  );
};
