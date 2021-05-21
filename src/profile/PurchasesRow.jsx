import React, { useState, useEffect, useCallback, useRef } from "react";
import "./Purchases.css";
import { useHistory } from "react-router";

import { OrderDetails } from "./OrderDetails";
import { ConfirmItemDelivery } from "./ConfirmItemDelivery";

import LocalShippingOutlinedIcon from "@material-ui/icons/LocalShippingOutlined";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import CameraAltOutlinedIcon from "@material-ui/icons/CameraAltOutlined";

export const PurchasesRow = ({
  _id,
  name,
  size,
  color,
  price,
  quantity,
  image,
  videoId,
  totalPrice,
  buyerDeliveryStatus,
  buyerPostalCode,
  buyerAddress,
  createdAt,
  updatedAt,
  shippedAt,
  deliveredAt,
  refundedAt,
  shippingDelayed,
  reviewId,
}) => {
  const history = useHistory();

  // for opening details
  const [detailsOpen, setDetailsOpen] = useState(false);
  const handleDetailsOpen = () => {
    setDetailsOpen(true);
    window.history.pushState(
      {
        foo: "bar",
      },
      "",
      ""
    );
  };

  const handleDetailsClose = () => {
    setDetailsOpen(false);
    window.history.back();
  };

  const handleDetailsPop = useCallback(() => {
    setDetailsOpen(false);
  }, []);

  useEffect(() => {
    window.addEventListener("popstate", handleDetailsPop);
    // cleanup this component
    return () => {
      window.removeEventListener("popstate", handleDetailsPop);
    };
  }, []);

  const [openConfirmDelivery, setOpenConfirmDelivery] = useState(false);
  const [confirmedDelivery, setConfirmedDelivery] = useState(false);

  // review
  const hiddenFileInput = useRef(null);
  const handleClick = async (event) => {
    hiddenFileInput.current.click();
  };
  const onChangeHandler = (event) => {
    const file = event.target.files[0];
    const mediaType = file.type.split("/")[0];

    if (mediaType != "image") {
      alert("Please upload images only");
    } else {
      history.push({
        pathname: "/review",
        state: {
          file: file,
          itemId: _id,
          videoId: videoId,
          name: name,
          size: size,
          color: color,
          buySellItemId: _id,
        },
      });
    }
  };

  return (
    <div className="Purchases_item_wrapper">
      <div className="Purchases_item_row" key={_id}>
        <img
          className="Purchases_picture"
          src={image}
          onClick={() => {
            history.push({
              pathname: "/video/" + videoId,
            });
          }}
        />
        <div className="Purchases_description">
          <p style={{ fontWeight: "bold", fontSize: "14px" }}>{name}</p>
          <div className="Purchases_description_row">
            <p>
              {size} {color}
            </p>

            <p>
              ${price.toFixed(2)} x{quantity}
            </p>
          </div>
          <div className="Purchases_description_row">
            <div></div>
            <p>Delivery: Free</p>
          </div>
          <div className="Purchases_description_row">
            <div></div>
            <p
              style={{
                fontSize: "13px",
                color: "black",
              }}
            >
              Total Price: ${(totalPrice / 100).toFixed(2)}
            </p>
          </div>
        </div>
      </div>
      <div
        className="Purchases_more_details_and_review"
        onClick={() => handleDetailsOpen()}
      >
        <span style={{ color: "grey" }}>View Full Order Details</span>
        <LocalShippingOutlinedIcon style={{ color: "grey" }} />
      </div>

      {refundedAt ? (
        <div
          className="Purchases_more_details_and_review"
          style={{
            borderTop: "0px",
            justifyContent: "center",
            height: "3.5rem",
          }}
        >
          <span
            style={{ color: "black", fontSize: "12px", textAlign: "center" }}
          >
            A full refund has been made. It will be reflected in your bank
            account in 10 days or less. We are sorry for the poor experience.
          </span>
        </div>
      ) : reviewId ? (
        <div
          className="Purchases_more_details_and_review"
          style={{ borderTop: "0px", justifyContent: "center" }}
        >
          <span style={{ color: "orange" }}>Thank you for your review!</span>
        </div>
      ) : deliveredAt || confirmedDelivery ? (
        <div
          className="Purchases_more_details_and_review"
          onClick={handleClick}
          style={{ borderTop: "0px", justifyContent: "center" }}
        >
          <span style={{ color: "#ff6b00" }}>Snap Us Your Review</span>
          <CameraAltOutlinedIcon style={{ color: "#ff6b00" }} />
          <div style={{ display: "none" }}>
            <input
              ref={hiddenFileInput}
              type="file"
              name="file"
              onChange={onChangeHandler}
            />
          </div>
        </div>
      ) : buyerDeliveryStatus === "shipped" ? (
        <div
          className="Purchases_more_details_and_review"
          style={{ borderTop: "0px", justifyContent: "center" }}
          onClick={() => setOpenConfirmDelivery(true)}
        >
          <span style={{ color: "green" }}>Order Arrived?</span>
        </div>
      ) : (
        <div
          className="Purchases_more_details_and_review"
          style={{ borderTop: "0px", justifyContent: "center" }}
        >
          <span style={{ color: "black" }}>Order Confirmed</span>
          <CheckCircleOutlineIcon style={{ color: "black" }} />
        </div>
      )}

      <OrderDetails
        detailsOpen={detailsOpen}
        handleDetailsClose={handleDetailsClose}
        _id={_id}
        name={name}
        size={size}
        color={color}
        price={price}
        quantity={quantity}
        image={image}
        videoId={videoId}
        totalPrice={totalPrice}
        buyerDeliveryStatus={buyerDeliveryStatus}
        buyerPostalCode={buyerPostalCode}
        buyerAddress={buyerAddress}
        createdAt={createdAt}
        updatedAt={updatedAt}
        shippedAt={shippedAt}
        deliveredAt={deliveredAt}
        refundedAt={refundedAt}
        shippingDelayed={shippingDelayed}
      />
      <ConfirmItemDelivery
        buySellItemId={_id}
        openConfirmDelivery={openConfirmDelivery}
        setOpenConfirmDelivery={setOpenConfirmDelivery}
        setConfirmedDelivery={setConfirmedDelivery}
      />
    </div>
  );
};
