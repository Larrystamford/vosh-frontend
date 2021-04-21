import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import axios from "../axios";

export const ConfirmItemDelivery = ({
  openConfirmDelivery,
  setOpenConfirmDelivery,
  buySellItemId,
  setConfirmedDelivery,
}) => {
  const updateShippingStatus = async () => {
    await axios
      .put("/v1/users/updateShippingStatus/", {
        buySellItemId: buySellItemId,
        buyerDeliveryStatus: "delivered",
        sellerDeliveryStatus: "delivered",
      })
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.error(error);
      });

    setConfirmedDelivery(true);
  };

  return (
    <div>
      <Dialog
        open={openConfirmDelivery}
        onClose={() => setOpenConfirmDelivery(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirm Order Received?"}
        </DialogTitle>

        <DialogActions>
          <Button onClick={() => setOpenConfirmDelivery(false)} color="primary">
            Back
          </Button>
          <Button
            onClick={() => {
              setOpenConfirmDelivery(false);
              updateShippingStatus();
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
