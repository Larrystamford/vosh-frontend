import React, { useState } from "react";
import "./Landing.css";

import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";

import Button from "@material-ui/core/Button";

import axios from "../axios";

export const ComputerLanding = ({ currentLocation }) => {
  const [value, setValue] = useState("");

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handleGetStartedClick = async () => {
    await axios.post("/v1/email/influencerGetStarted", {
      userEmail: value,
    });
    alert("An e-mail has been sent to " + value);
  };
  return (
    <div className="computer_landing_body">
      <div className="computer_MessageBox">
        <p className="computer_WordHeader">VOSH</p>
        <p className="computer_WelcomeText">Join Vosh as a Creator</p>
        <p className="computer_NormalText">
          On Vosh, we let fans and creators support each other in sustainable
          ways. Whether it is shopping their recommendations or purchasing a
          shout out, every bit of ❤️ goes a long way.
        </p>

        <p className="computer_NormalText">
          We want creators to be able to focus on doing what they love, while we
          assist with everything else. If you’re ready to make your content
          work for you, reach out to us and get started with Vosh!
        </p>

        <TextField
          style={{ marginTop: "2rem", width: "19rem" }}
          id="get-started-email"
          label="creator@mail.com"
          variant="outlined"
          value={value}
          onChange={handleChange}
        />

        <Button
          style={{ marginTop: "1rem" }}
          variant="contained"
          color="secondary"
          onClick={handleGetStartedClick}
        >
          <span style={{ fontFamily: "sans-serif" }}>Get Started</span>
        </Button>
      </div>

      <div style={{ width: "5%" }}></div>

      <div className="computer_MessageBox">
        <iframe
          src={currentLocation}
          height="680"
          width="360"
          title="Iframe Example"
          style={{ borderRadius: 20, border: "5px solid lightgrey" }}
        ></iframe>
      </div>
    </div>
  );
};

{
  /* <div className="computer_QrWrapper">
  <img
    src="https://dciv99su0d7r5.cloudfront.net/vosh_qr.png"
    alt="qr_code"
    style={{ height: 150 }}
  />
  <p>Scan with mobile</p>
</div>; */
}
