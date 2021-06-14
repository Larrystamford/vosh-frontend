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

import Checkbox from "@material-ui/core/Checkbox";

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
  mediaType,
  url,
  coverImageUrl,
  tiktokCoverImageUrl,
  proCategories,
  proVideos,
  videoId
) => {
  if (mediaType === "video") {
    return (
      <div
        className="content_tagging_video_box"
        style={{ position: "relative" }}
      >
        {proVideos.includes(videoId) ? (
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

export const ContentTikTok = ({
  tiktokSocialLink,
  setCategorySelection,
  setVideos,
  setVideoI,
  setSelectedCategories,
  setSelectedSubCategories,
  videos,
  setDisplayVideo,
  setDisplayImage,
  setDisplayVideoId,
  safeToEdit,
  proCategories,
  previousCats,
  previousSubCats,
  selectedCategories,
  categorySelection,
  selectedSubCategories,
  displayVideoId,
  videoI,
  setPreviousCats,
  setPreviousSubCats,
  displayImage,
  displayVideo,
  setProCategories,
  previousLinks,
  setPreviousLinks,
  itemLinks,
  setItemLinks,
  changesMade,
  setChangesMade,
  setInstructionsOpen,
  showPublishOnly,
  setShowPublishOnly,
  proVideos,
  setProVideos,
  isPublish,
  setIsPublish,
}) => {
  useEffect(() => {
    if (!tiktokSocialLink) {
      setInstructionsOpen(true);
    }
  }, []);

  const [importing, setImporting] = useGlobalState("tiktokImporting");

  const classes = useStyles();
  const [checked, setChecked] = useState(true);

  const history = useHistory();

  const [showNotif, setShowNotif] = useState("");
  const [openContentCategory, setOpenContentCategory] = useState(false);
  const [openImport, setOpenImport] = useState(false);
  const [openSelect, setOpenSelect] = useState(-1);
  const [openSelect2, setOpenSelect2] = useState(false);

  const [heartSticker, setHeartSticker] = useState([]);

  const setCategorySelectionTrack = (values) => {
    setChangesMade(true);
    setCategorySelection(values);
  };

  const handleImportClicked = async () => {
    let isMounted = true; // note this flag denote mount status

    setImporting(true);

    const result = await downloadAndSaveTikToksWithRetry(1);

    const userId = localStorage.getItem("USER_ID");
    if (userId) {
      axios
        .get("/v1/users/getPro/" + userId)
        .then((response) => {
          let data = response.data[0];

          if (isMounted) {
            setVideos(
              data.videos.sort((a, b) => {
                return b.tiktokCreatedAt - a.tiktokCreatedAt;
              })
            );
          }
          setImporting(false);
        })
        .catch((err) => {
          setImporting(false);
        });
    }

    if (result === "success") {
      alert("Import done");
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

    if (proVideos.includes(videos[i]._id)) {
      setIsPublish(true);
    } else {
      setIsPublish(false);
    }

    setVideoI(i);
    setCategorySelection({});
    setSelectedCategories([]);
    setSelectedSubCategories([]);
    setItemLinks({ items: [] });

    setDisplayImage(videos[i].coverImageUrl);
    setDisplayVideo(videos[i].url);
    setDisplayVideoId(videos[i]._id);

    if (videos[i].proCategories && videos[i].proCategories.length > 0) {
      const catSelection = {};
      for (const eachProCat of videos[i].proCategories) {
        catSelection[eachProCat] = true;
      }
      setCategorySelection(catSelection);
    }

    if (videos[i].categories && videos[i].categories.length > 0) {
      setSelectedCategories(videos[i].categories);
      setSelectedSubCategories(videos[i].subCategories);
    }

    if (videos[i].affiliateProducts && videos[i].affiliateProducts.length > 0) {
      setItemLinks({ items: videos[i].affiliateProducts });
    }
  };

  const [muted, setMuted] = useState(true);

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
  const handleCategoriesClose = async () => {
    if (safeToEdit) {
      const res = await axios.put(
        "/v1/users/update/" + localStorage.getItem("USER_ID"),
        {
          proCategories: proCategories.items,
        }
      );

      if (res.status === 201) {
        setShowNotif("Saved");
        setTimeout(() => {
          setShowNotif("");
        }, 3000);
      } else {
        setShowNotif("Error");
      }

      setOpenCategories(false);
    }
  };
  useDidMountEffect(() => {
    const handleCategoriesPop = () => {
      setOpenCategories(false);
    };

    if (openCategories) {
      window.addEventListener("popstate", handleCategoriesPop);
    } else {
      handleCategoriesClose();
      window.removeEventListener("popstate", handleCategoriesPop);
    }

    return () => {
      window.removeEventListener("popstate", handleCategoriesPop);
    };
  }, [openCategories]);

  const [openItemLinks, setOpenItemLinks] = useState(false);
  const handleItemLinksOpen = () => {
    setOpenItemLinks(true);
    window.history.pushState(
      {
        itemLinks: "itemLinks",
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

  // edit hashtags
  const [openHashtags, setOpenHashtags] = useState(false);
  const handleHashtagsOpen = () => {
    setOpenHashtags(true);
    window.history.pushState(
      {
        hashtags: "hashtags",
      },
      "",
      ""
    );
  };
  useDidMountEffect(() => {
    const handleHashtagsPop = () => {
      setOpenHashtags(false);
    };

    if (openHashtags) {
      window.addEventListener("popstate", handleHashtagsPop);
    } else {
      window.removeEventListener("popstate", handleHashtagsPop);
    }
  }, [openHashtags]);

  const handleLoadPreviousHashtags = () => {
    setChangesMade(true);
    setSelectedCategories(previousCats);
    setSelectedSubCategories(previousSubCats);
  };

  // when done with adding selecting categories
  const handleDoneCategories = (openAddCategories) => {
    setOpenContentCategory(false);

    if (openAddCategories) {
      setTimeout(handleCategoriesOpen, 600);
    }
  };

  // hashtags
  const handleSetCategory = (category) => {
    if (selectedCategories.includes(category)) {
      for (var i = selectedCategories.length - 1; i >= 0; i--) {
        if (selectedCategories[i] === category) {
          selectedCategories.splice(i, 1);
          break;
        }
      }
    } else {
      selectedCategories.push(category);
    }
    setSelectedCategories([...selectedCategories]);
    setChangesMade(true);
  };
  const [subCategoriesList, setSubCategoriesList] = useState([]);
  useEffect(() => {
    const subCategoriesSet = new Set();
    for (const i in selectedCategories) {
      const eachSubCategoriesList =
        constants.SUB_CATEGORIES_DICT[selectedCategories[i]];
      for (const j in eachSubCategoriesList) {
        subCategoriesSet.add(eachSubCategoriesList[j]);
      }
    }

    setSubCategoriesList([...subCategoriesSet]);
  }, [selectedCategories]);
  const handleSetSubCategory = (subCategory) => {
    if (selectedSubCategories.includes(subCategory)) {
      for (var i = selectedSubCategories.length - 1; i >= 0; i--) {
        if (selectedSubCategories[i] === subCategory) {
          selectedSubCategories.splice(i, 1);
          break;
        }
      }
    } else {
      selectedSubCategories.push(subCategory);
    }
    setSelectedSubCategories([...selectedSubCategories]);
    setChangesMade(true);
  };

  // reducing
  const reduceCategory = () => {
    for (const [key, value] of Object.entries(categorySelection)) {
      if (value === true) {
        return true;
      }
    }
    return false;
  };

  // submit
  const handleSubmit = async () => {
    const proCategoriesUpdate = [];
    for (const [key, value] of Object.entries(categorySelection)) {
      if (value) {
        proCategoriesUpdate.push(key);
      }
    }

    try {
      const res = await axios.put("/v1/video/update/" + displayVideoId, {
        categories: selectedCategories,
        subCategories: selectedSubCategories,
        proCategories: proCategoriesUpdate,
        affiliateGroupName: "Links",
        affiliateProducts: itemLinks.items,
      });

      const res1 = await axios.put(
        "/v1/users/update/" + localStorage.getItem("USER_ID"),
        {
          previousMainHashtags: selectedCategories,
          previousSubHashtags: selectedSubCategories,
        }
      );

      const res2 = await axios.put(
        "/v1/users/pushPreviousProductLinks/" + localStorage.getItem("USER_ID"),
        {
          allProductLinks: itemLinks.items,
          proVideo: displayVideoId,
        }
      );

      if (res.status === 201 && res1.status === 201 && res2.status === 201) {
        setShowNotif("Saved");
        setTimeout(() => {
          setShowNotif("");
        }, 3000);
      } else {
        setShowNotif("Error");
      }

      setChangesMade(false);
      setPreviousCats(selectedCategories);
      setPreviousSubCats(selectedSubCategories);

      setProVideos([...proVideos, displayVideoId]);
      setIsPublish(true);

      videos[videoI].proCategories = proCategoriesUpdate;
      videos[videoI].categories = selectedCategories;
      videos[videoI].subCategories = selectedSubCategories;
      videos[videoI].affiliateProducts = itemLinks.items;
    } catch {
      alert("Try publishing again");
    }
  };

  const handleUnsubmit = async () => {
    try {
      const res = await axios.put("/v1/tiktok/unpublish", {
        userId: localStorage.getItem("USER_ID"),
        videoId: displayVideoId,
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
      setProVideos(proVideos.filter((e) => e !== displayVideoId));
      setIsPublish(false);
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
      await axios.put("/v1/tiktok/tiktokProOrAll/", {
        userId: localStorage.getItem("USER_ID"),
        tiktokProOrAll: !showPublishOnly,
      });
      setShowPublishOnly(!showPublishOnly);
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
          checked={showPublishOnly}
          onChange={handlePublishToggle}
          color="secondary"
        />
      </div>
      <Collapse in={checked}>
        <div className="Tagging_Top_Main">
          <div className="Tagging_Top_Main_Left">
            <div
              className="Tagging_Top_Main_Left_Image_Body"
              onClick={() => {
                setMuted(!muted);
              }}
            >
              {muted ? (
                <VolumeOffOutlinedIcon className="volumeIcon" />
              ) : (
                <VolumeUpOutlinedIcon className="volumeIcon" />
              )}
              <video
                autoPlay="autoplay"
                className="Tagging_Top_Main_Left_Image"
                playsInline
                muted={muted}
                loop
                poster={displayImage}
                src={displayVideo}
              ></video>
            </div>
          </div>
          <div className="Tagging_Top_Main_Right">
            <div className="Tagging_Top_Main_Right_Tag_Body">
              <div className="Tagging_Choices_2_Wrapper">
                <div
                  className="Tagging_Choices_Left"
                  onClick={() => {
                    setOpenContentCategory(true);
                  }}
                  style={
                    changesMade && reduceCategory()
                      ? { border: "1px solid orange" }
                      : { border: "1px solid lightgrey" }
                  }
                >
                  <p>Categories</p>
                </div>
                <div
                  className="Tagging_Choices_Right"
                  onClick={handleCategoriesOpen}
                >
                  <AddIcon style={{ fontSize: 18 }} />
                </div>
              </div>
              <div
                className="Tagging_Choices"
                onClick={handleItemLinksOpen}
                style={
                  changesMade && itemLinks.items.length > 0
                    ? { border: "1px solid orange" }
                    : { border: "1px solid lightgrey" }
                }
              >
                Add Links
              </div>
              <div
                className="Tagging_Choices"
                onClick={handleHashtagsOpen}
                style={
                  changesMade && selectedCategories.length > 0
                    ? { border: "1px solid orange" }
                    : { border: "1px solid lightgrey" }
                }
              >
                Hashtags
              </div>

              {isPublish ? (
                <Button
                  style={{ height: "2.7rem", width: "90%", marginTop: "2rem" }}
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
                  style={{ height: "2.7rem", width: "90%", marginTop: "2rem" }}
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
            {importing ? (
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
            {videos.length > 0 ? (
              <div
                ref={topRef}
                className="gallery_image_box"
                onClick={() => handleSelectVideoWithChanges(0)}
                style={0 === videoI ? { border: "3px solid #f5f5f5" } : null}
              >
                {displayPreviewFile(
                  0,
                  videos[0].mediaType,
                  videos[0].url,
                  videos[0].coverImageUrl,
                  videos[0].tiktokCoverImageUrl,
                  videos[0].proCategories,
                  proVideos,
                  videos[0]._id
                )}
              </div>
            ) : (
              <div ref={topRef} className="gallery_image_box"></div>
            )}

            {videos.slice(1).map((eachVideo, i) => (
              <div
                className="gallery_image_box"
                onClick={() => handleSelectVideoWithChanges(i + 1)}
                style={
                  i + 1 === videoI ? { border: "3px solid #f5f5f5" } : null
                }
              >
                {displayPreviewFile(
                  i + 1,
                  eachVideo.mediaType,
                  eachVideo.url,
                  eachVideo.coverImageUrl,
                  eachVideo.tiktokCoverImageUrl,
                  eachVideo.proCategories,
                  proVideos,
                  videos[i + 1]._id
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

      <SlidingCategories
        openCategories={openCategories}
        proCategories={proCategories}
        setProCategories={setProCategories}
      />

      <ContentCategory
        openContentCategory={openContentCategory}
        setOpenContentCategory={setOpenContentCategory}
        proCategories={proCategories}
        categorySelection={categorySelection}
        setCategorySelection={setCategorySelectionTrack}
        handleDoneCategories={handleDoneCategories}
      />

      <SlidingItemLinks
        openItemLinks={openItemLinks}
        itemLinks={itemLinks}
        setItemLinks={setItemLinks}
        previousLinks={previousLinks}
        setPreviousLinks={setPreviousLinks}
        setChangesMade={setChangesMade}
      />

      <SlidingHashtags
        openHashtags={openHashtags}
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
        handleSetCategory={handleSetCategory}
        subCategoriesList={subCategoriesList}
        selectedSubCategories={selectedSubCategories}
        handleSetSubCategory={handleSetSubCategory}
        handleLoadPreviousHashtags={handleLoadPreviousHashtags}
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
