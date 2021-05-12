import React from "react";
import "./SetUp.css";

import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import { useEffect } from "react";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

export const AddressForm = ({
  number,
  setNumber,
  address,
  setAddress,
  country,
  setCountry,
  city,
  setCity,
  postalCode,
  setPostalCode,
  onSubmitAddress,
}) => {
  const classes = useStyles();

  return (
    <div className="SlidingSetUpMain">
      <div className="formWrapper">
        <img
          src="https://dciv99su0d7r5.cloudfront.net/ShopLocoLoco+Small+Symbol+Orange.png"
          alt="loco logo"
          style={{ height: 60 }}
        />
        <p>Enter Your Address</p>

        <TextField
          label="Full Address"
          InputLabelProps={{
            shrink: true,
          }}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          style={{ width: "17rem" }}
        />

        {/* <FormControl className={classes.formControl}>
          <InputLabel
            shrink
            id="demo-simple-select-placeholder-label-label"
            style={{ width: "15rem" }}
          >
            Country
          </InputLabel>
          <Select
            labelId="demo-simple-select-helper-label"
            id="demo-simple-select-helper"
            value={country}
            style={{ width: "15rem" }}
            onChange={(e) => setCountry(e.target.value)}
          >
            <MenuItem value={"United States"}>United States</MenuItem>
          </Select>
        </FormControl> */}

        <TextField
          label="City / State"
          InputLabelProps={{
            shrink: true,
          }}
          value={city}
          onChange={(e) => setCity(e.target.value)}
          style={{ width: "17rem" }}
        />

        <TextField
          label="Country"
          InputLabelProps={{
            shrink: true,
          }}
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          style={{ width: "17rem" }}
        />

        <TextField
          label="Zip / Postal Code"
          InputLabelProps={{
            shrink: true,
          }}
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
          style={{ width: "17rem" }}
        />

        <TextField
          label="Phone Number"
          type="number"
          InputLabelProps={{
            shrink: true,
          }}
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          style={{ width: "17rem" }}
        />
        <Button variant="outlined" color="primary" onClick={onSubmitAddress}>
          Save
        </Button>
      </div>
    </div>
  );
};
