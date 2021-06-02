import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";

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

export const LinkPrevious = ({
  openLinkPrevious,
  setOpenLinkPrevious,
  previousLinks,
  linksState,
  setLinksState,
}) => {
  const size = useWindowSize();
  const classes = useStyles();

  // const handleLinkEditSave = () => {
  // if (editingIndex > -1) {
  //   let prevItems = linksState["items"];
  //   prevItems[editingIndex] = {
  //     id: inputValues.itemLink + new Date().getTime(),
  //     itemLink: inputValues.itemLink,
  //     itemLinkName: inputValues.itemLinkName,
  //   };
  //   setlinksState({ items: prevItems });
  // } else {
  // setlinksState((prevState) => ({
  //   items: [
  //     ...prevState["items"],
  //     {
  //       id: inputValues.itemLink + new Date().getTime(),
  //       itemLink: inputValues.itemLink,
  //       itemLinkName: inputValues.itemLinkName,
  //     },
  //   ],
  // }));
  // }
  // setOpenLinkEdit(false);
  // };

  const handleSelectedLink = (
    id,
    itemId,
    itemLink,
    itemLinkName,
    itemLinkDesc,
    itemImage
  ) => {
    setLinksState((prevState) => ({
      items: [
        {
          id: itemLink + new Date().getTime(),
          itemId: itemId,
          itemLink: itemLink,
          itemLinkName: itemLinkName,
          itemLinkDesc: itemLinkDesc,
          itemImage: itemImage,
        },
        ...prevState["items"],
      ],
    }));
  };

  return (
    <Dialog open={openLinkPrevious}>
      <DialogContent>
        <DialogContentText>Select Existing Products</DialogContentText>
        {previousLinks
          .filter(
            (v, i, a) =>
              a.findIndex((t) => t.itemLinkName === v.itemLinkName) === i
          )
          .map(
            ({
              id,
              itemId,
              itemLink,
              itemLinkName,
              itemLinkDesc,
              itemImage,
            }) => (
              <div
                className="Link_Previous_Content_Box"
                onClick={() =>
                  handleSelectedLink(
                    id,
                    itemId,
                    itemLink,
                    itemLinkName,
                    itemLinkDesc,
                    itemImage
                  )
                }
              >
                {itemImage ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      minWidth: "95%",
                    }}
                  >
                    <img
                      className="SlidingEdit_TypeLeft_Image_Placeholder"
                      src={itemImage}
                      style={{ margin: "5px 20px 5px 10px" }}
                    />

                    <p>{itemLinkName}</p>
                  </div>
                ) : (
                  <p>{itemLinkName}</p>
                )}
              </div>
            )
          )}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setOpenLinkPrevious(false);
          }}
          color="primary"
        >
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
};
