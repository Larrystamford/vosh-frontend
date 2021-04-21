import React, { useState, useEffect } from "react";
import "./OrderDetails.css";
import { useGlobalState } from "../GlobalStates";
import ArrowBackIosOutlinedIcon from "@material-ui/icons/ArrowBackIosOutlined";
import { CustomerSupportAlert } from "./CustomerSupportAlert";

import Dialog from "@material-ui/core/Dialog";
import Slide from "@material-ui/core/Slide";
import { makeStyles } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";

import Timeline from "@material-ui/lab/Timeline";
import TimelineItem from "@material-ui/lab/TimelineItem";
import TimelineSeparator from "@material-ui/lab/TimelineSeparator";
import TimelineConnector from "@material-ui/lab/TimelineConnector";
import TimelineContent from "@material-ui/lab/TimelineContent";
import TimelineDot from "@material-ui/lab/TimelineDot";
import TimelineOppositeContent from "@material-ui/lab/TimelineOppositeContent";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import moment from "moment";

import axios from "../axios";

const useStyles = makeStyles((theme) => ({
  dialog: {
    position: "absolute",
    margin: 0,
    width: "104vw",
    minHeight: "100vh",
    zIndex: 5000,
    backgroundColor: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "40ch",
    },
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

export const OrderDetails = ({
  detailsOpen,
  handleDetailsClose,
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
}) => {
  const classes = useStyles();

  const [openCustomer, setOpenCustomer] = useState(false);

  return (
    <div className="order_main_wrapper">
      <Dialog
        open={detailsOpen}
        TransitionComponent={Transition}
        keepMounted
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
        classes={{
          paper: classes.dialog,
        }}
      >
        <div className="order_wrap">
          <div className="order_details_header">
            <ArrowBackIosOutlinedIcon onClick={() => handleDetailsClose()} />
            <span
              style={{
                position: "absolute",
                fontWeight: 700,
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              Order Details
            </span>
          </div>

          <div className="Purchases_item_row" key={_id}>
            <img className="Purchases_picture" src={image} />
            <div className="Purchases_description">
              <p style={{ fontWeight: "bold", fontSize: "14px" }}>{name}</p>
              <div className="Purchases_description_row">
                <p>
                  {size} {color}
                </p>

                <p>x{quantity}</p>
              </div>
            </div>
          </div>
          <div className="order_shipping_details">
            <div className="order_shipment_header">
              <p>Shipment Details</p>
            </div>
            <div className="order_shipment_timeline">
              <Timeline>
                <TimelineItem>
                  <TimelineSeparator>
                    <TimelineDot
                      style={
                        buyerDeliveryStatus == "ordered" ||
                        buyerDeliveryStatus == "shipped" ||
                        buyerDeliveryStatus == "delivered"
                          ? {
                              backgroundColor: "green",
                            }
                          : null
                      }
                    />
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent
                    style={{
                      minWidth: 70,
                    }}
                  >
                    Ordered
                  </TimelineContent>
                  <span
                    style={{
                      color: "gray",
                      fontSize: "12px",
                      fontWeight: 500,
                      marginTop: 10,
                      minWidth: 100,
                    }}
                  >
                    {moment(createdAt, "YYYY MM DD HH:mm:ss ZZ").format(
                      "DD MMM"
                    )}
                  </span>
                </TimelineItem>
                <TimelineItem>
                  <TimelineSeparator>
                    <TimelineDot
                      style={
                        buyerDeliveryStatus == "shipped" ||
                        buyerDeliveryStatus == "delivered"
                          ? {
                              backgroundColor: "green",
                            }
                          : null
                      }
                    />
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent
                    style={{
                      minWidth: 70,
                    }}
                  >
                    Shipped
                  </TimelineContent>
                  <span
                    style={{
                      color: "gray",
                      fontSize: "12px",
                      fontWeight: 500,
                      marginTop: 10,
                      minWidth: 100,
                    }}
                  >
                    {buyerDeliveryStatus == "shipped"
                      ? moment(shippedAt, "YYYY MM DD HH:mm:ss ZZ").format(
                          "DD MMM"
                        )
                      : buyerDeliveryStatus == "delivered"
                      ? moment(createdAt, "YYYY MM DD HH:mm:ss ZZ").format(
                          "DD MMM"
                        )
                      : null}
                  </span>
                </TimelineItem>
                <TimelineItem>
                  <TimelineSeparator>
                    <TimelineDot
                      style={
                        buyerDeliveryStatus == "delivered"
                          ? {
                              backgroundColor: "green",
                            }
                          : null
                      }
                    />
                  </TimelineSeparator>
                  <TimelineContent
                    style={{
                      minWidth: 70,
                    }}
                  >
                    Delivered
                  </TimelineContent>
                  <span
                    style={{
                      color: "gray",
                      fontSize: "12px",
                      fontWeight: 500,
                      marginTop: 10,
                      minWidth: 100,
                    }}
                  >
                    {buyerDeliveryStatus == "delivered"
                      ? moment(deliveredAt, "YYYY MM DD HH:mm:ss ZZ").format(
                          "DD MMM"
                        )
                      : null}
                  </span>
                </TimelineItem>
              </Timeline>
            </div>
          </div>
          <div className="order_shipment_header">
            {shippingDelayed ? (
              <p
                style={{
                  fontSize: "13px",
                  color: "black",
                  fontWeight: 400,
                }}
              >
                There has been a slight delay in shipping. We are working hard
                on this. Estimated: Before{" "}
                {moment(shippedAt, "YYYY MM DD HH:mm:ss ZZ")
                  .add(30, "days")
                  .format("DD MMM")}
              </p>
            ) : (
              <p
                style={{
                  fontSize: "13px",
                  color: "gray",
                  fontWeight: 400,
                }}
              >
                Standard Shipping: 7 to 20 business days
              </p>
            )}
          </div>
          <div className="order_shipping_details">
            <div className="order_shipment_header">
              <p>Order Summary</p>
            </div>
            <div className="order_summary_row">
              <p>Subtotal: ${(price * quantity).toFixed(2)} </p>
            </div>
            <div className="order_summary_row">
              <p>Delivery: Free</p>
            </div>
            <div className="order_summary_row">
              <p>Total Price: ${(totalPrice / 100).toFixed(2)}</p>
            </div>
          </div>
          <div className="order_customer_support">
            <Button
              variant="contained"
              color="primary"
              disableElevation
              onClick={() => setOpenCustomer(true)}
            >
              Customer Support
            </Button>
          </div>
          <CustomerSupportAlert
            openCustomer={openCustomer}
            setOpenCustomer={setOpenCustomer}
            buySellItemId={_id}
          />
        </div>
      </Dialog>
    </div>
  );
};
