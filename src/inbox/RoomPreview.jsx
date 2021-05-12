import React, { useState, useEffect } from "react";
import "./RoomPreview.css";

export const RoomPreview = ({ sender, message }) => {
  return (
    <div className="roomPreview">
      <div className="roomPreview_info">
        <div className="roomPreview_picture">
          <img
            src="https://dciv99su0d7r5.cloudfront.net/icon-192x192.png"
            className="roomPreview_picture_image"
            alt="temp avatar"
          />
        </div>
        <h3> {sender} </h3>
        <p> {message} </p>
      </div>
    </div>
  );
};
