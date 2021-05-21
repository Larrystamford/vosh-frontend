import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import {
  convertSocialTypeToImage,
  convertSocialTypeToHelper,
  convertUsernameToSocialLink,
} from "../../helpers/CommonFunctions";

import clsx from "clsx";
import { useWindowSize } from "../../customHooks/useWindowSize";
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import MenuItem from "@material-ui/core/MenuItem";

const SocialMediaTypes = [
  {
    label: "TikTok",
  },
  {
    label: "Instagram",
  },
  {
    label: "Youtube",
  },
  {
    label: "Twitch",
  },
  {
    label: "Pinterest",
  },
  {
    label: "Facebook",
  },
  {
    label: "Twitter",
  },
  {
    label: "Discord",
  },
  {
    label: "Spotify",
  },
  {
    label: "Telegram",
  },
  {
    label: "Whatsapp",
  },
  {
    label: "Snapchat",
  },
  {
    label: "Email",
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

export const LinkEditSocial = ({
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
  const [linkDetails, setLinkDetails] = useState("");

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
    if (inputValues.socialType != "" && inputValues.userIdentifier != "") {
      const socialLink = convertUsernameToSocialLink(
        inputValues.socialType,
        inputValues.userIdentifier
      );
      if (
        socialLink.toLowerCase().includes("http") ||
        inputValues.socialType === "Email"
      ) {
        if (editingIndex > -1) {
          let prevItems = linksState["items"];
          prevItems[editingIndex] = {
            _id: prevItems[editingIndex]._id,
            id: prevItems[editingIndex].id,
            socialLink: socialLink,
            userIdentifier: inputValues.userIdentifier,
            socialType: inputValues.socialType,
          };
          setlinksState({ items: prevItems });
        } else {
          setlinksState((prevState) => ({
            items: [
              ...prevState["items"],
              {
                id: socialLink + new Date().getTime(),
                socialLink: socialLink,
                userIdentifier: inputValues.userIdentifier,
                socialType: inputValues.socialType,
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
          {editingIndex === -1 ? "Add New Social Link" : "Edit Social Link"}
        </DialogContentText>
        <TextField
          className={clsx(classes.margin, classes.textField)}
          size={size.height < 580 ? "small" : null}
          id="outlined-start-adornment"
          select
          label="Select Social"
          variant="outlined"
          onChange={handleChange("socialType")}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{ backgroundColor: "white", marginTop: "1rem" }}
          value={inputValues.socialType}
        >
          {SocialMediaTypes.map((option) => (
            <MenuItem key={option.label} value={option.label}>
              <img
                style={{ height: 15, paddingRight: 10 }}
                src={convertSocialTypeToImage(option.label)}
              />
              {option.label}
            </MenuItem>
          ))}
        </TextField>

        {inputValues.socialType ? (
          <TextField
            size={size.height < 580 ? "small" : null}
            label={convertSocialTypeToHelper(inputValues.socialType)}
            id="outlined-start-adornment"
            className={clsx(classes.margin, classes.textField)}
            variant="outlined"
            value={inputValues.userIdentifier}
            onChange={handleChange("userIdentifier")}
            onKeyDown={handleKeyDown}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            style={{ backgroundColor: "white", marginTop: "1rem" }}
            InputProps={
              convertSocialTypeToHelper(inputValues.socialType) ===
                "Your Username" && {
                startAdornment: (
                  <InputAdornment position="start">@</InputAdornment>
                ),
              }
            }
          />
        ) : (
          <TextField
            size={size.height < 580 ? "small" : null}
            label="Your Username"
            id="outlined-start-adornment"
            className={clsx(classes.margin, classes.textField)}
            variant="outlined"
            value={inputValues.userIdentifier}
            onChange={handleChange("userIdentifier")}
            onKeyDown={handleKeyDown}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            style={{ backgroundColor: "white", marginTop: "1rem" }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">@</InputAdornment>
              ),
            }}
          />
        )}
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
