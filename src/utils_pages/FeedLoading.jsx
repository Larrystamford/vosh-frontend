import React, { useState, useEffect } from "react";
import "./Landing.css";

import CircularProgress from "@material-ui/core/CircularProgress";

export const FeedLoading = () => {
  return (
    <div className="landing_body">
      <CircularProgress color="secondary" />
    </div>
  );
};
