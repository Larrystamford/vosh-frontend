import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import { useHistory } from "react-router";

export const ConfirmBack = ({
  openSelect2,
  setOpenSelect2,
  setChangesMade,
}) => {
  const history = useHistory();
  return (
    <Dialog
      open={openSelect2}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {"Exit without publishing"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <p>You have not published your changes</p>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setOpenSelect2(false);
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={() => {
            setOpenSelect2(false);
            setChangesMade(false);
            history.push({
              pathname: "/ProEdit",
            });
          }}
          color="primary"
          autoFocus
        >
          Exit
        </Button>
      </DialogActions>
    </Dialog>
  );
};
