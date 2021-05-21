import React from "react";

import { MAIN_CATEGORIES_LIST_BAR } from "../helpers/CategoriesConstants";
import "./Comments.css";

import Dialog from "@material-ui/core/Dialog";

import Slide from "@material-ui/core/Slide";
import { makeStyles } from "@material-ui/core";

const categoriesList = MAIN_CATEGORIES_LIST_BAR;

const useStyles = makeStyles({
  dialog: {
    position: "absolute",
    left: "50%",
    bottom: "-42%",
    margin: 0,
    transform: "translate(-50%, -50%)",
    width: "102vw",
    height: "47%",
    borderRadius: 10,
  },
});

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const CategoriesSelection = ({
  categoriesOpen,
  handleCategoriesClose,
  selectCategory,
  setSelectCategory,
}) => {
  const classes = useStyles();

  return (
    <div>
      <Dialog
        open={categoriesOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCategoriesClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
        classes={{
          paper: classes.dialog,
        }}
      >
        <div className="categoriesWrapper">
          <div className="categoriesGrayLineWrapper" style={{ height: 30 }}>
            <div
              className="categoriesGrayLine"
              style={{
                position: "absolute",
                left: "0",
                right: "0",
                marginLeft: "auto",
                marginRight: "auto",
                height: 3,
                width: 30,
                backgroundColor: "grey",
                borderRadius: 5,
                marginTop: 15,
              }}
            ></div>
          </div>
          <div
            className="categories_selection_wrapper"
            style={{
              height: 175,
              overflowY: "scroll",
            }}
          >
            {categoriesList.map((eachCategory) => {
              return (
                <div
                  className="categories_selection_rectangle"
                  style={{
                    height: 45,
                    display: "flex",
                    alignItems: "center",
                  }}
                  onClick={() => {
                    setSelectCategory(eachCategory.name);
                    handleCategoriesClose();
                  }}
                >
                  <p
                    style={{
                      fontSize: "17px",
                      fontWeight: "500",
                      marginLeft: 20,
                    }}
                  >
                    {eachCategory.name}
                  </p>
                </div>
              );
            })}
            <div
              className="categories_selection_rectangle"
              style={{
                height: 45,
                display: "flex",
                alignItems: "center",
              }}
            ></div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};
