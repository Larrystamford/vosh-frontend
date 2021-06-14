import React, { useState, useEffect, useCallback } from "react";
import "./ProEdit.css";
import { useGlobalState } from "../../GlobalStates";
import { useHistory } from "react-router";
import { useDidMountEffect } from "../../customHooks/useDidMountEffect";

import { SlidingSocials } from "./SlidingSocials";
import { SlidingLinks } from "./SlidingLinks";
import { SlidingCategories } from "./SlidingCategories";

import { SimpleBottomNotification } from "../../components/SimpleBottomNotification";

import ArrowBackIosOutlinedIcon from "@material-ui/icons/ArrowBackIosOutlined";
import ArrowForwardIosOutlinedIcon from "@material-ui/icons/ArrowForwardIosOutlined";
import LinkOutlinedIcon from "@material-ui/icons/LinkOutlined";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import CategoryOutlinedIcon from "@material-ui/icons/CategoryOutlined";
import LoyaltyOutlinedIcon from "@material-ui/icons/LoyaltyOutlined";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import ImageOutlinedIcon from "@material-ui/icons/ImageOutlined";
import CreateOutlinedIcon from "@material-ui/icons/CreateOutlined";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import ReplyOutlinedIcon from "@material-ui/icons/ReplyOutlined";
import ShopIcon from "@material-ui/icons/Shop";

import { CopyToClipboard } from "react-copy-to-clipboard";
import { Snackbar } from "@material-ui/core";

import axios from "../../axios";

