import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import React, { useState, useEffect } from "react";
import "./ProEdit.css";
import { useGlobalState } from "../../GlobalStates";
import { useHistory } from "react-router";
import { useDidMountEffect } from "../../customHooks/useDidMountEffect";

import { SlidingSocials } from "./SlidingSocials";

import TextField from "@material-ui/core/TextField";
import ClearOutlinedIcon from "@material-ui/icons/ClearOutlined";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import ArrowBackIosOutlinedIcon from "@material-ui/icons/ArrowBackIosOutlined";
import ArrowForwardIosOutlinedIcon from "@material-ui/icons/ArrowForwardIosOutlined";
import LinkOutlinedIcon from "@material-ui/icons/LinkOutlined";

import axios from "../../axios";
import { Exception } from "../../components/tracking/Tracker";

export const ProEdit = () => {
  const history = useHistory();

  // edit pannel open
  const [openSocials, setOpenSocials] = useState(false);
  const handleSocialsOpen = () => {
    setOpenSocials(true);
    window.history.pushState(
      {
        socials: "socials",
      },
      "",
      ""
    );
  };
  const handleSocialsClose = () => {
    setOpenSocials(false);
    window.history.back();
  };
  useDidMountEffect(() => {
    const handleSocialsPop = () => {
      setOpenSocials(false);
    };

    if (openSocials) {
      window.addEventListener("popstate", handleSocialsPop);
    } else {
      window.removeEventListener("popstate", handleSocialsPop);
    }
  }, [openSocials]);

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
          Edit Profile
        </span>
      </div>

      <div className="SlidingEdit_Pannels_Wrapper">
        <div className="SlidingEdit_Pannel" onClick={handleSocialsOpen}>
          <div className="SlidingEdit_TypeLeft">
            <img
              src="https://media2locoloco-us.s3.amazonaws.com/tik-tok.png"
              style={{ height: 14, margin: 3 }}
            />
            <img
              src="https://media2locoloco-us.s3.amazonaws.com/youtube.png"
              style={{ height: 17, margin: 3 }}
            />
            <img
              src="https://media2locoloco-us.s3.amazonaws.com/instagram.png"
              style={{ height: 14, margin: 3 }}
            />
          </div>
          <div className="SlidingEdit_TypeAndIcon">
            <p>Social Accounts</p>
            <ArrowForwardIosOutlinedIcon
              style={{ fontSize: 12, marginLeft: "1rem" }}
            />
          </div>
        </div>
        <div className="SlidingEdit_Pannel">
          <div className="SlidingEdit_TypeLeft">
            <LinkOutlinedIcon style={{ fontSize: 20 }} />
          </div>
          <div className="SlidingEdit_TypeAndIcon">
            <p>Links</p>
            <ArrowForwardIosOutlinedIcon
              style={{ fontSize: 12, marginLeft: "1rem" }}
            />
          </div>
        </div>
      </div>

      <SlidingSocials
        openSocials={openSocials}
        handleSocialsClose={handleSocialsClose}
      />
    </div>
  );
};
