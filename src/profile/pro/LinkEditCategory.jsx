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
    link: "https://media2locoloco-us.s3.amazonaws.com/store.png",
  },
  {
    link: "https://media2locoloco-us.s3.amazonaws.com/bonus.png",
  },
  {
    link: "https://media2locoloco-us.s3.amazonaws.com/house.png",
  },
  {
    link: "https://media2locoloco-us.s3.amazonaws.com/bag.png",
  },
  {
    link: "https://media2locoloco-us.s3.amazonaws.com/wristwatch.png",
  },
  {
    link: "https://media2locoloco-us.s3.amazonaws.com/necklace.png",
  },
  {
    link: "https://media2locoloco-us.s3.amazonaws.com/sneakers.png",
  },
  {
    link: "https://media2locoloco-us.s3.amazonaws.com/baseball-cap.png",
  },
  {
    link: "https://media2locoloco-us.s3.amazonaws.com/cat.png",
  },
  {
    link: "https://media2locoloco-us.s3.amazonaws.com/dog.png",
  },
  {
    link: "https://media2locoloco-us.s3.amazonaws.com/pawprint.png",
  },
  {
    link: "https://media2locoloco-us.s3.amazonaws.com/confetti.png",
  },
  {
    link: "https://media2locoloco-us.s3.amazonaws.com/online-shopping.png",
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
      if (editingIndex > -1) {
        let prevItems = linksState["items"];
        prevItems[editingIndex] = {
          id: inputValues.proCategoryName,
          proCategoryName: inputValues.proCategoryName,
          proCategoryImage: inputValues.proCategoryImage,
        };
        setlinksState({ items: prevItems });
      } else {
        setlinksState((prevState) => ({
          items: [
            ...prevState["items"],
            {
              id: inputValues.proCategoryName,
              proCategoryName: inputValues.proCategoryName,
              proCategoryImage: inputValues.proCategoryImage,
            },
          ],
        }));
      }
      setOpenLinkEdit(false);
    } else {
      alert("Fields cannot be empty");
    }
  };

  return (
    <Dialog open={openLinkEdit}>
      <DialogContent>
        <DialogContentText>
          {editingIndex == -1 ? "Add New Category" : "Edit Category"}
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
          label="Category Name"
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
