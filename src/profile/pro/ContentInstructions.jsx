import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import PersonIcon from "@material-ui/icons/Person";
import AddIcon from "@material-ui/icons/Add";
import Typography from "@material-ui/core/Typography";
import { blue } from "@material-ui/core/colors";

const emails = ["username@gmail.com", "user02@gmail.com"];
const useStyles = makeStyles({
  avatar: {
    backgroundColor: blue[100],
    color: blue[600],
  },
});

export const ContentInstructions = ({
  open,
  setInstructionsOpen,
  handleSocialsOpen,
}) => {
  const classes = useStyles();

  return (
    <Dialog
      onClose={() => {
        setInstructionsOpen(false);
      }}
      aria-labelledby="simple-dialog-title"
      open={open}
    >
      <DialogTitle id="simple-dialog-title">Import Instructions</DialogTitle>

      <div
        style={{
          minWidth: "80vw",
          height: "11rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <div
          style={{
            width: "90%",
            height: "3rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            fontWeight: "bold",
          }}
        >
          <p
            onClick={() => {
              setInstructionsOpen(false);
              handleSocialsOpen();
            }}
          >
            1.{" "}
            <span style={{ fontStyle: "italic", color: "blue" }}>
              Link Your Social Accounts
            </span>
          </p>
        </div>
        <div
          style={{
            width: "90%",
            height: "3rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            fontWeight: "bold",
          }}
        >
          <p>2. Click Import and Wait</p>
        </div>
        <div
          style={{
            width: "90%",
            height: "3rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            fontWeight: "bold",
          }}
        >
          <p>3. Tag and Publish Your Content</p>
        </div>
      </div>
    </Dialog>
  );
};
