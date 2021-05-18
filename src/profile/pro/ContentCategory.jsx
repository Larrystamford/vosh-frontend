import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";

import FormLabel from "@material-ui/core/FormLabel";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import Checkbox from "@material-ui/core/Checkbox";

import clsx from "clsx";
import { useWindowSize } from "../../customHooks/useWindowSize";
import { makeStyles } from "@material-ui/core/styles";

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

export const ContentCategory = ({
  openContentCategory,
  setOpenContentCategory,
  proCategories,
  categorySelection,
  setCategorySelection,
  handleDoneCategories,
}) => {
  const classes = useStyles();

  const handleChange = (event) => {
    setCategorySelection({
      ...categorySelection,
      [event.target.name]: event.target.checked,
    });
  };

  return (
    <Dialog open={openContentCategory}>
      <DialogContent>
        <DialogContentText>Assign Category</DialogContentText>
        <div>
          <FormControl component="fieldset" className={classes.formControl}>
            <FormGroup>
              {proCategories.items.length == 0 && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                  }}
                  onClick={() => {
                    handleDoneCategories(true);
                  }}
                >
                  <FormControlLabel
                    control={<Checkbox name="Add a Category" />}
                    label="Add a Category"
                  />
                </div>
              )}
              {proCategories.items.map(
                ({ id, proCategoryName, proCategoryImage }) => (
                  <div
                    key={id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-start",
                    }}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={categorySelection[id]}
                          onChange={handleChange}
                          name={id}
                        />
                      }
                      label={proCategoryName}
                    />
                    <img
                      src={proCategoryImage}
                      style={{ height: 18, width: 18 }}
                    />
                  </div>
                )
              )}
            </FormGroup>
          </FormControl>
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          onClick={() => {
            handleDoneCategories(false);
          }}
        >
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
};
