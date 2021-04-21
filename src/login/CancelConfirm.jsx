import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import axios from "../axios";
// pushType: "comments", "apurchased", "like"
export const CancelConfirm = ({openCancel, setOpenCancel, handleCloseSignIn}) => {


  const PromptText = () => {
    let text = "Signing in will let us provide you with the best experience.";

    return (
      <DialogContentText id="alert-dialog-description">
        {text}
      </DialogContentText>
    );
  };

    return (
      <div>
        <Dialog
          open={openCancel}
          onClose={() => setOpenCancel(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Skip Sign In?"}
          </DialogTitle>
          <DialogContent>{PromptText()}</DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenCancel(false)}>Back</Button>
            <Button
              onClick={() => {
                setOpenCancel(false)
                handleCloseSignIn()
              }}
              color="primary"
              autoFocus
            >
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
};
