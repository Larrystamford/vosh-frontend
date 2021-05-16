import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import MenuItem from "@material-ui/core/MenuItem";

import clsx from "clsx";
import { useWindowSize } from "../../customHooks/useWindowSize";
import { makeStyles } from "@material-ui/core/styles";

const colorChoices = [
  "olive",
  "navy",
  "blue",
  "teal",
  "aqua",
  "aliceblue",
  "darkcyan",
  "darkgoldenrod",
  "darkslateblue",
  "indianred",
  "indigo",
  "slategray",
  "black",
  "white",
  "gray",
  "maroon",
  "silver",
  "orange",
  "red",
  "purple",
  "green",
  "aquamarine",
  "beige",
  "bisque",
  "brown",
  "burlywood",
];

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
  },
  margin: {
    margin: theme.spacing(1),
  },
  withoutLabel: {
    marginTop: theme.spacing(1),
  },
  textField: {
    width: "100%",
  },
  multilineColor: {
    color: "black",
  },
}));

export const ColorSelection = ({
  openColorSelection,
  setOpenColorSelection,
  linkBoxColor,
  handleSetLinkBoxColor,
  handleSaveLinkBoxColor,
  limitedColors,
}) => {
  const size = useWindowSize();
  const classes = useStyles();

  return (
    <Dialog open={openColorSelection} onClose={handleSaveLinkBoxColor}>
      <DialogContent>
        <TextField
          className={clsx(classes.margin, classes.textField)}
          size={size.height < 580 ? "small" : null}
          id="outlined-start-adornment"
          select
          label="Select Color"
          variant="outlined"
          style={{ backgroundColor: "white", marginTop: "1rem" }}
          value={linkBoxColor}
          onChange={handleSetLinkBoxColor}
        >
          {limitedColors
            ? limitedColors.map((color) => (
                <MenuItem key={color} value={color}>
                  <div
                    style={{
                      height: 20,
                      width: 20,
                      backgroundColor: color,
                      borderRadius: 5,
                    }}
                  ></div>
                  <p
                    style={{
                      fontSize: 14,
                      paddingLeft: 10,
                    }}
                  >
                    {color}
                  </p>
                </MenuItem>
              ))
            : colorChoices.map((color) => (
                <MenuItem key={color} value={color}>
                  <div
                    style={{
                      height: 20,
                      width: 20,
                      backgroundColor: color,
                      borderRadius: 5,
                    }}
                  ></div>
                  <p
                    style={{
                      fontSize: 14,
                      paddingLeft: 10,
                    }}
                  >
                    {color}
                  </p>
                </MenuItem>
              ))}
        </TextField>
      </DialogContent>
    </Dialog>
  );
};
