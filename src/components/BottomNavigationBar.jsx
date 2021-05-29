import React, { useEffect } from "react";
import "./BottomNavigationBar.css";

import { Link } from "react-router-dom";
import { useHistory } from "react-router";
import { useGlobalState } from "../GlobalStates";
import { useWindowSize } from "../customHooks/useWindowSize";
import axios from "../axios";

import { HiOutlineHome, HiOutlineMail } from "react-icons/hi";

import Badge from "@material-ui/core/Badge";
import { withStyles } from "@material-ui/core/styles";

// import BottomNavigation from "@material-ui/core/BottomNavigation";
// import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
// import HomeOutlinedIcon from "@material-ui/icons/HomeOutlined";
// import SearchOutlinedIcon from "@material-ui/icons/SearchOutlined";
import PersonOutlineOutlinedIcon from "@material-ui/icons/PersonOutlineOutlined";
// import MailOutlineIcon from "@material-ui/icons/MailOutline";
// import AddBoxIcon from "@material-ui/icons/AddBox";

const StyledBadge = withStyles((theme) => ({
  badge: {
    right: -3,
    top: 3,
    height: "15px",
    minWidth: "15px",
    fontSize: "0.6rem",
  },
}))(Badge);

export const BottomNavigationBar = ({ match }) => {
  const history = useHistory();
  const size = useWindowSize();

  let hide = false;
  const url = match.url;

  // profile exception
  if (url === "/profile") {
    let currentURL = window.location.href.split("/");
    currentURL = currentURL[currentURL.length - 1];
    if (currentURL != "profile") {
      hide = true;
    }
  }

  // const [value, setValue] = useState(0);
  const getIconColor = (url) => {
    if (url === "/" || url.slice(0, 4) === "/vid") {
      return "white";
    } else {
      return "black";
    }
  };

  const getBackgroundColor = (url) => {
    if (url === "/" || url.slice(0, 4) === "/vid") {
      return "transparent";
    } else {
      return "white";
    }
  };

  const getBarHeight = (size) => {
    if (size.height / size.width > 2) {
      return "3.5rem";
    } else {
      return "2.6rem";
    }
  };

  const [rerender, setRerender] = useGlobalState("rerender");
  const handleRerender = () => {
    if (url === "/") {
      setRerender((prev) => !prev);
    }
  };

  const [newNotifcationsNum, setNewNotificationsNum] =
    useGlobalState("newNotifcationsNum");
  useEffect(() => {
    async function getLastNotificationsNum() {
      // number of new notifications
      let lastNotificationId = localStorage.getItem("LAST_NOTIFICATION_ID");
      if (!lastNotificationId) {
        lastNotificationId = "";
      }
      let userId = localStorage.getItem("USER_ID");
      if (!userId) {
        userId = "";
      }

      if (!userId) {
        setNewNotificationsNum(1);
      } else {
        const newNotifcations = await axios.get(
          `/v1/notifications/newNotificationsCount?userId=${userId}&lastNotificationId=${lastNotificationId}`
        );
        setNewNotificationsNum(newNotifcations.data.count);
      }
    }
    getLastNotificationsNum();
  }, []);

  // const hiddenFileInput = useRef(null);
  // const onChangeHandler = (event) => {
  //   const file = event.target.files[0];

  //   history.push({
  //     pathname: "/upload",
  //     state: { file: file },
  //   });
  // };

  // const handleClick = async (event) => {
  //   hiddenFileInput.current.click();
  // };

  return (
    <div
      className="Bottom_NavBar"
      style={
        hide
          ? {
              backgroundColor: getBackgroundColor(url),
              display: "None",
              height: getBarHeight(size),
            }
          : {
              backgroundColor: getBackgroundColor(url),
              height: getBarHeight(size),
            }
      }
    >
      <Link
        to={{ pathname: "/", state: { status: "within-app" } }}
        style={{ textDecoration: "none" }}
        className="noSelect"
      >
        <HiOutlineHome
          size={22}
          style={{ color: getIconColor(url) }}
          onClick={handleRerender}
        />
      </Link>

      {/* <Link to="/discover" style={{ textDecoration: "none" }}>
        <div className="Bottom_Navbar_IconDivWrapper">
          <SearchOutlinedIcon
            fontSize="default"
            style={{ color: getIconColor(url) }}
          />
        </div>
      </Link> */}

      {/* <div className="Bottom_Navbar_IconDivWrapper">
        <AddBoxIcon
          fontSize="default"
          style={{ color: getIconColor(url) }}
          onClick={handleClick}
        />
      </div>
      <div style={{ display: "none" }}>
        <input
          ref={hiddenFileInput}
          type="file"
          name="file"
          onChange={onChangeHandler}
        />
      </div> */}

      <Link
        className="noSelect"
        to="/inbox"
        style={{ textDecoration: "none", marginBottom: "8px" }}
      >
        <StyledBadge badgeContent={newNotifcationsNum} color="secondary">
          <HiOutlineMail size={22} style={{ color: getIconColor(url) }} />
        </StyledBadge>
      </Link>
      <Link
        className="noSelect"
        to="/profile"
        style={{ textDecoration: "none" }}
      >
        <PersonOutlineOutlinedIcon
          fontSize="default"
          style={{ color: getIconColor(url) }}
        />
      </Link>
    </div>
  );
};
