import React from "react";
import "./HorizontalScrollBar.css";

import { MAIN_CATEGORIES_LIST_BAR } from "../helpers/CategoriesConstants";

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
                selectCategory === eachCategory.name
                  ? {
                      background: "white",
                    }
                  : null
              }
            >
              <p
                style={
                  selectCategory === eachCategory.name
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