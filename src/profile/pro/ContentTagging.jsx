import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import React, { useState, useEffect } from "react";
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

import { SimpleMiddleNotification } from "../../components/SimpleMiddleNotification";
import { downloadAndSaveTikToksWithRetry } from "../../helpers/CommonFunctions";
import { ContentCategory } from "./ContentCategory";

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
import PhotoLibraryIcon from "@material-ui/icons/PhotoLibrary";
import VideoLibraryIcon from "@material-ui/icons/VideoLibrary";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import AddIcon from "@material-ui/icons/Add";
import VolumeOffOutlinedIcon from "@material-ui/icons/VolumeOffOutlined";
import VolumeUpOutlinedIcon from "@material-ui/icons/VolumeUpOutlined";
import LoyaltyIcon from "@material-ui/icons/Loyalty";

import axios from "../../axios";
import { Exception } from "../../components/tracking/Tracker";
import { set } from "react-ga";

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
  proCategories,
  heartSticker
) => {
  if (mediaType == "video") {
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
        <img className="content_tagging_video_box" src={coverImageUrl} />
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

  const [proCategories, setProCategories] = useGlobalState("proCategories");

  const classes = useStyles();
  const [checked, setChecked] = useState(true);

  const history = useHistory();

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

  const [heartSticker, setHeartSticker] = useState([]);

  const [categorySelection, setCategorySelection] = useState({});
  const setCategorySelectionTrack = (values) => {
    setChangesMade(true);
    setCategorySelection(values);
  };

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

  const handlersUp = useSwipeable({
    onSwiped: (event) => {
      if (event.dir == "Up") {
        setChecked(false);
      }
    },
    ...{ delta: 15, trackMouse: true, trackTouch: true },
  });

  const [previousLinks, setPreviousLinks] = useState([]);
  const [previousCats, setPreviousCats] = useState([]);
  const [previousSubCats, setPreviousSubCats] = useState([]);
  useEffect(() => {
    const userId = localStorage.getItem("USER_ID");
    if (userId) {
      axios.get("/v1/users/getPro/" + userId).then((response) => {
        let data = response.data[0];
        const sortedVideos = data.videos.sort((a, b) => {
          return b.tiktokCreatedAt - a.tiktokCreatedAt;
        });
        setProCategories({ items: data.proCategories });
        setVideos(sortedVideos);

        setPreviousLinks(data.previousProductLinks.reverse());
        setPreviousCats(data.previousMainHashtags);
        setPreviousSubCats(data.previousSubHashtags);

        if (sortedVideos.length > 0) {
          setDisplayImage(sortedVideos[0].coverImageUrl);
          setDisplayVideo(sortedVideos[0].url);
          setDisplayVideoId(sortedVideos[0]._id);
          setVideoI(0);

          if (sortedVideos[0].proCategories.length > 0) {
            const catSelection = {};
            for (const eachProCat of sortedVideos[0].proCategories) {
              catSelection[eachProCat] = true;
            }
            setCategorySelection(catSelection);
          }

          if (sortedVideos[0].categories.length > 0) {
            setSelectedCategories(sortedVideos[0].categories);
            setSelectedSubCategories(sortedVideos[0].subCategories);
          }

          if (sortedVideos[0].affiliateProducts.length > 0) {
            setItemLinks({ items: sortedVideos[0].affiliateProducts });
          }
        }

        if (response.status == 200) {
          setSafeToEdit(true);
        }
      });
    }
  }, []);

  const handleImportClicked = async () => {
    let isMounted = true; // note this flag denote mount status

    setImporting(true);
    await downloadAndSaveTikToksWithRetry(3);
    setImporting(false);

    const userId = localStorage.getItem("USER_ID");
    if (userId) {
      axios.get("/v1/users/getPro/" + userId).then((response) => {
        let data = response.data[0];

        if (isMounted) {
          setVideos(
            data.videos.sort((a, b) => {
              return b.tiktokCreatedAt - a.tiktokCreatedAt;
            })
          );
        }
      });
    }

    console.log("import done");
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

  const [videoI, setVideoI] = useState(-1);
  const handleSelectVideo = (i) => {
    setChecked(true);

    setVideoI(i);
    setCategorySelection({});
    setSelectedCategories([]);
    setSelectedSubCategories([]);
    setItemLinks({ items: [] });

    setDisplayImage(videos[i].coverImageUrl);
    setDisplayVideo(videos[i].url);
    setDisplayVideoId(videos[i]._id);

    if (videos[i].proCategories.length > 0) {
      const catSelection = {};
      for (const eachProCat of videos[i].proCategories) {
        catSelection[eachProCat] = true;
      }
      setCategorySelection(catSelection);
    }

    if (videos[i].categories.length > 0) {
      setSelectedCategories(videos[i].categories);
      setSelectedSubCategories(videos[i].subCategories);
    }

    if (videos[i].affiliateProducts.length > 0) {
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

      if (res.status == 201) {
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
  }, [openCategories]);

  // edit item links
  const [itemLinks, setItemLinks] = useState({ items: [] });
  const setItemLinksTrack = (values) => {
    setChangesMade(true);
    setItemLinks(values);
  };

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
  const handleItemLinksClose = async () => {
    // const res = await axios.put(
    //   "/v1/users/update/" + localStorage.getItem("USER_ID"),
    //   {
    //     proCategories: proCategories.items,
    //   }
    // );
    // if (res.status == 201) {
    //   setShowNotif("Saved");
    //   setTimeout(() => {
    //     setShowNotif("");
    //   }, 3000);
    // } else {
    //   setShowNotif("Error");
    // }
    // setOpenItemLinks(false);
  };
  useDidMountEffect(() => {
    const handleItemLinksPop = () => {
      setOpenItemLinks(false);
    };

    if (openItemLinks) {
      window.addEventListener("popstate", handleItemLinksPop);
    } else {
      handleItemLinksClose();
      window.removeEventListener("popstate", handleItemLinksPop);
    }
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
  const handleHashtagsClose = async () => {
    // const res = await axios.put(
    //   "/v1/users/update/" + localStorage.getItem("USER_ID"),
    //   {
    //     proCategories: proCategories.items,
    //   }
    // );
    // if (res.status == 201) {
    //   setShowNotif("Saved");
    //   setTimeout(() => {
    //     setShowNotif("");
    //   }, 3000);
    // } else {
    //   setShowNotif("Error");
    // }
    // setOpenItemLinks(false);
  };
  useDidMountEffect(() => {
    const handleHashtagsPop = () => {
      setOpenHashtags(false);
    };

    if (openHashtags) {
      window.addEventListener("popstate", handleHashtagsPop);
    } else {
      handleHashtagsClose();
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
  const [selectedCategories, setSelectedCategories] = useState([]);
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
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);
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
      if (value == true) {
        return true;
      }
    }
    return false;
  };

  // submit
  const handleSubmit = async () => {
    if (
      Object.keys(categorySelection).length == 0 ||
      selectedCategories.length == 0 ||
      itemLinks.items.length == 0
    ) {
      alert("Please complete tagging before publishing");
    } else {
      const proCategories = [];
      for (const [key, value] of Object.entries(categorySelection)) {
        proCategories.push(key);
      }

      try {
        const res = await axios.put("/v1/video/update/" + displayVideoId, {
          categories: selectedCategories,
          subCategories: selectedSubCategories,
          proCategories: proCategories,
          affiliateGroupName: "Item Links",
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
          "/v1/users/pushPreviousProductLinks/" +
            localStorage.getItem("USER_ID"),
          {
            previousProductLinks: itemLinks.items,
            proVideo: displayVideoId,
          }
        );

        if (res.status == 201 && res1.status == 201 && res2.status == 201) {
          setShowNotif("Saved");
          setTimeout(() => {
            setShowNotif("");
          }, 3000);
        } else {
          setShowNotif("Error");
        }

        setHeartSticker([...heartSticker, videoI]);

        setChangesMade(false);
        setPreviousCats(selectedCategories);
        setPreviousSubCats(selectedSubCategories);
      } catch {
        alert("Try publishing again");
      }
    }
  };

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
                  Product Links
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

                <Button
                  style={{ height: "2.7rem", width: "90%", marginTop: "2rem" }}
                  variant="contained"
                  size="small"
                  className={classes.button}
                  color="primary"
                  onClick={handleSubmit}
                >
                  Publish
                </Button>
              </div>
            </div>
          </div>
        </Collapse>
        <Collapse in={checked} collapsedHeight={"95vh"}>
          <div {...handlers} className="gallery_slider_header">
            <div className="SlidingEdit_TypeLeft">
              <p style={{ fontSize: 15, fontWeight: "bold" }}>Gallery</p>
            </div>
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
                  classes={{
                    root: classes.buttonRoot,
                  }}
                  onClick={() => {
                    setOpenImport(true);
                  }}
                >
                  Import
                </Button>
              )}
            </div>
          </div>
          <div {...handlersUp} className="gallery_slider_body_wrapper">
            <div className="gallery_slider_body">
              {videos.map((eachVideo, i) => (
                <div
                  className="gallery_image_box"
                  onClick={() => handleSelectVideoWithChanges(i)}
                  style={i == videoI ? { border: "3px solid #f5f5f5" } : null}
                >
                  {displayPreviewFile(
                    i,
                    eachVideo.mediaType,
                    eachVideo.url,
                    eachVideo.coverImageUrl,
                    eachVideo.proCategories,
                    heartSticker
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
      </div>

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
        setItemLinks={setItemLinksTrack}
        previousLinks={previousLinks}
        setPreviousLinks={setPreviousLinks}
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

      {showNotif && <SimpleMiddleNotification message={showNotif} />}
    </div>
  );
};
