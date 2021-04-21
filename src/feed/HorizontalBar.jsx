import React, { useState } from "react";
import ScrollMenu from "react-horizontal-scrolling-menu";
import "./HorizontalScrollBar.css";
import FavoriteIcon from "@material-ui/icons/Favorite";

import { MAIN_CATEGORIES_LIST_BAR } from "../helpers/CategoriesConstants";
import { each } from "lodash";

// list of items
const list = MAIN_CATEGORIES_LIST_BAR;

export const HorizontalBar = ({ selectCategory, setSelectedCategory }) => {
  return (
    <div className="Horizontal_Scroll_Body">
      <div className="Horizontal_Scroll_Bar">
        {list.map((eachCategory) => {
          return (
            <div
              className="Horizontal_Scroll_Tag"
              onClick={() => setSelectedCategory(eachCategory.name)}
              style={
                selectCategory == eachCategory.name
                  ? {
                      background: "white",
                    }
                  : null
              }
            >
              <p
                style={
                  selectCategory == eachCategory.name
                    ? {
                        color: "#222222",
                        fontSize: "17px",
                        fontWeight: "bold",
                        opacity: 1,
                      }
                    : {
                        color: "white",
                        fontSize: "17px",
                        fontWeight: "bold",
                        opacity: 0.5,
                      }
                }
              >
                {eachCategory.name}
               
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

{
  /* 
<ScrollMenu
          data={menu}
          selected={selectCategory}
          onSelect={(key) => setSelectedCategory(key)}
          innerWrapperClass="Horizontal_Scroll_Inner_Wrapper_Class"
        /> */
}
