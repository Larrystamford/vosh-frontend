import React, { useState } from "react";
import { Offline, Detector } from "react-detect-offline";
import {useDidMountEffect} from "../customHooks/useDidMountEffect"
import { Snackbar } from "@material-ui/core";
import ClearOutlinedIcon from "@material-ui/icons/ClearOutlined";

export const OfflineDetection = (props) => {
  const [openOffline, setOpenOffline] = useState(true);

  useDidMountEffect(() => {
    setTimeout(() => setOpenOffline(true), 60000);
  }, [openOffline]);

  return (
    <>
      <Offline>
        <Snackbar
          open={openOffline}
          message="Network Connections Offline"
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          action={
            <div
              style={{ width: "2rem" }}
              onClick={() => setOpenOffline(false)}
            >
              <ClearOutlinedIcon />
            </div>
          }
        />
      </Offline>
    </>
  );
};
