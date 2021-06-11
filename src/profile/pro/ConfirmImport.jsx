import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";

export const ConfirmImport = ({
  openImport,
  setOpenImport,
  handleImportClicked,
  sharableUrl,
  setSharableUrl,
}) => {
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      // onSubmitSignUp();
    }
  };
  const [focused, setFocused] = useState(false);

  return (
    <Dialog
      open={openImport}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{"Import TikTok Video"}</DialogTitle>
      <div className="dialog_field_general">
        <TextField
          label="Sharable TikTok Link"
          variant="outlined"
          value={sharableUrl}
          onChange={(e) => setSharableUrl(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{ backgroundColor: "white", marginTop: "1rem", width: "85%" }}
        />
        <span></span>
      </div>
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
          Import
        </Button>
      </DialogActions>
    </Dialog>
  );
};
