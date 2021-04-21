import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import axios from "../axios";

export const CaptionEdit = ({
  openCaption,
  setOpenCaption,
  handleCaptionOpen,
  handleCaptionClose,
  setProfileBio,
}) => {
  const [caption, setCaption] = useState("");

  const handleSaveCaption = async () => {
    await axios.put("/v1/users/update/" + localStorage.getItem("USER_ID"), {
      profileBio: caption,
    });
    setProfileBio(caption);
    setOpenCaption(false);
  };

  return (
    <Dialog open={openCaption} onClose={handleCaptionClose}>
      <DialogContent>
        <DialogContentText>Describe yourself</DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          label="bio"
          type="text"
          fullWidth
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCaptionClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSaveCaption} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};
