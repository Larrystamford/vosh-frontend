import React, { useState, useEffect } from "react";
import "./Buy.css";

import { getCombinedName } from "../helpers/CommonFunctions";

import { useGlobalState } from "../GlobalStates";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import ExpandLessOutlinedIcon from "@material-ui/icons/ExpandLessOutlined";
import ExpandMoreOutlinedIcon from "@material-ui/icons/ExpandMoreOutlined";
import ClearOutlinedIcon from "@material-ui/icons/ClearOutlined";
import { ProductItemsSlider } from "./ProductItemsSlider";
import PhotoLibraryIcon from "@material-ui/icons/PhotoLibrary";

import Alert from "@material-ui/lab/Alert";

import Slide from "@material-ui/core/Slide";
import { makeStyles } from "@material-ui/core";

import { CardForm } from "./CardForm";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import axios from "../axios";

import { AddItem } from "../components/tracking/Tracker";

let stripeClient;
if (process.env.NODE_ENV === "development") {
  stripeClient =
    "pk_test_51Hw5YLHCkvAGzE08kwOjyFY6JC2KZt5XTy5oqnXlvcQtbDH7TjSkeL79w4xpgYqvcnqsXD4CQnTWGcddOptZy69A00vmzR2pdy";
} else {
  stripeClient =
    "pk_live_51Hw5YLHCkvAGzE08hGjW2yqz9ueztiNEnJWvrBZd5C318HZs0uGsPvQsGBp0f2rpiBoU4luSlFxOeVwhsxONBvFl00vuB6N9mz";
}

const stripePromise = loadStripe(stripeClient);

