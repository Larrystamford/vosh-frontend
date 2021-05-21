import React from "react";
import usePushNotifications from "../customHooks/usePushNotifications";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

// pushType: "comments", "apurchased", "like"
export const PushNotificationPrompt = ({
  notifPrompt,
  setNotifPrompt,
  promptType,
  setPromptType,
}) => {
  const {
    userConsent,
    pushNotificationSupported,
    initiatePermissionFlow,
  } = usePushNotifications();

  const isConsentGranted = userConsent === "granted";

  const PromptText = () => {
    let text = "Vosh would like to send you notifications";

    if (promptType === "comments") {
      text =
        "By allowing notifications, we can let you know when other users reply to your comments.";
    } else if (promptType === "like") {
      text =
        "Enjoying Vosh? Be the first to know when new videos like this are uploaded!";
    } else if (promptType === "purchased") {
      text = "Get real-time delivery information by allowing notifications.";
    }
    return (
      <DialogContentText id="alert-dialog-description">
        {text}
      </DialogContentText>
    );
  };

  if (
    isConsentGranted ||
    !pushNotificationSupported ||
    localStorage.getItem("PUSH_BLOCKED") === "true" ||
    !localStorage.getItem("USER_ID")
  ) {
    return <></>;
  } else {
    return (
      <div>
        <Dialog
          open={notifPrompt}
          onClose={() => setNotifPrompt(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Allow Notifications"}
          </DialogTitle>
          <DialogContent>{PromptText()}</DialogContent>
          <DialogActions>
            <Button onClick={() => setNotifPrompt(false)}>Back</Button>
            <Button
              onClick={() => {
                setNotifPrompt(false);
                initiatePermissionFlow();
              }}
              color="primary"
              autoFocus
            >
              Ok
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
};
