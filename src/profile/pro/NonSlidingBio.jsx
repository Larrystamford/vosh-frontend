import React, { useEffect, useState } from "react";
import "./ProEdit.css";

import { useDidMountEffect } from "../../customHooks/useDidMountEffect";
import axios from "../../axios";
import { useHistory } from "react-router";

import { SimpleBottomNotification } from "../../components/SimpleBottomNotification";

import clsx from "clsx";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import Input from "@material-ui/core/Input";
import FilledInput from "@material-ui/core/FilledInput";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import ArrowBackIosOutlinedIcon from "@material-ui/icons/ArrowBackIosOutlined";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
  },
  margin: {
    margin: theme.spacing(1),
  },
  withoutLabel: {
    marginTop: theme.spacing(1),
  },
  textField: {
    width: "95%",
  },
  multilineColor: {
    color: "black",
  },
}));

export const NonSlidingBio = () => {
  const history = useHistory();
  const classes = useStyles();

  const [caption, setCaption] = useState("");
  const [focused, setFocused] = useState(false);
  const [showNotif, setShowNotif] = useState("");

  useEffect(() => {
    const userId = localStorage.getItem("USER_ID");
    if (userId) {
      axios.get("/v1/users/getPro/" + userId).then((response) => {
        let data = response.data[0];
        if (data.profileBio) {
          setCaption(data.profileBio);
        }
      });
    }
  }, []);

  const handleSaveCaption = async () => {
    if (caption.length > 75) {
      alert("Maximum 75 Characters");
    } else {
      await axios.put("/v1/users/update/" + localStorage.getItem("USER_ID"), {
        profileBio: caption,
      });
      setShowNotif("Saved");
      setTimeout(() => {
        setShowNotif("");
      }, 3000);
    }
  };

  const onSubmitUserName = async () => {};

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      // onSubmitSignUp();
    }
  };

  // MANUAL SIGN UP
  return (
    <div className="SlidingEdit_Body">
      <div className="SlidingEdit_Header">
        <ArrowBackIosOutlinedIcon
          onClick={() => history.goBack()}
          style={{ paddingLeft: 14 }}
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
          Profile Bio
        </span>
      </div>
      <TextField
        id="outlined-start-adornment"
        multiline
        rows={7}
        className={clsx(classes.margin, classes.textField)}
        variant="outlined"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{ backgroundColor: "white" }}
      />
      <div className="bio_chars_and_save">
        <p>{caption.length} / 75</p>
        <p style={{ color: "rgb(25,118,210)" }} onClick={handleSaveCaption}>
          Save
        </p>
      </div>

      {showNotif && <SimpleBottomNotification message={showNotif} />}
    </div>
  );
};
