import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import MenuItem from "@material-ui/core/MenuItem";

import clsx from "clsx";
import { useWindowSize } from "../../customHooks/useWindowSize";
import { makeStyles } from "@material-ui/core/styles";

const categoryIcons = [
  {
    link: "https://dciv99su0d7r5.cloudfront.net/Amazon.png",
  },
  {
    link: "https://dciv99su0d7r5.cloudfront.net/Depop.png",
  },
  {
    link: "https://dciv99su0d7r5.cloudfront.net/Shein (2).png",
  },
  {
    link: "https://dciv99su0d7r5.cloudfront.net/Shopee.png",
  },
  {
    link: "https://dciv99su0d7r5.cloudfront.net/Walmart+(2).png",
  },
  {
    link: "https://dciv99su0d7r5.cloudfront.net/Lazada+(2).png",
  },
  {
    link: "https://dciv99su0d7r5.cloudfront.net/Ulta.png",
  },
  {
    link: "https://dciv99su0d7r5.cloudfront.net/Pacsun.png",
  },
  {
    link: "https://dciv99su0d7r5.cloudfront.net/fire.png",
  },
  {
    link: "https://dciv99su0d7r5.cloudfront.net/store.png",
  },
  {
    link: "https://dciv99su0d7r5.cloudfront.net/bonus.png",
  },
  {
    link: "https://dciv99su0d7r5.cloudfront.net/house.png",
  },
  {
    link: "https://dciv99su0d7r5.cloudfront.net/bag.png",
  },
  {
    link: "https://dciv99su0d7r5.cloudfront.net/wristwatch.png",
  },
  {
    link: "https://dciv99su0d7r5.cloudfront.net/necklace.png",
  },
  {
    link: "https://dciv99su0d7r5.cloudfront.net/sneakers.png",
  },
  {
    link: "https://dciv99su0d7r5.cloudfront.net/baseball-cap.png",
  },
  {
    link: "https://dciv99su0d7r5.cloudfront.net/cat.png",
  },
  {
    link: "https://dciv99su0d7r5.cloudfront.net/dog.png",
  },
  {
    link: "https://dciv99su0d7r5.cloudfront.net/pawprint.png",
  },
  {
    link: "https://dciv99su0d7r5.cloudfront.net/confetti.png",
  },
  {
    link: "https://dciv99su0d7r5.cloudfront.net/online-shopping.png",
  },
];

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

export const LinkEditCategory = ({
  inputValues,
  setInputValues,
  openLinkEdit,
  setOpenLinkEdit,
  handleLinkEditClose,
  linksState,
  setlinksState,
  editingIndex,
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

  const handleLinkEditSave = () => {
    if (
      inputValues.proCategoryName != "" &&
      inputValues.proCategoryImage != ""
    ) {
      if (inputValues.proCategoryName.length > 10) {
        alert("Sorry, maximum 10 Characters!");
      } else {
        if (editingIndex > -1) {
          let prevItems = linksState["items"];
          prevItems[editingIndex] = {
            _id: prevItems[editingIndex]._id,
            id: prevItems[editingIndex].id,
            proCategoryName: inputValues.proCategoryName,
            proCategoryImage: inputValues.proCategoryImage,
          };
          setlinksState({ items: prevItems });
        } else {
          setlinksState((prevState) => ({
            items: [
              ...prevState["items"],
              {
                id: inputValues.proCategoryName + new Date().getTime(),
                proCategoryName: inputValues.proCategoryName,
                proCategoryImage: inputValues.proCategoryImage,
              },
            ],
          }));
        }
        setOpenLinkEdit(false);
      }
    } else {
      alert("Fields cannot be empty");
    }
  };

  return (
    <Dialog open={openLinkEdit}>
      <DialogContent>
        <DialogContentText>
          {editingIndex === -1 ? "Add New Category" : "Edit Category"}
        </DialogContentText>
        <TextField
          className={clsx(classes.margin, classes.textField)}
          size={size.height < 580 ? "small" : null}
          id="outlined-start-adornment"
          select
          label="Select Logo"
          variant="outlined"
          onChange={handleChange("proCategoryImage")}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{ backgroundColor: "white", marginTop: "1rem" }}
          value={inputValues.proCategoryImage}
        >
          {categoryIcons.map((option) => (
            <MenuItem key={option.link} value={option.link}>
              <img style={{ height: 20, paddingRight: 30 }} src={option.link} />
            </MenuItem>
          ))}
        </TextField>
        <TextField
          size={size.height < 580 ? "small" : null}
          label={`Category Name (${inputValues.proCategoryName.length}/10)`}
          id="outlined-start-adornment"
          className={clsx(classes.margin, classes.textField)}
          variant="outlined"
          value={inputValues.proCategoryName}
          onChange={handleChange("proCategoryName")}
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
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};
