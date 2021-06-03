import React, { useState, useEffect, useRef } from "react";
import "./ProEdit.css";
import { useHistory } from "react-router";

import { ImageLoad } from "../../components/ImageLoad";

import { ColorSelection } from "./ColorSelection";

import { SimpleBottomNotification } from "../../components/SimpleBottomNotification";

import ArrowBackIosOutlinedIcon from "@material-ui/icons/ArrowBackIosOutlined";
import PhotoCameraOutlinedIcon from "@material-ui/icons/PhotoCameraOutlined";
import ArrowForwardIosOutlinedIcon from "@material-ui/icons/ArrowForwardIosOutlined";

import Dialog from "@material-ui/core/Dialog";

import axios from "../../axios";
import { prototype } from "react-copy-to-clipboard";

export const SetTheme = () => {
  const history = useHistory();

  const [proTheme, setProTheme] = useState({
    background1: "",
    background2: "",
    background3: { imageUrl: "", videoUrl: "" },
    primaryFontColor: "",
    socialIconsColor: "",
    linkBoxColor: "",
    linkWordsColor: "",
    categoryWordsColor: "",
  });

  const [safeToEdit, setSafeToEdit] = useState(false);
  const [showNotif, setShowNotif] = useState("");
  useEffect(() => {
    const userId = localStorage.getItem("USER_ID");
    if (userId) {
      axios.get("/v1/users/getPro/" + userId).then((response) => {
        let data = response.data[0];
        setProTheme(data.proTheme);

        setSafeToEdit(true);
      });
    }
  }, []);

  const [openBackground3, setOpenBackground3] = useState(false);

  // change background
  const hiddenBackground1Input = useRef(null);
  const handleUploadClick1 = (event) => {
    hiddenBackground1Input.current.click();
  };
  const hiddenBackground3Input = useRef(null);
  const handleUploadClick2 = (event) => {
    if (proTheme.background3) {
      setOpenBackground3(true);
    } else {
      hiddenBackground3Input.current.click();
    }
  };
  const handleFileUpload = async (file, background) => {
    let mediaType = file.type.split("/")[0];
    if (background === "background1" && mediaType != "image") {
      alert("Please upload images only");
    } else if (background === "background3" && mediaType != "video") {
      alert("Please upload videos only");
    } else {
      if (background === "background1") {
        const imageUrl = await getFileUrl(file);

        setProTheme((prevState) => ({ ...prevState, background1: imageUrl }));
        if (safeToEdit) {
          await axios.put(
            "/v1/users/update/" + localStorage.getItem("USER_ID"),
            {
              proTheme: { ...proTheme, background1: imageUrl },
            }
          );
        }
      } else if (background === "background3") {
        const [imageLink, videoLink] = await getVideoUrls(file);

        setProTheme((prevState) => ({
          ...prevState,
          background3: { imageUrl: imageLink, videoUrl: videoLink },
        }));

        if (safeToEdit) {
          await axios.put(
            "/v1/users/update/" + localStorage.getItem("USER_ID"),
            {
              proTheme: {
                ...proTheme,
                background3: { imageUrl: imageLink, videoUrl: videoLink },
              },
            }
          );
        }
      }
    }
  };

  const [openPrimaryColorSelect, setOpenPrimaryColorSelect] = useState(false);
  const handleSetPrimaryColor = (event) => {
    setProTheme((prevState) => ({
      ...prevState,
      primaryFontColor: event.target.value,
    }));
  };
  const handleSavePrimaryColor = async () => {
    if (safeToEdit) {
      await axios.put("/v1/users/update/" + localStorage.getItem("USER_ID"), {
        proTheme: proTheme,
      });
    }

    setOpenPrimaryColorSelect(false);
  };

  const [openSocialColorSelect, setOpenSocialColorSelect] = useState(false);
  const handleSetSocialColor = (event) => {
    setProTheme((prevState) => ({
      ...prevState,
      socialIconsColor: event.target.value,
    }));
  };
  const handleSaveSocialColor = async () => {
    if (safeToEdit) {
      await axios.put("/v1/users/update/" + localStorage.getItem("USER_ID"), {
        proTheme: proTheme,
      });
    }

    setOpenSocialColorSelect(false);
  };

  const [openLinkBoxColorSelection, setLinkBoxOpenColorSelection] =
    useState(false);
  const handleSetLinkBoxColor = (event) => {
    setProTheme((prevState) => ({
      ...prevState,
      linkBoxColor: event.target.value,
    }));
  };
  const handleSaveLinkBoxColor = async () => {
    if (safeToEdit) {
      await axios.put("/v1/users/update/" + localStorage.getItem("USER_ID"), {
        proTheme: proTheme,
      });
    }

    setLinkBoxOpenColorSelection(false);
  };

  const [openLinkWordsColorSelect, setOpenLinkWordsColorSelect] =
    useState(false);
  const handleSetLinkWordsColor = (event) => {
    setProTheme((prevState) => ({
      ...prevState,
      linkWordsColor: event.target.value,
    }));
  };
  const handleSaveLinkWordsColor = async () => {
    if (safeToEdit) {
      await axios.put("/v1/users/update/" + localStorage.getItem("USER_ID"), {
        proTheme: proTheme,
      });
    }

    setOpenLinkWordsColorSelect(false);
  };

  const [openCatColorSelect, setOpenCatColorSelect] = useState(false);
  const handleSetCatColor = (event) => {
    setProTheme((prevState) => ({
      ...prevState,
      categoryWordsColor: event.target.value,
    }));
  };
  const handleSaveCatColor = async () => {
    if (safeToEdit) {
      await axios.put("/v1/users/update/" + localStorage.getItem("USER_ID"), {
        proTheme: proTheme,
      });
    }

    setOpenCatColorSelect(false);
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

  const getVideoUrls = async (file) => {
    let formData = new FormData();
    formData.append("media", file);

    const result = await axios.post("/v1/upload/awsWithFirstFrame", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return [result.data.imageUrl, result.data.videoUrl];
  };

  const removeVideo = async () => {
    if (safeToEdit) {
      await axios.put("/v1/users/update/" + localStorage.getItem("USER_ID"), {
        proTheme: { ...proTheme, background3: { imageUrl: "", videoUrl: "" } },
      });
      setProTheme({ ...proTheme, background3: { imageUrl: "", videoUrl: "" } });
    }

    setOpenCatColorSelect(false);
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
          Edit Theme
        </span>
      </div>

      <div className="SlidingEdit_Pannels_Wrapper">
        <div className="SlidingEdit_Pannels_BackgroundImageWrapper">
          <div className="SlidingEdit_Pannels_BackgroundImageCircleAndWords">
            <div
              className="SlidingEdit_Pannels_Image_Circle_Wrapper"
              onClick={handleUploadClick1}
            >
              {proTheme.background1 ? (
                <ImageLoad
                  src={proTheme.background1}
                  className="SlidingEdit_Pannels_Image_Circle"
                />
              ) : (
                <div
                  className="SlidingEdit_Pannels_Image_Circle"
                  style={{ background: "grey" }}
                ></div>
              )}

              <PhotoCameraOutlinedIcon
                style={{
                  color: "white",
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              />
              <input
                ref={hiddenBackground1Input}
                type="file"
                name="file"
                onChange={(e) => {
                  handleFileUpload(e.target.files[0], "background1");
                }}
              />
            </div>

            <p>Image Background</p>
          </div>

          <div className="SlidingEdit_Pannels_BackgroundImageCircleAndWords">
            <div
              className="SlidingEdit_Pannels_Image_Circle_Wrapper"
              onClick={handleUploadClick2}
            >
              {proTheme.background3 && proTheme.background3.imageUrl ? (
                <ImageLoad
                  src={proTheme.background3.imageUrl}
                  className="SlidingEdit_Pannels_Image_Circle"
                />
              ) : (
                <div
                  className="SlidingEdit_Pannels_Image_Circle"
                  style={{ background: "grey" }}
                ></div>
              )}

              <PhotoCameraOutlinedIcon
                style={{
                  color: "white",
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              />
              <input
                ref={hiddenBackground3Input}
                type="file"
                name="file"
                onChange={(e) => {
                  handleFileUpload(e.target.files[0], "background3");
                }}
              />
            </div>

            <p>Video Background</p>
          </div>
        </div>

        <div
          className="SlidingEdit_Pannel"
          onClick={() => {
            setOpenPrimaryColorSelect(true);
          }}
        >
          <div className="SlidingEdit_TypeLeft">
            <div
              style={{
                height: 20,
                width: 20,
                backgroundColor: proTheme.primaryFontColor,
                borderRadius: 5,
                border: "1px solid grey",
              }}
            ></div>
          </div>
          <div className="SlidingEdit_TypeAndIcon">
            <p>Primary Font Color</p>
            <ArrowForwardIosOutlinedIcon
              style={{ fontSize: 12, marginLeft: "1rem" }}
            />
          </div>
        </div>

        <div
          className="SlidingEdit_Pannel"
          onClick={() => {
            setOpenSocialColorSelect(true);
          }}
        >
          <div className="SlidingEdit_TypeLeft">
            <div
              style={{
                height: 20,
                width: 20,
                backgroundColor: proTheme.socialIconsColor,
                borderRadius: 5,
                border: "1px solid grey",
              }}
            ></div>
          </div>
          <div className="SlidingEdit_TypeAndIcon">
            <p>Social Icons Color</p>
            <ArrowForwardIosOutlinedIcon
              style={{ fontSize: 12, marginLeft: "1rem" }}
            />
          </div>
        </div>

        <div
          className="SlidingEdit_Pannel"
          onClick={() => {
            setLinkBoxOpenColorSelection(true);
          }}
        >
          <div className="SlidingEdit_TypeLeft">
            <div
              style={{
                height: 20,
                width: 20,
                backgroundColor: proTheme.linkBoxColor,
                borderRadius: 5,
                border: "1px solid grey",
              }}
            ></div>
          </div>
          <div className="SlidingEdit_TypeAndIcon">
            <p>Link Box Color</p>
            <ArrowForwardIosOutlinedIcon
              style={{ fontSize: 12, marginLeft: "1rem" }}
            />
          </div>
        </div>

        <div
          className="SlidingEdit_Pannel"
          onClick={() => {
            setOpenLinkWordsColorSelect(true);
          }}
        >
          <div className="SlidingEdit_TypeLeft">
            <div
              style={{
                height: 20,
                width: 20,
                backgroundColor: proTheme.linkWordsColor,
                borderRadius: 5,
                border: "1px solid grey",
              }}
            ></div>
          </div>
          <div className="SlidingEdit_TypeAndIcon">
            <p>Link Words Color</p>
            <ArrowForwardIosOutlinedIcon
              style={{ fontSize: 12, marginLeft: "1rem" }}
            />
          </div>
        </div>

        <div
          className="SlidingEdit_Pannel"
          onClick={() => {
            setOpenCatColorSelect(true);
          }}
        >
          <div className="SlidingEdit_TypeLeft">
            <div
              style={{
                height: 20,
                width: 20,
                backgroundColor: proTheme.categoryWordsColor,
                borderRadius: 5,
                border: "1px solid grey",
              }}
            ></div>
          </div>
          <div className="SlidingEdit_TypeAndIcon">
            <p>Category Words Color</p>
            <ArrowForwardIosOutlinedIcon
              style={{ fontSize: 12, marginLeft: "1rem" }}
            />
          </div>
        </div>
      </div>

      <ColorSelection
        openColorSelection={openPrimaryColorSelect}
        setOpenColorSelection={setOpenPrimaryColorSelect}
        linkBoxColor={proTheme.primaryFontColor}
        handleSetLinkBoxColor={handleSetPrimaryColor}
        handleSaveLinkBoxColor={handleSavePrimaryColor}
      />

      <ColorSelection
        openColorSelection={openSocialColorSelect}
        setOpenColorSelection={setOpenSocialColorSelect}
        linkBoxColor={proTheme.socialIconsColor}
        handleSetLinkBoxColor={handleSetSocialColor}
        handleSaveLinkBoxColor={handleSaveSocialColor}
        limitedColors={["black", "white"]}
      />

      <ColorSelection
        openColorSelection={openLinkBoxColorSelection}
        setOpenColorSelection={setLinkBoxOpenColorSelection}
        linkBoxColor={proTheme.linkBoxColor}
        handleSetLinkBoxColor={handleSetLinkBoxColor}
        handleSaveLinkBoxColor={handleSaveLinkBoxColor}
      />

      <ColorSelection
        openColorSelection={openLinkWordsColorSelect}
        setOpenColorSelection={setOpenLinkWordsColorSelect}
        linkBoxColor={proTheme.linkWordsColor}
        handleSetLinkBoxColor={handleSetLinkWordsColor}
        handleSaveLinkBoxColor={handleSaveLinkWordsColor}
      />

      <ColorSelection
        openColorSelection={openCatColorSelect}
        setOpenColorSelection={setOpenCatColorSelect}
        linkBoxColor={proTheme.categoryWordsColor}
        handleSetLinkBoxColor={handleSetCatColor}
        handleSaveLinkBoxColor={handleSaveCatColor}
      />

      <Dialog
        onClose={() => {
          setOpenBackground3(false);
        }}
        aria-labelledby="simple-dialog-title"
        open={openBackground3}
      >
        <div
          style={{
            minWidth: "80vw",
            height: "8rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: "90%",
              height: "3rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={() => {
              hiddenBackground3Input.current.click();
              setOpenBackground3(false);
            }}
          >
            <p>Change Video</p>
          </div>
          <div
            style={{
              width: "90%",
              height: "3rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "maroon",
            }}
          >
            <p
              onClick={async () => {
                if (safeToEdit) {
                  await removeVideo();
                  setOpenBackground3(false);
                }
              }}
            >
              Remove Video
            </p>
          </div>
        </div>
      </Dialog>

      {showNotif && <SimpleBottomNotification message={showNotif} />}
    </div>
  );
};

// <div
// className="SlidingEdit_Pannel"
// onClick={() => {
//   history.push("/changeUsername");
// }}
// >
// <div className="SlidingEdit_TypeLeft">
//   <AccountCircleIcon style={{ fontSize: 20 }} />
// </div>
// <div className="SlidingEdit_TypeAndIcon">
//   <p>Customize</p>
//   <ArrowForwardIosOutlinedIcon
//     style={{ fontSize: 12, marginLeft: "1rem" }}
//   />
// </div>
// </div>
