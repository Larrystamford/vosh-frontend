import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import React, { useState, useEffect } from "react";
import "./ProEdit.css";
import { useGlobalState } from "../../GlobalStates";
import { useHistory } from "react-router";
import { useDidMountEffect } from "../../customHooks/useDidMountEffect";

import { SlidingSocials } from "./SlidingSocials";
import { SlidingLinks } from "./SlidingLinks";
import { SlidingCategories } from "./SlidingCategories";
import { SimpleBottomNotification } from "../../components/SimpleBottomNotification";
import { downloadAndSaveTikToks } from "../../helpers/CommonFunctions";

import { useSwipeable } from "react-swipeable";
import { makeStyles } from "@material-ui/core/styles";
import Switch from "@material-ui/core/Switch";
import Paper from "@material-ui/core/Paper";
import Collapse from "@material-ui/core/Collapse";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import TextField from "@material-ui/core/TextField";
import ClearOutlinedIcon from "@material-ui/icons/ClearOutlined";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import ArrowBackIosOutlinedIcon from "@material-ui/icons/ArrowBackIosOutlined";
import ArrowForwardIosOutlinedIcon from "@material-ui/icons/ArrowForwardIosOutlined";
import LinkOutlinedIcon from "@material-ui/icons/LinkOutlined";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import CategoryOutlinedIcon from "@material-ui/icons/CategoryOutlined";
import LoyaltyOutlinedIcon from "@material-ui/icons/LoyaltyOutlined";
import PhotoLibraryIcon from "@material-ui/icons/PhotoLibrary";
import VideoLibraryIcon from "@material-ui/icons/VideoLibrary";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";

import axios from "../../axios";
import { Exception } from "../../components/tracking/Tracker";

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
}));

const displayPreviewFile = (mediaType, url, coverImageUrl) => {
  if (mediaType == "video") {
    return (
      <div
        className="profile_bottom_grid_video"
        style={{ position: "relative" }}
      >
        <VideoLibraryIcon className="profile_bottom_imageOrVideoIcon" />
        <img className="profile_bottom_grid_video" src={coverImageUrl} />
      </div>
    );
  } else if (mediaType == "image") {
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
  const [importing, setImporting] = useGlobalState("tiktokImporting");

  const classes = useStyles();
  const [checked, setChecked] = React.useState(true);

  const history = useHistory();
  const [safeToEdit, setSafeToEdit] = useState(false);
  const [videos, setVideos] = useState([]);
  const [proVideos, setProVideos] = useState([]);
  const [proCategories, setProCategories] = useState({ items: [] });
  const [showNotif, setShowNotif] = useState("");

  const handlers = useSwipeable({
    onSwiped: (event) => {
      if (event.dir == "Up") {
        setChecked(false);
      } else if (event.dir == "Down") {
        setChecked(true);
      }
    },
    ...{ delta: 15, trackMouse: true, trackTouch: true },
  });

  useEffect(() => {
    const userId = localStorage.getItem("USER_ID");
    if (userId) {
      axios.get("/v1/users/get/" + userId).then((response) => {
        let data = response.data[0];
        setProCategories({ items: data.proCategories });
        setProVideos(data.proVideos.reverse());
        setVideos(data.videos.reverse());

        if (response.status == 200) {
          setSafeToEdit(true);
        }
      });
    }
  }, []);

  const handleImportClicked = async () => {
    setSafeToEdit(false);
    setImporting(true);
    await downloadAndSaveTikToks();
    setImporting(false);

    const userId = localStorage.getItem("USER_ID");
    if (userId) {
      axios.get("/v1/users/get/" + userId).then((response) => {
        let data = response.data[0];
        setVideos(data.videos.reverse());

        if (response.status == 200) {
          setSafeToEdit(true);
        }
      });
    }

    console.log("import success");
  };

  // edit categories
  const [openCategories, setOpenCategories] = useState(false);
  const handleCategoriesOpen = () => {
    if (safeToEdit) {
      setOpenCategories(true);
      window.history.pushState(
        {
          categories: "categories",
        },
        "",
        ""
      );
    }
  };
  const handleCategoriesClose = async (updatedCategories) => {
    if (safeToEdit) {
      const res = await axios.put(
        "/v1/users/update/" + localStorage.getItem("USER_ID"),
        {
          proCategories: updatedCategories,
        }
      );

      if (res.status == 201) {
        setShowNotif("Saved");
        setTimeout(() => {
          setShowNotif("");
        }, 3000);
      } else {
        setShowNotif("Error");
      }

      setOpenCategories(false);
      window.history.back();
    }
  };
  useDidMountEffect(() => {
    const handleCategoriesPop = () => {
      setOpenCategories(false);
    };

    if (openCategories) {
      window.addEventListener("popstate", handleCategoriesPop);
    } else {
      window.removeEventListener("popstate", handleCategoriesPop);
    }
  }, [openCategories]);

  return (
    <div className="SlidingEdit_Body">
      <div className="SlidingEdit_Header">
        <ArrowBackIosOutlinedIcon
          onClick={() => {
            history.goBack();
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

      <div className="Tagging_Main">
        <Collapse in={checked}>
          <div className="Tagging_Top_Main">Editing</div>
        </Collapse>
        <Collapse {...handlers} in={checked} collapsedHeight={"95vh"}>
          <div className="gallery_slider_header">
            <div className="SlidingEdit_TypeLeft">
              <p style={{ fontSize: 15, fontWeight: "bold" }}>Gallery</p>
            </div>
            <div className="SlidingEdit_TypeAndIcon">
              {importing ? (
                <Button
                  variant="contained"
                  color="primary"
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
                  color="primary"
                  size="small"
                  className={classes.button}
                  onClick={handleImportClicked}
                >
                  Import
                </Button>
              )}
            </div>
          </div>
          <div className="gallery_slider_body">
            {videos.map((eachVideo, i) => (
              <div className="gallery_image_box">
                {displayPreviewFile(
                  eachVideo.mediaType,
                  eachVideo.url,
                  eachVideo.coverImageUrl
                )}
              </div>
            ))}
          </div>
        </Collapse>
      </div>

      <SlidingCategories
        openCategories={openCategories}
        handleCategoriesClose={handleCategoriesClose}
        proCategories={proCategories}
        setProCategories={setProCategories}
      />

      {showNotif && <SimpleBottomNotification message={showNotif} />}
    </div>
  );
};
