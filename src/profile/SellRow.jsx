import React, { useState } from "react";
import "./Purchases.css";

import axios from "../axios";

import { DropDownMenu } from "../components/DropDownMenu";
import ContactMailIcon from "@material-ui/icons/ContactMail";

export const SellRow = ({
  _id,
  name,
  size,
  color,
  price,
  quantity,
  image,
  videoId,
  totalPrice,
  sellerDeliveryStatus,
  buyerName,
  buyerPostalCode,
  buyerAddress,
  createdAt,
  updatedAt,
  shippedAt,
  deliveredAt,
  refundedAt,
  shippingDelayedDB,
  buyerId,
}) => {
  const [showShipping, setShowShipping] = useState(false);
  const [shippingDelayed, setShippingDelayed] = useState(shippingDelayedDB);

  if (showShipping) {
    return (
      <div
        className="Purchases_item_row"
        key={_id}
        onClick={() => setShowShipping(false)}
      >
        <div className="Purchases_shipping_info">
          <p
            style={{
              fontWeight: "bold",
            }}
          >
            Shipping information:
          </p>
          <p>{buyerName}</p>
          <p>{buyerAddress}</p>
          <p>{buyerPostalCode}</p>
        </div>
      </div>
    );
  }

  const handleShippingDelay = (delay) => {
    setShippingDelayed(delay);
    axios
      .put("/v1/users/updateShippingStatus/", {
        buySellItemId: _id,
        shippingDelayed: delay,
      })
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.error(error);
      });

    if (delay) {
      // push notifications to user
      axios.post("/v1/notifications/sendPushNotification/" + buyerId, {
        title:
          "There has been a slight delay in shipping! We are working hard on it!",
        text: "Open to view",
        image: "https://dciv99su0d7r5.cloudfront.net/icon-192x192.png",
        tag: "shipping-refunded",
        url: "https://www.vosh.club/inbox",
      });

      // in app notification
      axios.post("/v1/notifications/createInboxNotification/" + buyerId, {
        videoCoverImage: image,
        message:
          "Sorry for the delay! To make up for it, we have credited 10 lococoins into your account which will automatically be used in your next purchase.",
        notificationType: "shippingUpdates",
        videoId: videoId,
      });

      // loco coins
      axios.put("/v1/users/addCoins/" + buyerId, {
        locoCoins: 10,
      });
    }
  };

  return (
    <div className="Purchases_item_row" key={_id}>
      <img className="Purchases_picture" src={image} />
      <div className="Purchases_description">
        <p style={{ fontWeight: "bold", fontSize: "14px" }}>
          {name} <ContactMailIcon onClick={() => setShowShipping(true)} />
        </p>
        <div className="Purchases_description_row">
          <p>
            {size} {color}
          </p>

          <p>x{quantity}</p>
        </div>
        <div className="Purchases_description_row">
          <div></div>
          <p
            style={{
              fontSize: "13px",
              color: "black",
            }}
          >
            ${price}
          </p>
        </div>
        <div className="Purchases_description_row">
          <div></div>
          <p
            style={{
              fontSize: "13px",
              color: "black",
              fontWeight: "bold",
            }}
          >
            Total Price: ${(totalPrice / 100).toFixed(2)}
          </p>
        </div>

        <div className="Purchases_description_row">
          {shippingDelayed ? (
            <p
              onClick={() => {
                handleShippingDelay(false);
              }}
            >
              Undo Shipping Delayed
            </p>
          ) : (
            <p
              onClick={() => {
                handleShippingDelay(true);
              }}
            >
              Click if Shipping Delayed
            </p>
          )}

          <DropDownMenu
            buySellItemId={_id}
            deliveryStatus={sellerDeliveryStatus}
            itemImage={image}
            videoId={videoId}
            buyerId={buyerId}
          />
        </div>
      </div>
    </div>
  );
};
