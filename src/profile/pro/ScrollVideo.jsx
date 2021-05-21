import React from "react";
import "./ProEdit.css";
import { ProfileFeed } from "../../feed/ProfileFeed";

import { useHistory } from "react-router";

import Dialog from "@material-ui/core/Dialog";
import { makeStyles } from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  dialog: {
    position: "absolute",
    margin: 0,
    width: "104vw",
    minHeight: "100vh",
    backgroundColor: "white",
  },
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "40ch",
    },
  },
}));

export const ScrollVideo = ({
  openScrollVideo,
  proVideos,
  viewIndex,
  handleChangeView,
  selectedCategoryId,
  proTheme,
  userId
}) => {
  const history = useHistory();
  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Dialog
      style={{ zIndex: 10000 }}
      open={openScrollVideo}
      keepMounted
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
      fullScreen={fullScreen}
    >
      <ProfileFeed
        videos={proVideos.filter((video) => {
          if (selectedCategoryId === "all") {
            return video;
          } else {
            return video.proCategories.includes(selectedCategoryId);
          }
        })}
        viewIndex={viewIndex}
        handleChangeView={handleChangeView}
        proTheme={proTheme}
        userId={userId}
      />
    </Dialog>
  );
};
