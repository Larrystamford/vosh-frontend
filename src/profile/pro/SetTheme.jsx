import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import React, { useState, useEffect, useRef } from "react";
import "./ProEdit.css";
import { useGlobalState } from "../../GlobalStates";
import { useHistory } from "react-router";
import { useDidMountEffect } from "../../customHooks/useDidMountEffect";

import { ImageLoad } from "../../components/ImageLoad";

import { ColorSelection } from "./ColorSelection";

import { SimpleBottomNotification } from "../../components/SimpleBottomNotification";

import ArrowBackIosOutlinedIcon from "@material-ui/icons/ArrowBackIosOutlined";
import PhotoCameraOutlinedIcon from "@material-ui/icons/PhotoCameraOutlined";

import ArrowForwardIosOutlinedIcon from "@material-ui/icons/ArrowForwardIosOutlined";
import CategoryOutlinedIcon from "@material-ui/icons/CategoryOutlined";

import CreateIcon from "@material-ui/icons/Create";

import axios from "../../axios";
import { Exception } from "../../components/tracking/Tracker";

export const SetTheme = () => {
  const history = useHistory();

  const [proTheme, setProTheme] = useState({
    arrangement: "",
    background1: "",
    background2: "",
    linkBoxColor: "",
    fontType: "",
    color1: "",
    color2: "",
    color3: "",
  });
  const [showNotif, setShowNotif] = useState("");

  const [openColorSelection, setOpenColorSelection] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("USER_ID");
    if (userId) {
      axios.get("/v1/users/getPro/" + userId).then((response) => {
        let data = response.data[0];
        setProTheme(data.proTheme);
      });
    }
  }, []);

  // change background
  const hiddenBackground1Input = useRef(null);
  const handleUploadClick1 = (event) => {
    hiddenBackground1Input.current.click();
  };
  const hiddenBackground2Input = useRef(null);
  const handleUploadClick2 = (event) => {
    hiddenBackground2Input.current.click();
  };
  const handleFileUpload = async (file, background) => {
    let mediaType = file.type.split("/")[0];
    if (mediaType != "image") {
      alert("Please upload images only");
    } else {
      let imageUrl = await getFileUrl(file);

      if (background == "background1") {
        setProTheme((prevState) => ({ ...prevState, background1: imageUrl }));

        await axios.put("/v1/users/update/" + localStorage.getItem("USER_ID"), {
          proTheme: { ...proTheme, background1: imageUrl },
        });
      } else if (background == "background2") {
        setProTheme((prevState) => ({ ...prevState, background2: imageUrl }));

        await axios.put("/v1/users/update/" + localStorage.getItem("USER_ID"), {
          proTheme: { ...proTheme, background2: imageUrl },
        });
      }
    }
  };

  const handleSetLinkBoxColor = (event) => {
    setProTheme((prevState) => ({
      ...prevState,
      linkBoxColor: event.target.value,
    }));
  };

  const handleSaveLinkBoxColor = async () => {
    await axios.put("/v1/users/update/" + localStorage.getItem("USER_ID"), {
      proTheme: proTheme,
    });
    setOpenColorSelection(false);
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
              <ImageLoad
                src={proTheme.background1}
                className="SlidingEdit_Pannels_Image_Circle"
              />
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

            <p>Background</p>
          </div>

          <div className="SlidingEdit_Pannels_BackgroundImageCircleAndWords">
            <div
              className="SlidingEdit_Pannels_Image_Circle_Wrapper"
              onClick={handleUploadClick2}
            >
              <ImageLoad
                src={proTheme.background2}
                className="SlidingEdit_Pannels_Image_Circle"
              />
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
                ref={hiddenBackground2Input}
                type="file"
                name="file"
                onChange={(e) => {
                  handleFileUpload(e.target.files[0], "background2");
                }}
              />
            </div>

            <p>Box Background</p>
          </div>
        </div>

        <div
          className="SlidingEdit_Pannel"
          onClick={() => {
            setOpenColorSelection(true);
          }}
        >
          <div className="SlidingEdit_TypeLeft">
            <div
              style={{
                height: 20,
                width: 20,
                backgroundColor: proTheme.linkBoxColor,
                borderRadius: 5,
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
      </div>

      <ColorSelection
        openColorSelection={openColorSelection}
        setOpenColorSelection={setOpenColorSelection}
        linkBoxColor={proTheme.linkBoxColor}
        handleSetLinkBoxColor={handleSetLinkBoxColor}
        handleSaveLinkBoxColor={handleSaveLinkBoxColor}
      />
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
