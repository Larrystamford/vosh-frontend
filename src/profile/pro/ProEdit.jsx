import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import React, { useState, useEffect } from "react";
import "./ProEdit.css";
import { useGlobalState } from "../../GlobalStates";
import { useHistory } from "react-router";
import { useDidMountEffect } from "../../customHooks/useDidMountEffect";

import { SlidingSocials } from "./SlidingSocials";
import { SlidingLinks } from "./SlidingLinks";
import { SlidingCategories } from "./SlidingCategories";

import { SimpleBottomNotification } from "../../components/SimpleBottomNotification";

import TextField from "@material-ui/core/TextField";
import ClearOutlinedIcon from "@material-ui/icons/ClearOutlined";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import ArrowBackIosOutlinedIcon from "@material-ui/icons/ArrowBackIosOutlined";
import ArrowForwardIosOutlinedIcon from "@material-ui/icons/ArrowForwardIosOutlined";
import LinkOutlinedIcon from "@material-ui/icons/LinkOutlined";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import CategoryOutlinedIcon from "@material-ui/icons/CategoryOutlined";
import LoyaltyOutlinedIcon from "@material-ui/icons/LoyaltyOutlined";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

import axios from "../../axios";
import { Exception } from "../../components/tracking/Tracker";

export const ProEdit = () => {
  const history = useHistory();
  const [safeToEdit, setSafeToEdit] = useState(false);

  const [socialItems, setSocialItems] = useState({ items: [] });
  const [proLinks, setProLinks] = useState({ items: [] });
  const [proCategories, setProCategories] = useState({ items: [] });

  const [showNotif, setShowNotif] = useState("");

  useEffect(() => {
    const userId = localStorage.getItem("USER_ID");
    if (userId) {
      axios.get("/v1/users/get/" + userId).then((response) => {
        let data = response.data[0];
        setSocialItems({ items: data.socialAccounts });
        setProLinks({ items: data.proLinks });
        setProCategories({ items: data.proCategories });

        if (response.status == 200) {
          setSafeToEdit(true);
        }
      });
    }
  }, []);

  // edit socials
  const [openSocials, setOpenSocials] = useState(false);
  const handleSocialsOpen = () => {
    if (safeToEdit) {
      setOpenSocials(true);
      window.history.pushState(
        {
          socials: "socials",
        },
        "",
        ""
      );
    }
  };
  const handleSocialsClose = async (updatedSocialAccounts) => {
    if (safeToEdit) {
      const res = await axios.put(
        "/v1/users/update/" + localStorage.getItem("USER_ID"),
        {
          socialAccounts: updatedSocialAccounts,
        }
      );

      if (res.status == 201) {
        setShowNotif("Saved");
        setTimeout(() => {
          setShowNotif("");
        }, 3000);
      } else {
        setShowNotif("Error");
      }

      setOpenSocials(false);
      window.history.back();
    }
  };
  useDidMountEffect(() => {
    const handleSocialsPop = () => {
      setOpenSocials(false);
    };

    if (openSocials) {
      window.addEventListener("popstate", handleSocialsPop);
    } else {
      window.removeEventListener("popstate", handleSocialsPop);
    }
  }, [openSocials]);

  // edit links
  const [openLinks, setOpenLinks] = useState(false);
  const handleLinksOpen = () => {
    if (safeToEdit) {
      setOpenLinks(true);
      window.history.pushState(
        {
          links: "links",
        },
        "",
        ""
      );
    }
  };
  const handleLinksClose = async (updatedLinks) => {
    if (safeToEdit) {
      const res = await axios.put(
        "/v1/users/update/" + localStorage.getItem("USER_ID"),
        {
          proLinks: updatedLinks,
        }
      );

      if (res.status == 201) {
        setShowNotif("Saved");
        setTimeout(() => {
          setShowNotif("");
        }, 3000);
      } else {
        setShowNotif("Error");
      }

      setOpenLinks(false);
      window.history.back();
    }
  };
  useDidMountEffect(() => {
    const handleLinksPop = () => {
      setOpenLinks(false);
    };

    if (openLinks) {
      window.addEventListener("popstate", handleLinksPop);
    } else {
      window.removeEventListener("popstate", handleLinksPop);
    }
  }, [openLinks]);

  // edit categories
  const [openCategories, setOpenCategories] = useState(false);
  const handleCategoriesOpen = () => {
    if (safeToEdit) {
      setOpenCategories(true);
      window.history.pushState(
        {
          categories: "categories",
        },
        "",
        ""
      );
    }
  };
  const handleCategoriesClose = async (updatedCategories) => {
    if (safeToEdit) {
      const res = await axios.put(
        "/v1/users/update/" + localStorage.getItem("USER_ID"),
        {
          proCategories: updatedCategories,
        }
      );

      if (res.status == 201) {
        setShowNotif("Saved");
        setTimeout(() => {
          setShowNotif("");
        }, 3000);
      } else {
        setShowNotif("Error");
      }

      setOpenCategories(false);
      window.history.back();
    }
  };
  useDidMountEffect(() => {
    const handleCategoriesPop = () => {
      setOpenCategories(false);
    };

    if (openCategories) {
      window.addEventListener("popstate", handleCategoriesPop);
    } else {
      window.removeEventListener("popstate", handleCategoriesPop);
    }
  }, [openCategories]);

  return (
    <div className="SlidingEdit_Body">
      <div className="SlidingEdit_Header">
        <ArrowBackIosOutlinedIcon
          onClick={() => {
            history.goBack();
          }}
          style={{ paddingLeft: 10 }}
        />
        <span
          style={{
            fontSize: 14,
            position: "absolute",
            fontWeight: 700,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          Edit Profile
        </span>
      </div>

      <div className="SlidingEdit_Pannels_Wrapper">
        <div
          className="SlidingEdit_Pannel"
          onClick={() => {
            history.push("/changeUsername");
          }}
        >
          <div className="SlidingEdit_TypeLeft">
            <AccountCircleIcon style={{ fontSize: 20 }} />
          </div>
          <div className="SlidingEdit_TypeAndIcon">
            <p>Username</p>
            <ArrowForwardIosOutlinedIcon
              style={{ fontSize: 12, marginLeft: "1rem" }}
            />
          </div>
        </div>
        <div className="SlidingEdit_Pannel" onClick={handleSocialsOpen}>
          <div className="SlidingEdit_TypeLeft">
            <img
              src="https://media2locoloco-us.s3.amazonaws.com/instagram.png"
              style={{ height: 15, margin: 3 }}
            />
          </div>
          <div className="SlidingEdit_TypeAndIcon">
            <p>Social Accounts</p>
            <ArrowForwardIosOutlinedIcon
              style={{ fontSize: 12, marginLeft: "1rem" }}
            />
          </div>
        </div>
        <div className="SlidingEdit_Pannel" onClick={handleLinksOpen}>
          <div className="SlidingEdit_TypeLeft">
            <LinkOutlinedIcon style={{ fontSize: 20 }} />
          </div>
          <div className="SlidingEdit_TypeAndIcon">
            <p>Links</p>
            <ArrowForwardIosOutlinedIcon
              style={{ fontSize: 12, marginLeft: "1rem" }}
            />
          </div>
        </div>
        <div className="SlidingEdit_Pannel" onClick={handleCategoriesOpen}>
          <div className="SlidingEdit_TypeLeft">
            <CategoryOutlinedIcon style={{ fontSize: 20 }} />
          </div>
          <div className="SlidingEdit_TypeAndIcon">
            <p>Categories</p>
            <ArrowForwardIosOutlinedIcon
              style={{ fontSize: 12, marginLeft: "1rem" }}
            />
          </div>
        </div>
        <div
          className="SlidingEdit_Pannel"
          onClick={() => {
            history.push("/contentTagging");
          }}
        >
          <div className="SlidingEdit_TypeLeft">
            <LoyaltyOutlinedIcon style={{ fontSize: 20 }} />
          </div>
          <div className="SlidingEdit_TypeAndIcon">
            <p>Content Tagging</p>
            <ArrowForwardIosOutlinedIcon
              style={{ fontSize: 12, marginLeft: "1rem" }}
            />
          </div>
        </div>

        <div
          className="SlidingEdit_Pannel"
          onClick={() =>
            history.push({
              pathname: "/logout",
            })
          }
        >
          <div className="SlidingEdit_TypeLeft">
            <ExitToAppIcon style={{ fontSize: 20 }} />
          </div>
          <div className="SlidingEdit_TypeAndIcon">
            <p>Log Out</p>
            <ArrowForwardIosOutlinedIcon
              style={{ fontSize: 12, marginLeft: "1rem" }}
            />
          </div>
        </div>
      </div>

      <SlidingSocials
        openSocials={openSocials}
        handleSocialsClose={handleSocialsClose}
        socialItems={socialItems}
        setSocialItems={setSocialItems}
      />

      <SlidingLinks
        openLinks={openLinks}
        handleLinksClose={handleLinksClose}
        proLinks={proLinks}
        setProLinks={setProLinks}
      />

      <SlidingCategories
        openCategories={openCategories}
        handleCategoriesClose={handleCategoriesClose}
        proCategories={proCategories}
        setProCategories={setProCategories}
      />

      {showNotif && <SimpleBottomNotification message={showNotif} />}
    </div>
  );
};
