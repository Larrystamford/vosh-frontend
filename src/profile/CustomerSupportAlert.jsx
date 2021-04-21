import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import axios from "../axios";

export const CustomerSupportAlert = ({
  openCustomer,
  setOpenCustomer,
  buySellItemId,
}) => {
  const sendCustomerSupportEmail = async () => {
    await axios.post("/v1/email/customerSupport", {
      userId: localStorage.getItem("USER_ID"),
      buySellItemId: buySellItemId,
    });

    alert("An email has been sent to you.");
  };

  return (
    <div>
      <Dialog
        open={openCustomer}
        onClose={() => setOpenCustomer(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Contact Customer Support?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Upon confirming, our staff will reach out to you via email.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCustomer(false)} color="primary">
            Back
          </Button>
          <Button
            onClick={() => {
              setOpenCustomer(false);
              sendCustomerSupportEmail();
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
