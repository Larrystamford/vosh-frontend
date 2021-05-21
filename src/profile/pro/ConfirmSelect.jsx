import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

export const ConfirmSelect = ({
  openSelect,
  setOpenSelect,
  handleSelectVideo,
  setChangesMade,
}) => {
  return (
    <Dialog
      open={openSelect != -1}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {"Continue without publishing"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <p>You have not published your changes</p>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenSelect(-1)}>Cancel</Button>
        <Button
          onClick={() => {
            handleSelectVideo(openSelect);
            setOpenSelect(-1);
            setChangesMade(false);
          }}
          color="primary"
          autoFocus
        >
          Continue
        </Button>
      </DialogActions>
    </Dialog>
  );
};
