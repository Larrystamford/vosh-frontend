import React, { useState, useEffect, useRef } from "react";
import "./Upload.css";
import { ItemInformation } from "./ItemInformation";
import * as constants from "../helpers/CategoriesConstants";
import { useDidMountEffect } from "../customHooks/useDidMountEffect";
import axios from "../axios";
import AddIcon from "@material-ui/icons/Add";
import ClearOutlinedIcon from "@material-ui/icons/ClearOutlined";

import { useHistory } from "react-router";

import ArrowBackOutlinedIcon from "@material-ui/icons/ArrowBackOutlined";
import Button from "@material-ui/core/Button";

import { StaySlidingSetUp } from "../login/StaySlidingSetUp";
// import captureVideoFrame from "capture-video-frame";

export const Upload = (props) => {
  const history = useHistory();

  const [file, setFile] = useState(null);

  // const file = props.location.state.file;
  const [mainUrl, setMainUrl] = useState("");
  const [coverUrl, setCoverUrl] = useState("");

  const [originalCreator, setOriginalCreator] = useState("");

  const [likesCount, setLikesCount] = useState(
    Math.floor(Math.random() * 199) + 101
  );

  const amazonTemplate = {
    amazon_name: "",
    amazon_link: "",
  };
  const [smallShopLink, setSmallShopLink] = useState("");
  const [amazons, setAmazons] = useState([amazonTemplate]);
  const addNewAmazon = () => {
    let newAmazons = [...amazons, amazonTemplate];
    setAmazons(newAmazons);
  };
  const handleAmazonsChange = (value, index, field) => {
    let newAmazons = [...amazons];
    newAmazons[index][field] = value;
    setAmazons(newAmazons);
  };
  const handleDeleteAmazon = (index) => {
    if (amazons.length > 1) {
      let newAmazons = [...amazons];
      newAmazons.splice(index, 1);
      setAmazons(newAmazons);
    }
  };

  const aliexpressTemplate = {
    aliexpress_link: "",
  };
  const [aliexpress, setAliexpress] = useState([aliexpressTemplate]);
  const addNewAliexpress = () => {
    let newAliexpress = [...aliexpress, aliexpressTemplate];
    setAliexpress(newAliexpress);
  };
  const handleAliexpressChange = (value, index, field) => {
    let newAliexpress = [...aliexpress];
    newAliexpress[index][field] = value;
    setAliexpress(newAliexpress);
  };
  const handleDeleteAliexpress = (index) => {
    if (aliexpress.length > 1) {
      let newAliexpress = [...aliexpress];
      newAliexpress.splice(index, 1);
      setAliexpress(newAliexpress);
    }
  };

  const [amazonOrInternal, setAmazonOrInternal] = useState("amazon");
  const [anchorEl, setAnchorEl] = useState(null);
  const closeDropDown = () => {
    setAnchorEl(null);
  };

  const [captionInput, setCaptionInput] = useState("");

  const [checked, setChecked] = useState(false);
  const handleSetUpOpen = () => {
    setChecked(true);
  };
  const handleSetUpClose = () => {
    setChecked(false);
  };

  const getImageUrl = async (file) => {
    let formData = new FormData();
    formData.append("media", file);

    const result = await axios.post("/v1/upload/aws", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return result.data.url;
  };

  const getFileUrl = async (file) => {
    let formData = new FormData();
    formData.append("media", file);

    console.log("aws first frame");
    const result = await axios.post("/v1/upload/awsWithFirstFrame", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return [result.data.videoUrl, result.data.imageUrl];
  };

  // upload the file and get the url
  useDidMountEffect(() => {
    if (file && file.type.split("/")[0] === "video") {
      (async () => {
        validateFile(file);
        const [videoUrl, imageUrl] = await getFileUrl(file);

        setMainUrl(videoUrl);
        setCoverUrl(imageUrl);
      })();

      if (!localStorage.getItem("USER_ID")) {
        setTimeout(() => handleSetUpOpen(), 800);
      } else {
        axios
          .get("/v1/users/getUserInfo/" + localStorage.getItem("USER_ID"))
          .then((res) => {
            // if undefined, go and set up else save & done
            if (res.data[0].address) {
              console.log("ok");
            } else {
              setTimeout(() => handleSetUpOpen(), 800);
            }
          });
      }
    } else {
      alert("You are only allowed to upload videos. Please refresh.");
    }
  }, [file]);

  const validateFile = (file) => {
    var video = document.createElement("video");
    video.preload = "metadata";

    video.onloadedmetadata = function () {
      window.URL.revokeObjectURL(video.src);
      console.log(video.duration);
      if (video.duration < 1) {
        alert("Video cannot be less than 1 second");
        history.push("/profile");
      }
      if (video.duration > 80) {
        alert("Video cannot be more than 60 seconds");
        history.push("/profile");
      }
    };

    video.src = URL.createObjectURL(file);
  };

  let mediaType;
  const displayPreviewFile = (file) => {
    mediaType = file.type.split("/")[0];
    if (mediaType === "video") {
      return (
        <video
          id="video-preview"
          width="400"
          controls
          className="upload_image_preview_main"
        >
          <source src={URL.createObjectURL(file)} />
        </video>
      );
    } else if (mediaType === "image") {
      alert("You are only allowed to upload videos. Please refresh.");
      return (
        <img
          className="upload_image_preview_main"
          src={URL.createObjectURL(file)}
        />
      );
    }
  };

  const [additionalImages, setAdditionalImages] = useState([]);
  const [totalImageLinks, setTotalImageLinks] = useState([]);

  useDidMountEffect(() => {
    let allImages = true;
    for (let i = 0; i < additionalImages.length; i++) {
      let eachImage = additionalImages[i];
      const mediaType = eachImage.type.split("/")[0];
      if (mediaType != "image") {
        alert("Please upload images only");
        allImages = false;
        break;
      }
    }

    if (allImages) {
      const promiseArray = [];
      for (let i = 0; i < additionalImages.length; i++) {
        promiseArray.push(getImageUrl(additionalImages[i]));
      }

      Promise.all(promiseArray).then((results) => {
        setTotalImageLinks([...totalImageLinks, ...results]);
      });
    }
  }, [additionalImages]);

  const handleDeleteImageLink = (index) => {
    let netTotalImageLinks = [...totalImageLinks];
    netTotalImageLinks.splice(index, 1);
    setTotalImageLinks(netTotalImageLinks);
  };

  const itemTemplate = {
    name: "",
    size: "",
    color: "",
    price: "",
    stocks: ((Math.floor(Math.random() * 4) + 1) * 1000).toString(),
    image: "",
  };
  const [items, setItems] = useState([itemTemplate]);
  const addNewItem = () => {
    let newItems = [...items, itemTemplate];
    setItems(newItems);
  };
  const copyNewItem = () => {
    const copiedLastItem = { ...items[items.length - 1] };
    let newItems = [...items, copiedLastItem];
    setItems(newItems);
  };
  const handleDeleteItem = (index) => {
    if (items.length > 1) {
      let newItems = [...items];
      newItems.splice(index, 1);
      setItems(newItems);
    }
  };
  const handleItemsChange = (value, index, field) => {
    if (field === "image") {
      setTotalImageLinks([...totalImageLinks, value]);
    }

    let newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const [videoPosted, setVideoPosted] = useState(false);
  const postItem = () => {
    if (captionInput.length > 150) {
      alert("Caption length must be less than 150 characters...");
      return;
    }

    let haveAllRequiredFields = true;
    let firstItemImage = "";

    if (amazonOrInternal === "both" || amazonOrInternal === "internal") {
      for (const i in items) {
        const eachItem = items[i];
        if (
          eachItem.name === "" ||
          eachItem.price === "" ||
          eachItem.stocks === ""
        ) {
          haveAllRequiredFields = false;
          alert("Name, price, and stock available are required information");
          break;
        }
        if (!firstItemImage && eachItem.image != "") {
          firstItemImage = eachItem.image;
        }
      }
    }

    if (haveAllRequiredFields && !originalCreator) {
      haveAllRequiredFields = false;
      alert("Please enter the video creator's username");
    }

    if (amazonOrInternal === "both" || amazonOrInternal === "internal") {
      if (haveAllRequiredFields && !firstItemImage) {
        haveAllRequiredFields = false;
        alert("Please add at least one image to showcase your items");
      } else {
        items[0].image = firstItemImage;
      }
    }

    if (
      haveAllRequiredFields &&
      (amazonOrInternal === "both" ||
        amazonOrInternal === "amazon" ||
        amazonOrInternal === "internal")
    ) {
      for (const eachAmazon of amazons) {
        if (
          eachAmazon.amazon_link.indexOf("shoplocoloc06-20") < 0 ||
          eachAmazon.amazon_link.indexOf("https://www.amazon.com") < 0 ||
          eachAmazon.amazon_link.length < 30
        ) {
          haveAllRequiredFields = false;
          alert(
            "Please check if amazon link is affiliate link, & dont leave empty boxes"
          );
          break;
        }
      }
    }

    if (
      haveAllRequiredFields &&
      (amazonOrInternal === "both" || amazonOrInternal === "internal")
    ) {
      for (const eachAliexpress of aliexpress) {
        if (eachAliexpress.aliexpress_link.indexOf("aliexpress.com") < 0) {
          haveAllRequiredFields = false;
          alert(
            "Please check if aliexpress link is correct, & dont leave empty boxes"
          );
          break;
        }
      }
    }

    if (haveAllRequiredFields && amazonOrInternal === "small_shop") {
      if (smallShopLink.indexOf("https://") < 0) {
        haveAllRequiredFields = false;
        alert("Please add in the https:// for the small shop link");
      }
    }

    if (haveAllRequiredFields && selectedCategories.length === 0) {
      haveAllRequiredFields = false;
      alert("Please select at least 1 main category");
    }

    if (haveAllRequiredFields && !mainUrl) {
      haveAllRequiredFields = false;
      alert(
        "Sorry please try posting again in a few seconds or re-upload your video"
      );
    }

    if (haveAllRequiredFields) {
      setVideoPosted(true);
      axios
        .post(
          "/v1/video/uploadVideoAndItem?userId=" +
            localStorage.getItem("USER_ID"),
          {
            video: {
              url: mainUrl,
              coverImageUrl: coverUrl,
              mediaType: mediaType,
              caption: captionInput,
              categories: selectedCategories,
              subCatergories: selectedSubCategories,
              gender: genderIndexToString(selectedGender),
              likesCount: likesCount,
              originalCreator: originalCreator,
              amazons: amazons,
              aliexpress: aliexpress,
              smallShopLink: smallShopLink,
              productImages: totalImageLinks,
              amazonOrInternal: amazonOrInternal,
            },
            items: items,
          }
        )
        .then((response) => {
          history.push("/profile");
        });
    }
  };

  const [selectedCategories, setSelectedCategories] = useState([]);
  const handleSetCategory = (category) => {
    if (selectedCategories.includes(category)) {
      for (var i = selectedCategories.length - 1; i >= 0; i--) {
        if (selectedCategories[i] === category) {
          selectedCategories.splice(i, 1);
          break;
        }
      }
    } else {
      selectedCategories.push(category);
    }
    setSelectedCategories([...selectedCategories]);
  };

  const [subCategoriesList, setSubCategoriesList] = useState([]);
  useEffect(() => {
    const subCategoriesSet = new Set();
    for (const i in selectedCategories) {
      const eachSubCategoriesList =
        constants.SUB_CATEGORIES_DICT[selectedCategories[i]];
      for (const j in eachSubCategoriesList) {
        subCategoriesSet.add(eachSubCategoriesList[j]);
      }
    }

    setSubCategoriesList([...subCategoriesSet]);
  }, [selectedCategories]);

  const [selectedSubCategories, setSelectedSubCategories] = useState([]);
  const handleSetSubCategory = (subCategory) => {
    if (selectedSubCategories.includes(subCategory)) {
      for (var i = selectedSubCategories.length - 1; i >= 0; i--) {
        if (selectedSubCategories[i] === subCategory) {
          selectedSubCategories.splice(i, 1);
          break;
        }
      }
    } else {
      selectedSubCategories.push(subCategory);
    }
    setSelectedSubCategories([...selectedSubCategories]);
  };

  const [selectedGender, setSelectedGender] = useState(2);
  const handleSetGender = (id) => {
    setSelectedGender(id);
  };
  const genderIndexToString = (id) => {
    if (id === 0) {
      return "men";
    }
    if (id === 1) {
      return "women";
    }
    return "neutral";
  };

  const onMainVideoUpload = (event) => {
    console.log(event);
    const file = event.target.files[0];
    setFile(file);
  };

  return (
    <div className="upload_body">
      <div className="upload_header">
        <ArrowBackOutlinedIcon onClick={history.goBack} />
        <p>New Posts</p>
      </div>
      {/* Caption */}
      <div className="upload_CaptionPreview">
        <div className="upload_Caption">
          <textarea
            placeholder="Write your caption..."
            value={captionInput}
            onChange={(e) => setCaptionInput(e.target.value)}
            cols="40"
            rows="6"
            style={
              captionInput.length > 90 ? { color: "red" } : { color: "black" }
            }
          ></textarea>
        </div>
        {file ? (
          displayPreviewFile(file)
        ) : (
          <input
            style={{ height: "20px", width: "100px", display: "inline" }}
            type="file"
            name="file"
            onChange={(e) => onMainVideoUpload(e)}
          />
        )}
      </div>
      <div className="upload_input_container">
        <p>creator: @</p>
        <input
          value={originalCreator}
          onChange={(e) => setOriginalCreator(e.target.value)}
          type="text"
          placeholder="larry3107"
        />
      </div>

      <div className="upload_input_container">
        <p>amazon or internal or small shop: </p>
        <select
          id="amazonOrInternal"
          value={amazonOrInternal}
          onChange={(e) => setAmazonOrInternal(e.target.value)}
        >
          <option value="amazon">Amazon Only</option>
          <option value="small_shop">Small Shop</option>
          <option value="small_shop_and_amazon">Small Shop & Amazon</option>
          <option value="both">Amazon & Internal</option>
          <option value="internal">Internal Only</option>
        </select>
      </div>
      {(amazonOrInternal === "both" ||
        amazonOrInternal === "amazon" ||
        amazonOrInternal === "small_shop_and_amazon" ||
        amazonOrInternal === "internal") &&
        amazons.map((eachAmazon, index) => (
          <>
            <div className="upload_input_container">
              <p>amazon NAME: </p>
              <input
                placeholder="amazon product name"
                value={eachAmazon.amazon_name}
                onChange={(e) =>
                  handleAmazonsChange(e.target.value, index, "amazon_name")
                }
                type="text"
              />
              <ClearOutlinedIcon onClick={() => handleDeleteAmazon(index)} />
            </div>
            <div className="upload_input_container">
              <p>amazon LINK: </p>
              <input
                placeholder="MUST BE FULL AFFILIATE LINK"
                value={eachAmazon.amazon_link}
                onChange={(e) =>
                  handleAmazonsChange(e.target.value, index, "amazon_link")
                }
                type="text"
              />
              <AddIcon onClick={addNewAmazon} />
            </div>
          </>
        ))}

      {(amazonOrInternal === "both" || amazonOrInternal === "internal") &&
        aliexpress.map((eachAliexpress, index) => (
          <div className="upload_input_container">
            <p>aliexpress LINK: </p>
            <input
              placeholder="aliexpress product link"
              value={eachAliexpress.aliexpress_link}
              onChange={(e) =>
                handleAliexpressChange(e.target.value, index, "aliexpress_link")
              }
              type="text"
            />
            <AddIcon onClick={addNewAliexpress} />
            <ClearOutlinedIcon onClick={() => handleDeleteAliexpress(index)} />
          </div>
        ))}
      {(amazonOrInternal === "small_shop" ||
        amazonOrInternal === "small_shop_and_amazon") && (
        <div className="upload_input_container">
          <p>small shop link: </p>
          <input
            placeholder="MUST INCLUDE HTTPS://"
            value={smallShopLink}
            onChange={(e) => setSmallShopLink(e.target.value)}
            type="text"
          />
        </div>
      )}
      
      {/* Item Information */}
      {(amazonOrInternal === "both" || amazonOrInternal === "internal") &&
        items.map((eachItem, index) => (
          <ItemInformation
            key={index}
            index={index}
            name={eachItem.name}
            size={eachItem.size}
            color={eachItem.color}
            price={eachItem.price}
            stocks={eachItem.stocks}
            image={eachItem.image}
            handleItemsChange={handleItemsChange}
            handleDeleteItem={handleDeleteItem}
          />
        ))}

      {(amazonOrInternal === "both" || amazonOrInternal === "internal") && (
        <div className="upload_addAnotherItem">
          <p style={{ justifyContent: "flex-end" }} onClick={addNewItem}>
            add new item
          </p>
          <p style={{ width: "10%" }}>|</p>
          <p style={{ justifyContent: "flex-start" }} onClick={copyNewItem}>
            copy
          </p>
        </div>
      )}

      {(amazonOrInternal === "both" || amazonOrInternal === "internal") && (
        <div className="upload_CategoriesFormBody">
          {/* More Photos */}
          <p style={{ fontWeight: "bold", paddingBottom: "15px" }}>
            Additional Photos (dont add the same item images from above)
          </p>
          <input
            style={{ height: "20px", width: "100px", display: "inline" }}
            type="file"
            name="files"
            onChange={(e) => setAdditionalImages(e.target.files)}
            multiple
          />

          {totalImageLinks.map((eachImageLink, index) => (
            <div className="upload_input_container">
              <p>image link: ... {eachImageLink.slice(-30)} </p>
              <ClearOutlinedIcon onClick={() => handleDeleteImageLink(index)} />
            </div>
          ))}
        </div>
      )}

      <div className="upload_CategoriesFormBody">
        {/* Target Audience */}

        <p style={{ fontWeight: "bold", paddingBottom: "15px" }}>
          Target Audience
        </p>
        <p>Categories (maximum 3): </p>
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
        </div>
        <p>Sub-categories (maximum 3):</p>
        <div className="upload_mainCategoriesBox">
          {subCategoriesList.length > 0 ? (
            subCategoriesList.map((subCategory) => (
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
            ))
          ) : (
            <div
              className="upload_mainCategoriesTag"
              style={{ backgroundColor: "orange", color: "white" }}
            >
              <p>nil</p>
            </div>
          )}
        </div>

        <p>Gender:</p>
        <div className="upload_mainCategoriesBox">
          {constants.GENDER_LIST.map((gender, i) => (
            <div
              className="upload_mainCategoriesTag"
              style={
                i === selectedGender
                  ? { backgroundColor: "orange", color: "white" }
                  : null
              }
              onClick={() => handleSetGender(i)}
            >
              <p>{gender}</p>
            </div>
          ))}
        </div>
        <div className="upload_input_container">
          <p>likesCount: </p>
          <input
            value={likesCount}
            onChange={(e) => setLikesCount(e.target.value)}
            type="number"
          />
        </div>
      </div>
      <Button
        className="upload_postItem"
        onClick={postItem}
        style={{ borderTop: "1px solid lightgray" }}
        disabled={videoPosted}
      >
        <p style={{ fontWeight: "bold" }}>POST</p>
      </Button>
      <StaySlidingSetUp open={checked} handleClose={handleSetUpClose} />
    </div>
  );
};
