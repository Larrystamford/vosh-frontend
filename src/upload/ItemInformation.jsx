import React, { useState, useEffect, useRef } from "react";
import "./Upload.css";
import { getCombinedName } from "../helpers/CommonFunctions";

import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";
import ClearOutlinedIcon from "@material-ui/icons/ClearOutlined";

import axios from "../axios";

export const ItemInformation = ({
  index,
  name,
  size,
  color,
  price,
  stocks,
  image,
  handleItemsChange,
  handleDeleteItem,
}) => {
  const hiddenFileInput = useRef(null);
  const handleUploadClick = (event) => {
    hiddenFileInput.current.click();
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

  const handleFileUpload = async (file, index) => {
    const mediaType = file.type.split("/")[0];
    if (mediaType != "image") {
      alert("Please upload images only");
    } else {
      setItemImage(file.name);
      const imageUrl = await getFileUrl(file);
      handleItemsChange(imageUrl, index, "image");
    }
  };

  const [itemImage, setItemImage] = useState("");

  return (
    <>
      {/* Item Information */}
      <div className="upload_CategoriesFormBody">
        <div
          className="upload_CategoriesFormBodyWrapper"
          style={{ width: "98%" }}
        >
          <div className="upload_item_header">
            <p style={{ fontWeight: "bold" }}>
              Item: {getCombinedName(color, name, size)}
            </p>
            <ClearOutlinedIcon
              className="upload_cancelIcon"
              onClick={(e) => handleDeleteItem(index)}
            />
          </div>

          <div className="upload_input_container">
            <p>Name: </p>

            <input
              value={name}
              onChange={(e) => handleItemsChange(e.target.value, index, "name")}
              placeholder="Offwhite Shorts ..."
              type="text"
            />
          </div>
          <div className="upload_input_container">
            <p>Size: </p>
            <input
              value={size}
              onChange={(e) => handleItemsChange(e.target.value, index, "size")}
              placeholder="Optional ..."
              type="text"
            />
          </div>
          <div className="upload_input_container">
            <p>Color: </p>
            <input
              value={color}
              onChange={(e) =>
                handleItemsChange(e.target.value, index, "color")
              }
              placeholder="Optional ..."
              type="text"
            />
          </div>
          <div className="upload_input_container">
            <p>Price (usd): </p>
            <input
              value={price}
              onChange={(e) =>
                handleItemsChange(e.target.value, index, "price")
              }
              placeholder="16.99 ..."
              type="number"
            />
          </div>

          <div className="upload_input_container">
            <p>Stock available: </p>

            <input
              value={stocks}
              onChange={(e) =>
                handleItemsChange(e.target.value, index, "stocks")
              }
              placeholder="50 ..."
              type="number"
            />
          </div>

          <div className="upload_input_container">
            <p>Image: </p>
            {itemImage ? (
              <div
                className="upload_addImageButton"
                onClick={handleUploadClick}
              >
                <AddCircleOutlineOutlinedIcon fontSize="small" />
                <p>{itemImage}</p>
              </div>
            ) : (
              <div
                className="upload_addImageButton"
                onClick={handleUploadClick}
              >
                <AddCircleOutlineOutlinedIcon fontSize="small" />
                <p>Add Picture</p>
              </div>
            )}
            <input
            ref={hiddenFileInput}
            type="file"
            name="file"
            onChange={(e) => {
              handleFileUpload(e.target.files[0], index);
            }}
          />
          </div>
        </div>
      </div>
    </>
  );
};
