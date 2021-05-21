import React from "react";
import axios from "../axios";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import ContactSupportIcon from "@material-ui/icons/ContactSupport";
import InfoIcon from "@material-ui/icons/Info";
import VerifiedUserOutlinedIcon from '@material-ui/icons/VerifiedUserOutlined';

import { useHistory } from "react-router";

const useStyles = makeStyles({
  list: {
    width: 153,
  },
  fullList: {
    width: "auto",
  },
});

export const Settings = ({ openSettings, toggleDrawer }) => {
  const history = useHistory();
  const classes = useStyles();

  const sendCustomerFeedback = async () => {
    await axios.post("/v1/email/customerFeedback", {
      userId: localStorage.getItem("USER_ID"),
    });

    alert("An email has been sent to you.");
  };

  const list = (anchor) => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === "top" || anchor === "bottom",
      })}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        <ListItem
          button
          key={"about us"}
          onClick={() =>
            history.push({
              pathname: "/about-us",
            })
          }
        >
          <ListItemIcon>
            <InfoIcon />
          </ListItemIcon>
          <ListItemText primary={"about us"} />
        </ListItem>

        <ListItem
        button
        key={"verified"}
        onClick={() =>
          history.push({
            pathname: "/getVerified",
          })
        }
      >
        <ListItemIcon>
          <VerifiedUserOutlinedIcon />
        </ListItemIcon>
        <ListItemText primary={"verified"} />
      </ListItem>

        <ListItem
          button
          key={"feedback"}
          onClick={() => sendCustomerFeedback()}
        >
          <ListItemIcon>
            <ContactSupportIcon />
          </ListItemIcon>
          <ListItemText primary={"feedback"} />
        </ListItem>
        <ListItem
          button
          key={"logout"}
          onClick={() =>
            history.push({
              pathname: "/logout",
            })
          }
        >
          <ListItemIcon>
            <ExitToAppIcon />
          </ListItemIcon>
          <ListItemText primary={"logout"} />
        </ListItem>
      </List>
      {/* <Divider /> */}
    </div>
  );

  return (
    <div>
      <React.Fragment key={"right"}>
        <Drawer
          anchor={"right"}
          open={openSettings}
          onClose={toggleDrawer(false)}
        >
          {list("right")}
        </Drawer>
      </React.Fragment>
    </div>
  );
};
