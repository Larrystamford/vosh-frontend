import React, { useEffect, useState } from "react";
import "./Landing.css";

export const ProfileDesktop = ({ currentLocation }) => {
  return (
    <div className="computer_landing_body">
      <iframe
        src={currentLocation + "?iframe=true"}
        height="100%"
        width="640"
        title="Iframe Example"
        frameBorder="0"
      ></iframe>

      <img
        id="backgroundImage"
        src="https://media2locoloco-dev.s3.ap-southeast-1.amazonaws.com/1622561908009_vosh-template-bg12.jpg"
      />
    </div>
  );
};
