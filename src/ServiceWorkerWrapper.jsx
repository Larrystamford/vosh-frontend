import React, { useEffect, useState } from "react";
import { Snackbar, Button } from "@material-ui/core";
import * as serviceWorker from "./serviceWorker";

export const ServiceWorkerWrapper = () => {
  const [showReload, setShowReload] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState(null);


  const onSWUpdate = (registration) => {
    console.log("sw has updates");
    // setShowReload(true);
    setWaitingWorker(registration.waiting);
    setTimeout(() => {
      if (waitingWorker) {
        console.log("force skip waiting");
        waitingWorker.postMessage({ type: "SKIP_WAITING" });
      }
    }, 3000);
  };

  useEffect(() => {
    console.log("registering service workers");
    serviceWorker.register({ onUpdate: onSWUpdate });
  }, []);

  const reloadPage = () => {
    waitingWorker.postMessage({ type: "SKIP_WAITING" });
    setShowReload(false);
    window.location.reload();
  };

  return (
    <Snackbar
      open={showReload}
      message="A new version is available!"
      onClick={reloadPage}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      action={
        <Button color="inherit" size="small" onClick={reloadPage}>
          Reload
        </Button>
      }
    />
  );
};
