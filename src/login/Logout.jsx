import React from "react";
import "./SetUp.css";
import { PageView } from "../components/tracking/Tracker";

export const Logout = () => {
  localStorage.removeItem("JWT_TOKEN");
  localStorage.removeItem("PICTURE");
  localStorage.removeItem("USER_ID");
  localStorage.removeItem("USER_NAME");
  localStorage.removeItem("LOGIN_VIDEO_ID");
  localStorage.removeItem("BEFORE_LOGIN_VIDEO_IDS");

  sessionStorage.setItem("profileRefreshed", "false");
  sessionStorage.setItem("refreshed", "false");

  if (!window.location.hash) {
    PageView();
    window.location = window.location + "#loaded";
    window.location.reload();
  }

  return (
    <div className="setUpMain">
      <div className="flex_align_logout">
        <p>logged out sucessfully</p>
        <a href="/">home</a>
      </div>
    </div>
  );
};