const useStyles = makeStyles((theme) => ({
  dialog: {
    position: "absolute",
    left: "50%",
    bottom: "-42%",
    margin: 0,
    transform: "translate(-50%, -50%)",
    width: "102vw",
    height: "83%",
    borderRadius: 10,
    zIndex: 5000,
  },
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const Buy = (props) => {
  const [userInfo, setUserInfo] = useGlobalState("hasUserInfo");

  const classes = useStyles();
  const [totalStocks, setTotalStocks] = useState(0);
  const [showPayments, setShowPayments] = useState(false);

  useEffect(() => {
    const defaultItem = props.items[0];
    let stocksTotal = 0;
    for (const eachItem of props.items) {
      stocksTotal += eachItem.stocks;
    }
    setTotalStocks(stocksTotal);
    handleSetType(
      defaultItem._id,
      defaultItem.name,
      defaultItem.price,
      defaultItem.stocks,
      defaultItem.image,
      0,
      defaultItem.name,
      defaultItem.size,
      defaultItem.color
    );

    const handleSliderPop = () => {
      props.setSliderGlobal(false);
      props.setOpenSlider(false);
    };

    window.addEventListener("popstate", handleSliderPop);

    // cleanup this component
    return () => {
      window.removeEventListener("popstate", handleSliderPop);
    };
  }, []);

  const [shoppingItem, setShoppingItem] = useState({
    name: "",
    size: "",
    color: "",
  });

  const [image, setImage] = useState("");
  const [selectedColor, setSelectedColor] = useState(-1);
  const handleSetColor = (newColor, newImage, id) => {
    setImage(newImage);
    setShoppingItem((prevState) => ({
      ...prevState,
      color: newColor,
    }));
    setSelectedColor(id);
  };

  const [name, setName] = useState("");
  const [color, setSize] = useState("");
  const [size, setColor] = useState("");

  const [itemId, setItemId] = useState("");
  const [price, setPrice] = useState(0);
  const [stocks, setStocks] = useState(0);
  const [selectedType, setSelectedType] = useState(-1);

  const handleSetType = (
    newItemId,
    newType,
    newPrice,
    newStocks,
    newImage,
    id,
    newName,
    newSize,
    newColor
  ) => {
    setName(newName);
    setSize(newSize);
    setColor(newColor);

    setItemId(newItemId);
    setImage(newImage);
    setPrice(newPrice);
    setStocks(newStocks);

    // type is actually name. not sure what this is being used for
    setShoppingItem((prevState) => ({
      ...prevState,
      type: newType,
    }));
    setSelectedType(id);
  };

  const [quantity, setQuantity] = useState(1);
  const handleIncreaseQuantity = () => {
    setQuantity(quantity + 1);
  };
  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const [buyingStatus, setBuyingStatus] = useState("");
  const handleBoughtStatus = () => {
    setBuyingStatus("Congratulations your purchase was successful!");
    setTimeout(() => setBuyingStatus(""), 4000);
  };

  const [errorStatus, setErrorStatus] = useState("");
  const handleErrorStatus = (errorMsg, errorTimeOut) => {
    setErrorStatus(errorMsg);
    setTimeout(() => setErrorStatus(""), errorTimeOut);
  };

  const handleShowButton = () => {
    if (userInfo == false) {
      return (
        <div>
          <p
            style={{
              fontSize: "14px",
              fontWeight: "bold",
              color: "#222222",
              textDecoration: "underline",
            }}
            onClick={() => props.handleSetUpOpen()}
          >
            log in to checkout
          </p>
        </div>
      );
    } else if (userInfo.address == "" || userInfo.address == undefined) {
      return (
        <div>
          <p
            style={{
              fontStyle: "italic",
              fontSize: "14px",
              fontWeight: "bold",
              color: "rgba(51, 46, 46, 0.863)",
              textDecoration: "underline",
            }}
            onClick={() => props.handleSetUpOpen()}
          >
            confirm delivery address
          </p>
        </div>
      );
    } else {
      return (
        <Button
          variant="contained"
          style={{
            backgroundColor: "#222222",
            color: "white",
            fontWeight: "bold",
            height: "40px",
            width: "80%",
          }}
          onClick={() => {
            setShowPayments(true);
            AddItem(
              itemId,
              getCombinedName(color, name, size),
              price,
              props.selectCategory,
              quantity
            );
          }}
        >
          CHECKOUT
        </Button>
      );
    }
  };

  const handleSliderOpen = () => {
    props.setSliderGlobal(true);
    props.setOpenSlider(true);
    window.history.pushState(
      {
        slider: "slider",
      },
      "",
      ""
    );
  };


  const handleSliderClose = () => {
    window.history.back();
  };

  const showWordedAvailability = (stocks) => {
    if (stocks < 1500) {
      return (
        <span
          style={{
            color: "#e1ad01",
            fontFamily: "Arial, Helvetica, sans-serif",
            fontWeight: "450",
            fontSize: "14px",
          }}
        >
          selling fast
        </span>
      );
    }

    if (stocks < 2500) {
      return (
        <span
          style={{
            color: "#5f9ea0",
            fontFamily: "Arial, Helvetica, sans-serif",
            fontWeight: "450",
            fontSize: "14px",
          }}
        >
          popular choice
        </span>
      );
    }

    if (stocks < 3500) {
      return (
        <span
          style={{
            color: "#b22222",
            fontFamily: "Arial, Helvetica, sans-serif",
            fontWeight: "450",
            fontSize: "14px",
          }}
        >
          bestselling
        </span>
      );
    }

    return (
      <span
        style={{
          color: "black",
          fontFamily: "Arial, Helvetica, sans-serif",
          fontWeight: "450",
          fontSize: "14px",
        }}
      >
        available
      </span>
    );
  };

  return (
    <div>
      <Dialog
        open={props.buyOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={props.handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
        classes={{
          paper: classes.dialog,
        }}
      >
        <ClearOutlinedIcon
          style={{ height: "15px", width: "15px" }}
          className="buy_cancelButton"
          onClick={() => {
            showPayments ? setShowPayments(false) : props.handleClose();
          }}
        />
        {showPayments ? (
          <div className="buy_checkoutBox">
            <Elements stripe={stripePromise}>
              <CardForm
                setBuyOpen={props.setBuyOpen}
                quantity={quantity}
                itemId={itemId}
                videoId={props.id}
                handleErrorStatus={handleErrorStatus}
                sellerId={props.sellerId}
                totalPrice={Math.round(price * quantity * 100)}
                handleSetUpOpen={props.handleSetUpOpen}
                address={userInfo.address}
                country={userInfo.country}
                city={userInfo.city}
                postalCode={userInfo.postalCode}
                number={userInfo.number}
                setShowPayments={setShowPayments}
                stripeClient={stripeClient}
                productDesc={getCombinedName(color, name, size)}
              />
            </Elements>
          </div>
        ) : (
          <div className="buy_shoppingBox">
            <div className="buy_PictureNamePriceStockRow">
              <div style={{ position: "relative" }}>
                <img
                  className="buy_Picture"
                  src={image}
                  onClick={handleSliderOpen}
                />
                <PhotoLibraryIcon className="product_item_slider_icon" />
              </div>

              <div className="buy_NamePriceStock">
                <p>
                  USD<span> </span>
                  {price
                    ? Number(
                        Math.round(parseFloat(price + "e" + 2)) + "e-" + 2
                      ).toFixed(2)
                    : Number(
                        Math.round(parseFloat(props.averagePrice + "e" + 2)) +
                          "e-" +
                          2
                      ).toFixed(2)}
                </p>

                <p style={{ width: "80%", textAlign: "center" }}>
                  {getCombinedName(color, name, size)}
                </p>
                <p>
                  {stocks == 0 ? (
                    "out of stock"
                  ) : stocks < 99 ? (
                    <span
                      style={{
                        color: "maroon",
                        fontFamily: "Arial, Helvetica, sans-serif",
                        fontWeight: "450",
                        fontSize: "14px",
                      }}
                    >
                      {stocks} left
                    </span>
                  ) : (
                    showWordedAvailability(stocks)
                  )}
                </p>
              </div>
            </div>

            <div className="buy_SelectionsBox">
              <div className="buy_SelectionsWords">
                <p>Selection</p>
              </div>
              <div className="buy_TypesRow">
                {props.items.map((type, id) => (
                  <div
                    className="buy_SelectionsTags"
                    style={
                      id === selectedType
                        ? { border: "2px solid #222222" }
                        : null
                    }
                    onClick={() =>
                      handleSetType(
                        type._id,
                        type.name,
                        type.price,
                        type.stocks,
                        type.image,
                        id,
                        type.name,
                        type.size,
                        type.color
                      )
                    }
                  >
                    <p>{getCombinedName(type.color, type.name, type.size)}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="buy_WrapQuantityTotal">
              <div
                className="buy_QuantityRow"
                style={{ margin: "0px", paddingLeft: "0" }}
              >
                <p>Quantity: {quantity}</p>
                <div style={{ marginLeft: "10px" }}>
                  <ExpandLessOutlinedIcon
                    fontSize="large"
                    onClick={handleIncreaseQuantity}
                  />
                  <ExpandMoreOutlinedIcon
                    fontSize="large"
                    onClick={handleDecreaseQuantity}
                  />
                </div>
              </div>
              <div
                className="buy_QuantityRow"
                style={{ margin: "0px", paddingLeft: "0" }}
              >
                <p style={{ margin: "0px" }}>
                  Total: USD<span> </span>
                  {Number(
                    Math.round(parseFloat(price * quantity + "e" + 2)) +
                      "e-" +
                      2
                  ).toFixed(2)}
                </p>
              </div>
              <p style={{ fontSize: "10px" }}>eligible for free shipping</p>
              <p style={{ fontStyle: "italic", fontSize: "10px" }}>
                purchased items will arrive in 7 to 20 working days
              </p>
            </div>
            {handleShowButton()}
          </div>
        )}

        {buyingStatus ? (
          <Alert severity="success" style={{ zIndex: "3000" }}>
            {buyingStatus}
          </Alert>
        ) : null}
        {errorStatus ? (
          <Alert severity="error" style={{ zIndex: "3000" }}>
            {errorStatus}
          </Alert>
        ) : null}

        <ProductItemsSlider
          openSlider={props.openSlider}
          handleSliderOpen={handleSliderOpen}
          handleSliderClose={handleSliderClose}
          productImages={props.productImages}
        />
      </Dialog>
    </div>
  );
};
