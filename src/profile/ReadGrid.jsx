import React, { useEffect } from "react";
import { useDidMountEffect } from "../customHooks/useDidMountEffect";

import { ImageLoad } from "../components/ImageLoad";

import "./VideoGrid.css";
import { useHistory } from "react-router";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const ReadGrid = ({ allProductLinks, size, proTheme }) => {
  const history = useHistory();

  // useEffect(() => {
  //   setShowVideos(videos.slice(0, 9));
  // }, [selectedCategoryId]);

  // const getHistoryFeed = (scrolledBottomCount) => {
  //   setShowVideos((prevState) => [
  //     ...prevState,
  //     ...videos.slice(scrolledBottomCount * 9, scrolledBottomCount * 9 + 9),
  //   ]);
  // };

  // useDidMountEffect(() => {
  //   if (scrolledBottomCount != 0) {
  //     getHistoryFeed(scrolledBottomCount);
  //   }
  // }, [scrolledBottomCount]);

  // if (videos.length === 0) {
  //   return (
  //     <div className="Purchases_NoInfo">
  //       <div
  //         className="Video_Grid_redirect_button"
  //         onClick={() => {
  //           history.push("/ContentTagging");
  //         }}
  //       >
  //         <p>Import & Tag Your TikToks</p>
  //       </div>
  //     </div>
  //   );
  // }

  const [header, setHeader] = React.useState("");
  const [reading, setReading] = React.useState("");

  const [open, setOpen] = React.useState(false);
  const handleClickOpen = (name, desc) => {
    setHeader(name);
    setReading(desc);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const addElipsis = (name, desc, square) => {
    if (square) {
      if (desc && desc.length > 150) {
        return (
          <p className="profile_bottom_container_read_box_desc">
            {desc.slice(0, 150) + "... "}
            <span
              style={{ fontSize: "12px", fontWeight: "bold" }}
              onClick={(e) => {
                e.stopPropagation();
                handleClickOpen(name, desc);
              }}
            >
              read more
            </span>
          </p>
        );
      }
    } else {
      if (desc && desc.length > 100) {
        return (
          <p className="profile_bottom_container_read_box_desc">
            {desc.slice(0, 100) + "... "}
            <span
              style={{ fontSize: "12px", fontWeight: "bold" }}
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                handleClickOpen(name, desc);
              }}
            >
              read more
            </span>
          </p>
        );
      }
    }

    return <p className="profile_bottom_container_read_box_desc">{desc}</p>;
  };

  return (
    <div className="profile_bottom_container" style={{ marginTop: "2px" }}>
      {allProductLinks.map((eachProductLink, i) => {
        if (eachProductLink.itemImage) {
          if (i % 2 === 1) {
            return (
              <div
                className="profile_bottom_container_read_row"
                style={{ height: size.width / 2 }}
                onClick={() => {
                  window.open(eachProductLink.itemLink, "_blank");
                }}
              >
                <ImageLoad
                  src={eachProductLink.itemImage}
                  style={{ height: size.width / 2, width: size.width / 2 }}
                />
                <div
                  className="profile_bottom_container_read_box"
                  style={{
                    backgroundColor: proTheme.linkBoxColor,
                    color: proTheme.linkWordsColor,
                    opacity: 0.92,
                  }}
                >
                  <h4 className="profile_bottom_container_read_box_title">
                    {eachProductLink.itemLinkName}
                  </h4>
                  {addElipsis(
                    eachProductLink.itemLinkName,
                    eachProductLink.itemLinkDesc,
                    true
                  )}
                </div>
              </div>
            );
          } else {
            return (
              <div
                className="profile_bottom_container_read_row"
                style={{ height: size.width / 2 }}
                onClick={() => {
                  window.open(eachProductLink.itemLink, "_blank");
                }}
              >
                <div
                  className="profile_bottom_container_read_box"
                  style={{
                    backgroundColor: proTheme.linkBoxColor,
                    color: proTheme.linkWordsColor,
                    opacity: 0.92,
                  }}
                >
                  <h4 className="profile_bottom_container_read_box_title">
                    {eachProductLink.itemLinkName}
                  </h4>
                  {addElipsis(
                    eachProductLink.itemLinkName,
                    eachProductLink.itemLinkDesc,
                    true
                  )}
                </div>
                <ImageLoad
                  src={eachProductLink.itemImage}
                  style={{ height: size.width / 2, width: size.width / 2 }}
                />
              </div>
            );
          }
        } else {
          return (
            <div
              className="profile_bottom_container_read_row"
              style={{
                height: size.width / 4,
                borderBottom: `2px solid ${proTheme.linkBoxColor}`,
              }}
              onClick={() => {
                console.log(eachProductLink);
                window.open(eachProductLink.itemLink, "_blank");
              }}
            >
              <div
                className="profile_bottom_container_no_image"
                style={{
                  backgroundColor: proTheme.linkBoxColor,
                  color: proTheme.linkWordsColor,
                  opacity: 0.92,
                }}
              >
                <h4 className="profile_bottom_container_read_box_title">
                  {eachProductLink.itemLinkName}
                </h4>
                {addElipsis(
                  eachProductLink.itemLinkName,
                  eachProductLink.itemLinkDesc,
                  false
                )}
              </div>
            </div>
          );
        }
      })}

      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
        style={{ zIndex: 30000 }}
      >
        <DialogTitle id="alert-dialog-slide-title">{header}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {reading}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <div
        className="pro_profile_icon_and_name profile_bottom_container_logo"
        onClick={() => {
          history.push("/getStarted");
        }}
      >
        <p style={{ color: "white", fontSize: "14px" }}>Vosh</p>
        <img
          src="https://dciv99su0d7r5.cloudfront.net/ShopLocoLoco+Small+Symbol+White.png"
          style={{ height: "16px" }}
        />
      </div>
    </div>
  );
};