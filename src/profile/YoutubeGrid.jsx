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

export const YoutubeGrid = ({
  youtubeVideos,
  size,
  proTheme,
  showYoutubeVideos,
  setShowYoutubeVideos,
  scrolledBottomCount,
}) => {
  const history = useHistory();

  useEffect(() => {
    setShowYoutubeVideos(youtubeVideos.slice(0, 3));
  }, []);

  const getHistoryFeed = (scrolledBottomCount) => {
    setShowYoutubeVideos((prevState) => [
      ...prevState,
      ...youtubeVideos.slice(
        scrolledBottomCount * 3,
        scrolledBottomCount * 3 + 3
      ),
    ]);
  };

  useDidMountEffect(() => {
    if (scrolledBottomCount != 0) {
      getHistoryFeed(scrolledBottomCount);
    }
  }, [scrolledBottomCount]);

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

  return (
    <div className="profile_bottom_container">
      {showYoutubeVideos.map((eachVideo) => (
        <div
          className="profile_bottom_container_youtube_row"
          style={{ height: size.width / 2 }}
        >
          <iframe
            width={size.width - 40}
            height={size.width / 2}
            allowfullscreen={true}
            src={"https://www.youtube.com/embed/" + eachVideo.videoId}
          ></iframe>
        </div>
      ))}

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
