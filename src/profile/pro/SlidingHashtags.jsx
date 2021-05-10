import React, { useState, useEffect } from "react";
import "./ProEdit.css";
import { useGlobalState } from "../../GlobalStates";
import * as constants from "../../helpers/CategoriesConstants";

import { useHistory } from "react-router";

import Dialog from "@material-ui/core/Dialog";
import Slide from "@material-ui/core/Slide";
import { Divider, makeStyles } from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import ArrowBackIosOutlinedIcon from "@material-ui/icons/ArrowBackIosOutlined";
import HistoryOutlinedIcon from "@material-ui/icons/HistoryOutlined";

const useStyles = makeStyles((theme) => ({
  dialog: {
    position: "absolute",
    margin: 0,
    width: "104vw",
    minHeight: "100vh",
    zIndex: 5000,
    backgroundColor: "white",
  },
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "40ch",
    },
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

export const SlidingHashtags = ({
  openHashtags,
  selectedCategories,
  setSelectedCategories,
  handleSetCategory,
  subCategoriesList,
  selectedSubCategories,
  handleSetSubCategory,
  handleLoadPreviousHashtags,
}) => {
  const history = useHistory();
  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Dialog
      open={openHashtags}
      TransitionComponent={Transition}
      keepMounted
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
      fullScreen={fullScreen}
    >
      <div className="SlidingEdit_Body">
        <div className="SlidingEdit_Header">
          <ArrowBackIosOutlinedIcon
            onClick={() => history.goBack()}
            style={{ paddingLeft: 14 }}
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
            Hashtags
          </span>

          <HistoryOutlinedIcon
            onClick={handleLoadPreviousHashtags}
            style={{ paddingRight: 14, position: "absolute", right: 0 }}
          />
        </div>
        <div className="SlidingEdit_HashTagBody">
          <div className="upload_mainCategoriesBox">
            {constants.MAIN_CATEGORIES_LIST.map((category) => (
              <div
                className="upload_mainCategoriesTag"
                style={
                  selectedCategories.includes(category)
                    ? { backgroundColor: "orange", color: "white" }
                    : null
                }
                onClick={() => handleSetCategory(category)}
              >
                <p>{category}</p>
              </div>
            ))}
            {subCategoriesList.map((subCategory) => (
              <div
                className="upload_mainCategoriesTag"
                style={
                  selectedSubCategories.includes(subCategory)
                    ? { backgroundColor: "orange", color: "white" }
                    : null
                }
                onClick={() => handleSetSubCategory(subCategory)}
              >
                <p>{subCategory}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Dialog>
  );
};