export const ProEdit = () => {
  const history = useHistory();
  const [safeToEdit, setSafeToEdit] = useState(false);

  const [socialItems, setSocialItems] = useState({ items: [] });
  const [proLinks, setProLinks] = useState({ items: [] });
  const [proCategories, setProCategories] = useGlobalState("proCategories");
  const [profileBio, setProfileBio] = useState("");

  const [showNotif, setShowNotif] = useState("");

  useEffect(() => {
    const userId = localStorage.getItem("USER_ID");
    if (userId) {
      axios.get("/v1/users/getPro/" + userId).then((response) => {
        let data = response.data[0];
        setSocialItems({ items: data.socialAccounts });
        setProLinks({ items: data.proLinks });
        setProCategories({ items: data.proCategories });
        if (data.profileBio) {
          setProfileBio(data.profileBio);
        }

        if (response.status === 200) {
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
  const handleSocialsClose = async () => {
    if (safeToEdit) {
      const res = await axios.put(
        "/v1/users/update/" + localStorage.getItem("USER_ID"),
        {
          socialAccounts: socialItems.items,
        }
      );

      if (res.status === 201) {
        setShowNotif("Saved");
        setTimeout(() => {
          setShowNotif("");
        }, 3000);
      } else {
        setShowNotif("Error");
      }

      setOpenSocials(false);
    }
  };
  const handleSocialsPop = useCallback(() => {
    setOpenSocials(false);
  }, []);
  useDidMountEffect(() => {
    if (openSocials) {
      window.addEventListener("popstate", handleSocialsPop);
    } else {
      handleSocialsClose();
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
  const handleLinksClose = async () => {
    if (safeToEdit) {
      const res = await axios.put(
        "/v1/users/update/" + localStorage.getItem("USER_ID"),
        {
          proLinks: proLinks.items,
        }
      );

      if (res.status === 201) {
        setShowNotif("Saved");
        setTimeout(() => {
          setShowNotif("");
        }, 3000);
      } else {
        setShowNotif("Error");
      }

      setOpenLinks(false);
    }
  };
  const handleLinksPop = useCallback(() => {
    setOpenLinks(false);
  }, []);
  useDidMountEffect(() => {
    if (openLinks) {
      window.addEventListener("popstate", handleLinksPop);
    } else {
      handleLinksClose();
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
  const handleCategoriesClose = async () => {
    if (safeToEdit) {
      const res = await axios.put(
        "/v1/users/update/" + localStorage.getItem("USER_ID"),
        {
          proCategories: proCategories.items,
        }
      );

      if (res.status === 201) {
        setShowNotif("Saved");
        setTimeout(() => {
          setShowNotif("");
        }, 3000);
      } else {
        setShowNotif("Error");
      }

      setOpenCategories(false);
    }
  };
  const handleCategoriesPop = useCallback(() => {
    setOpenCategories(false);
  }, []);
  useDidMountEffect(() => {
    if (openCategories) {
      window.addEventListener("popstate", handleCategoriesPop);
    } else {
      handleCategoriesClose();
      window.removeEventListener("popstate", handleCategoriesPop);
    }
  }, [openCategories]);

  const [shareStatus, setShareStatus] = useState(false);
  const handleShareClicked = () => {
    setShareStatus(true);
    setTimeout(() => setShareStatus(false), 1300);
  };

  return (
    <div className="SlidingEdit_Body">
      <div className="SlidingEdit_Header">
        <ArrowBackIosOutlinedIcon
          onClick={() => {
            history.push("/profile");
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
        <CopyToClipboard
          text={"vosh.club/" + localStorage.getItem("USER_NAME")}
        >
          <div className="SlidingEdit_Pannel" onClick={handleShareClicked}>
            <div className="SlidingEdit_TypeLeft">
              <ReplyOutlinedIcon style={{ fontSize: 20 }} />
            </div>
            <div className="SlidingEdit_TypeAndIcon">
              <p>Get Sharable Link</p>
              <ArrowForwardIosOutlinedIcon
                style={{ fontSize: 12, marginLeft: "1rem" }}
              />
            </div>
          </div>
        </CopyToClipboard>
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
        <div
          className="SlidingEdit_Pannel"
          onClick={() => {
            history.push({
              pathname: "/profileBio",
            });
          }}
        >
          <div className="SlidingEdit_TypeLeft">
            <CreateOutlinedIcon style={{ fontSize: 20 }} />
          </div>
          <div className="SlidingEdit_TypeAndIcon">
            <p>Profile Bio</p>
            <ArrowForwardIosOutlinedIcon
              style={{ fontSize: 12, marginLeft: "1rem" }}
            />
          </div>
        </div>
        <div className="SlidingEdit_Pannel" onClick={handleSocialsOpen}>
          <div className="SlidingEdit_TypeLeft">
            <img
              src="https://dciv99su0d7r5.cloudfront.net/instagram.png"
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
            <p>General Links</p>
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
          onClick={() => {
            history.push("/theme");
          }}
        >
          <div className="SlidingEdit_TypeLeft">
            <ImageOutlinedIcon style={{ fontSize: 20 }} />
          </div>
          <div className="SlidingEdit_TypeAndIcon">
            <p>Themes</p>
            <ArrowForwardIosOutlinedIcon
              style={{ fontSize: 12, marginLeft: "1rem" }}
            />
          </div>
        </div>

        <div
          className="SlidingEdit_Pannel"
          onClick={() =>
            history.push({
              pathname: "/changePassword",
            })
          }
        >
          <div className="SlidingEdit_TypeLeft">
            <LockOutlinedIcon style={{ fontSize: 20 }} />
          </div>
          <div className="SlidingEdit_TypeAndIcon">
            <p>Change Password</p>
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
        <div className="SlidingEdit_Pannel" id="SlidingEdit_Pannel_empty"></div>
      </div>

      <SlidingSocials
        openSocials={openSocials}
        socialItems={socialItems}
        setSocialItems={setSocialItems}
      />

      <SlidingLinks
        openLinks={openLinks}
        proLinks={proLinks}
        setProLinks={setProLinks}
      />

      <SlidingCategories
        openCategories={openCategories}
        proCategories={proCategories}
        setProCategories={setProCategories}
      />

      <Snackbar
        open={shareStatus}
        message="Sharable link copied!"
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      />

      {showNotif && <SimpleBottomNotification message={showNotif} />}
    </div>
  );
};

// <div className="SlidingEdit_Pannel" onClick={handleCategoriesOpen}>
//   <div className="SlidingEdit_TypeLeft">
//     <CategoryOutlinedIcon style={{ fontSize: 20 }} />
//   </div>
//   <div className="SlidingEdit_TypeAndIcon">
//     <p>Categories</p>
//     <ArrowForwardIosOutlinedIcon style={{ fontSize: 12, marginLeft: "1rem" }} />
//   </div>
// </div>;
