import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

export const ConfirmDelete = ({
  openCancel,
  setOpenCancel,
  deleteItem,
  deleteIndex,
  handleDeleteItem,
}) => {
  const PromptText = () => {
    let text = `Deleteing ${deleteItem}`;

    return (
      <DialogContentText id="alert-dialog-description">
        <p
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {text}
        </p>
      </DialogContentText>
    );
  };

  return (
    <Dialog
      open={openCancel}
      onClose={() => setOpenCancel(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
      <DialogContent>{PromptText()}</DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenCancel(false)}>Cancel</Button>
        <Button
          onClick={() => {
            setOpenCancel(false);
            handleDeleteItem(deleteIndex);
          }}
          color="primary"
          autoFocus
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};
