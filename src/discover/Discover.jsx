import React, { useState, useEffect } from "react";
import "./Discover.css";
import { Link } from "react-router-dom";

import SearchOutlinedIcon from "@material-ui/icons/SearchOutlined";

export const Discover = () => {
  const [input, setInput] = useState("");
  const [categories, setCategories] = useState([
    {
      category: "food & beverages",
      image1: "/food1.jpg",
      image2: "/food2.png",
      image3: "/food3.jpg",
    },
    {
      category: "fashion",
      image1: "/fashion1.jpg",
      image2: "/fashion3.jpg",
      image3: "/fashion2.jpg",
    },
    {
      category: "home",
      image1: "/home1.jpg",
      image2: "/home2.jpg",
      image3: "/home3.jpg",
    },
    {
      category: "home",
      image1: "/home1.jpg",
      image2: "/home2.jpg",
      image3: "/home3.jpg",
    },
    {
      category: "home",
      image1: "/home1.jpg",
      image2: "/home2.jpg",
      image3: "/home3.jpg",
    },
  ]);

  return (
    <div className="discover">
      coming soon
      {/* <div className="discover_search">
        <div className="discover_searchContainer">
          <SearchOutlinedIcon />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Discover"
            type="text"
          />
        </div>
      </div>

      <div className="discover_categories">
        {categories.map(({ category, image1, image2, image3 }) =>
          category.includes(input.toLowerCase()) ? (
            <Link to={`/discover/${category}`} className="discover_link">
              <div className="discover_category_container">
                <div className="discover_word_left">
                  <p>{category.toUpperCase()}</p>
                </div>
                <div className="discover_category_row">
                  <img
                    className="discover_category"
                    src={image1}
                    alt="discover_category_image"
                  />
                  <img
                    className="discover_category"
                    src={image2}
                    alt="discover_category_image"
                  />
                  <img
                    className="discover_category"
                    src={image3}
                    alt="discover_category_image"
                  />
                </div>
              </div>
            </Link>
          ) : null
        )}
      </div> */}
    </div>
  );
};
