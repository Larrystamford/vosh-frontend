import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";

import clsx from "clsx";
import { useWindowSize } from "../../customHooks/useWindowSize";
import { makeStyles } from "@material-ui/core/styles";

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

export const LinkEdit = ({
  openLinkEdit,
  setOpenLinkEdit,
  handleLinkEditClose,
  linksState,
  setlinksState,
  inputValues,
  setInputValues,
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
    if (inputValues.proLinkName != "" && inputValues.proLink != "") {
      if (inputValues.proLink.toLowerCase().includes("http")) {
        if (editingIndex > -1) {
          let prevItems = linksState["items"];
          prevItems[editingIndex] = {
            id: inputValues.proLink,
            proLink: inputValues.proLink,
            proLinkName: inputValues.proLinkName,
          };
          setlinksState({ items: prevItems });
        } else {
          setlinksState((prevState) => ({
            items: [
              ...prevState["items"],
              {
                id: inputValues.proLink,
                proLink: inputValues.proLink,
                proLinkName: inputValues.proLinkName,
              },
            ],
          }));
        }
        setOpenLinkEdit(false);
      } else {
        alert("Please include HTTPS:// in your link");
      }
    } else {
      alert("Fields cannot be empty");
    }
  };

  return (
    <Dialog open={openLinkEdit}>
      <DialogContent>
        <DialogContentText>
          {editingIndex == -1 ? "Add New Link" : "Edit Link"}
        </DialogContentText>
        <TextField
          size={size.height < 580 ? "small" : null}
          label="Link Name"
          id="outlined-start-adornment"
          className={clsx(classes.margin, classes.textField)}
          variant="outlined"
          value={inputValues.proLinkName}
          onChange={handleChange("proLinkName")}
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
          value={inputValues.proLink}
          onChange={handleChange("proLink")}
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
