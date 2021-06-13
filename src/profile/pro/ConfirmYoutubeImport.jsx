import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

export const ConfirmYoutubeImport = ({
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
      <DialogTitle id="alert-dialog-title">
        {"Notice Before Import"}
      </DialogTitle>
      <DialogContent>
        <span style={{ fontSize: "14px" }}>
          Please ensure that your youtube link that was added contains your
          channel ID which looks like:
        </span>
        <p style={{ fontSize: "14px", fontStyle: "italic" }}>
          https://youtube.com/channel/UCzs...
        </p>
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
