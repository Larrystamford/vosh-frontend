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

export const ContentTagging = () => {
  const classes = useStyles();
  const [checked, setChecked] = React.useState(true);

  const history = useHistory();
  const [safeToEdit, setSafeToEdit] = useState(false);
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

        if (response.status == 200) {
          setSafeToEdit(true);
        }
      });
    }
  }, []);

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
          <div className="gallery_slider_header">Gallery</div>
          <div className="gallery_slider_body">
            <div className="if not videos show import + sign"></div>
            <div className="gallery_image_box"></div>
            <div className="gallery_image_box">Tagged</div>
            <div className="gallery_image_box"></div>
            <div className="gallery_image_box"></div>
            <div className="gallery_image_box"></div>
            <div className="gallery_image_box"></div>
            <div className="gallery_image_box"></div>
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
