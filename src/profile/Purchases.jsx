import React, { useState } from "react";
import "./Purchases.css";

import { PurchasesRow } from "./PurchasesRow";

export const Purchases = ({ purchases }) => {
  if (purchases.length === 0) {
    return (
      <div className="Purchases_NoInfo">
        <p>
          Shop with a peace of mind. All items come with live tracking and
          dedicated customer support.
        </p>
      </div>
    );
  }
  return (
    <div className="Purchases_body">
      {purchases.map(
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
        }) => (
          <PurchasesRow
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
            reviewId={reviewId}
          />
        )
      )}
      <div style={{ height: "3rem" }}></div>
    </div>
  );
};
