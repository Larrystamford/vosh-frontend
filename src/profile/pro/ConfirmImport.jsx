import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

export const ConfirmImport = ({
  openImport,
  setOpenImport,
  handleImportClicked,
}) => {
  return (
    <Dialog
      open={openImport}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{"Confirm Import"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <p>Importing your content from TikTok might take a few minutes</p>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenImport(false)}>Cancel</Button>
        <Button
          onClick={() => {
            handleImportClicked();
            setOpenImport(false);
          }}
          color="primary"
          autoFocus
        >
          Start
        </Button>
      </DialogActions>
    </Dialog>
  );
};
