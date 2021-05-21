import React, { useState, useRef } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";

import clsx from "clsx";
import { useWindowSize } from "../../customHooks/useWindowSize";
import { makeStyles } from "@material-ui/core/styles";

import AddPhotoAlternateOutlinedIcon from "@material-ui/icons/AddPhotoAlternateOutlined";
import DeleteOutlineOutlinedIcon from "@material-ui/icons/DeleteOutlineOutlined";

import axios from "../../axios";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
  },
  margin: {
    margin: theme.spacing(1),
  },
  withoutLabel: {
    marginTop: theme.spacing(1),
  },
  textField: {
    width: "100%",
  },
  multilineColor: {
    color: "black",
  },
}));

export const LinkItemEdit = ({
  openLinkEdit,
  setOpenLinkEdit,
  handleLinkEditClose,
  linksState,
  setLinksState,
  inputValues,
  setInputValues,
  editingIndex,
  setPreviousLinks,
  gettingProductImage,
  setGettingProductImage,
}) => {
  const [focused, setFocused] = useState(false);

  const size = useWindowSize();
  const classes = useStyles();

  const handleChange = (prop) => (event) => {
    setInputValues({ ...inputValues, [prop]: event.target.value });
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      // onSubmitSignUp();
    }
  };

  const updateItemWithProductImage = async (
    new_id,
    new_itemLink,
    new_itemLinkName,
    new_itemIndex
  ) => {
    setGettingProductImage(true);

    let webImageLink;
    axios
      .post("/v1/upload/getImageURLByScrapping/", {
        webLink: inputValues.itemLink,
      })
      .then((res) => {
        webImageLink = res.data.productLink;
        let prevItems = linksState["items"];

        const newLinkObj = {
          id: new_id,
          itemLink: new_itemLink,
          itemLinkName: new_itemLinkName,
          itemImage: webImageLink,
        };

        prevItems[new_itemIndex] = newLinkObj;

        setLinksState({ items: prevItems });
        setPreviousLinks((prevState) => [newLinkObj, ...prevState]);
        setGettingProductImage(false);
      });
  };

  const handleLinkEditSave = async () => {
    if (inputValues.itemLink != "" && inputValues.itemLinkName != "") {
      if (inputValues.itemLink.toLowerCase().includes("http")) {
        if (editingIndex > -1) {
          let prevItems = linksState["items"];
          const linkEditObj = {
            _id: prevItems[editingIndex]._id,
            id: prevItems[editingIndex].id,
            itemLink: inputValues.itemLink,
            itemLinkName: inputValues.itemLinkName,
            itemImage: inputValues.itemImage,
          };
          prevItems[editingIndex] = linkEditObj;

          setPreviousLinks((prevState) => [linkEditObj, ...prevState]);
          setLinksState({ items: prevItems });
        } else {
          let new_id = inputValues.itemLink + new Date().getTime();
          let new_itemLink = inputValues.itemLink;
          let new_itemLinkName = inputValues.itemLinkName;
          let new_itemIndex = linksState.items.length;

          const linkObj = {
            id: new_id,
            itemLink: new_itemLink,
            itemLinkName: new_itemLinkName,
          };

          setLinksState((prevState) => ({
            items: [...prevState["items"], linkObj],
          }));

          updateItemWithProductImage(
            new_id,
            new_itemLink,
            new_itemLinkName,
            new_itemIndex
          );
        }

        setOpenLinkEdit(false);
      } else {
        alert("Please include HTTPS:// in your link");
      }
    } else {
      alert("Fields cannot be empty");
    }
  };

  // change profile picture
  const hiddenFileInput = useRef(null);
  const handleUploadClick = (event) => {
    hiddenFileInput.current.click();
  };
  const handleFileUpload = async (file) => {
    const mediaType = file.type.split("/")[0];
    if (mediaType != "image") {
      alert("Please upload images only");
    } else {
      const imageUrl = await getFileUrl(file);
      // await axios.put("/v1/users/update/" + localStorage.getItem("USER_ID"), {
      //   picture: imageUrl,
      // });

      setInputValues({ ...inputValues, itemImage: imageUrl });
    }
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
    <Dialog open={openLinkEdit}>
      <DialogContent>
        <DialogContentText>
          {editingIndex === -1 ? "Add New Product" : "Edit Product"}
        </DialogContentText>

        {editingIndex > -1 && (
          <div className="SlidingEdit_Big_Image_Wrapper">
            {inputValues.itemImage ? (
              <img
                className="SlidingEdit_Big_Image_Placeholder"
                src={inputValues.itemImage}
                onClick={handleUploadClick}
              />
            ) : (
              <div
                className="SlidingEdit_Big_Image_Placeholder"
                onClick={handleUploadClick}
              >
                <p style={{ fontSize: 13, textAlign: "center" }}>
                  Optional Image
                </p>
              </div>
            )}

            <div className="SlidingEdit_Big_Image_Icons_Wrapper">
              <AddPhotoAlternateOutlinedIcon onClick={handleUploadClick} />
              <DeleteOutlineOutlinedIcon
                style={{ marginTop: "15px" }}
                onClick={() => {
                  setInputValues({ ...inputValues, itemImage: "" });
                }}
              />
              <input
                ref={hiddenFileInput}
                type="file"
                name="file"
                onChange={(e) => {
                  handleFileUpload(e.target.files[0]);
                }}
              />
            </div>
          </div>
        )}

        <TextField
          size={size.height < 580 ? "small" : null}
          label="Product Name"
          id="outlined-start-adornment"
          className={clsx(classes.margin, classes.textField)}
          variant="outlined"
          value={inputValues.itemLinkName}
          onChange={handleChange("itemLinkName")}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{ backgroundColor: "white", marginTop: "1rem" }}
        />

        <TextField
          size={size.height < 580 ? "small" : null}
          label="https://www.website.com"
          id="outlined-start-adornment"
          className={clsx(classes.margin, classes.textField)}
          variant="outlined"
          value={inputValues.itemLink}
          onChange={handleChange("itemLink")}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{ backgroundColor: "white", marginTop: "1rem" }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleLinkEditClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleLinkEditSave} color="primary">
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
};
