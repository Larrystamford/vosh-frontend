import React from "react";
import "./Purchases.css";

import { SellRow } from "./SellRow";

import Button from "@material-ui/core/Button";

export const Sell = ({ sales }) => {
  return (
    <div className="Purchases_body">
      {sales.map(
        ({
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
          shippingDelayed,
          buyerId,
        }) => (
          <SellRow
            _id={_id}
            name={name}
            size={size}
            color={color}
            price={price}
            quantity={quantity}
            image={image}
            videoId={videoId}
            totalPrice={totalPrice}
            sellerDeliveryStatus={sellerDeliveryStatus}
            buyerName={buyerName}
            buyerPostalCode={buyerPostalCode}
            buyerAddress={buyerAddress}
            createdAt={createdAt}
            updatedAt={updatedAt}
            shippedAt={shippedAt}
            deliveredAt={deliveredAt}
            refundedAt={refundedAt}
            shippingDelayedDB={shippingDelayed}
            buyerId={buyerId}
          />
        )
      )}
      <div style={{ height: "3rem" }}></div>
    </div>
  );
};
