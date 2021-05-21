import React, { useState } from "react";
import { useDidMountEffect } from "../customHooks/useDidMountEffect";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

import axios from "../axios";

const StyledMenu = withStyles({
  paper: {
    // border: "1px solid #d3d4d5",
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "center",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "center",
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles((theme) => ({
  root: {
    "&:focus": {
      backgroundColor: theme.palette.primary.main,
      "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
        color: theme.palette.common.white,
      },
    },
  },
}))(MenuItem);

export const DropDownMenu = ({
  buySellItemId,
  deliveryStatus,
  itemImage,
  videoId,
  buyerId,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [status, setStatus] = useState(deliveryStatus);

  useDidMountEffect(() => {
    axios
      .put("/v1/users/updateShippingStatus/", {
        buySellItemId: buySellItemId,
        buyerDeliveryStatus: status,
        sellerDeliveryStatus: status,
      })
      .then((res) => {
        if (status === "shipped") {
          // push notifications to user
          axios.post("/v1/notifications/sendPushNotification/" + buyerId, {
            title: "Your order is on it's way!",
            text: "Open to view",
            image:
              "https://dciv99su0d7r5.cloudfront.net/favicon-96x96.png",
            tag: "shipping-update",
            url: "https://www.vosh.club/inbox",
          });
          // in app notification
          axios.post("/v1/notifications/createInboxNotification/" + buyerId, {
            videoCoverImage: itemImage,
            message: "Your order has been shipped out!",
            notificationType: "shippingUpdates",
            videoId: videoId,
          });
        } else if (status === "delivered") {
          // push notifications to user
          axios.post("/v1/notifications/sendPushNotification/" + buyerId, {
            title:
              "Your order has been delivered! Share with us your experience by dropping a review.",
            text: "Open to view",
            image:
              "https://dciv99su0d7r5.cloudfront.net/favicon-96x96.png",
            tag: "shipping-delivered",
            url: "https://www.vosh.club/inbox",
          });
          // in app notification
          axios.post("/v1/notifications/createInboxNotification/" + buyerId, {
            videoCoverImage: itemImage,
            message: "Your order has been delivered! Share your review now!",
            notificationType: "shippingUpdates",
            videoId: videoId,
          });
        } else if (status === "refunded") {
          // push notifications to user
          axios.post("/v1/notifications/sendPushNotification/" + buyerId, {
            title:
              "We are sorry! A full refund has been credited back to your bank account.",
            text: "Open to view",
            image:
              "https://dciv99su0d7r5.cloudfront.net/favicon-96x96.png",
            tag: "shipping-refunded",
            url: "https://www.vosh.club/inbox",
          });

          // in app notification
          axios.post("/v1/notifications/createInboxNotification/" + buyerId, {
            videoCoverImage: itemImage,
            message:
              "We are sorry! On top of the full refund, we have credited 50 lococoins into your account which will automatically be used in your next purchase.",
            notificationType: "shippingUpdates",
            videoId: videoId,
          });

          // loco coins
          axios.put("/v1/users/addCoins/" + buyerId, {
            locoCoins: 50,
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [status]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        aria-controls="customized-menu"
        aria-haspopup="true"
        variant="contained"
        color="primary"
        size="small"
        onClick={handleClick}
      >
        <p
          style={{
            fontSize: "12px",
            color: "white",
          }}
        >
          {status}
        </p>
      </Button>

      <StyledMenu
        id="customized-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <StyledMenuItem
          onClick={() => {
            setStatus("ordered");
            handleClose();
          }}
        >
          <p
            style={{
              fontSize: "12px",
            }}
          >
            ORDERED
          </p>
        </StyledMenuItem>
        <StyledMenuItem
          onClick={() => {
            setStatus("shipped");
            handleClose();
          }}
        >
          <p
            style={{
              fontSize: "12px",
            }}
          >
            SHIPPED
          </p>
        </StyledMenuItem>
        <StyledMenuItem
          onClick={() => {
            setStatus("delivered");
            handleClose();
          }}
        >
          <p
            style={{
              fontSize: "12px",
            }}
          >
            DELIVERED
          </p>
        </StyledMenuItem>

        <StyledMenuItem
          onClick={() => {
            setStatus("refunded");
            handleClose();
          }}
        >
          <p
            style={{
              fontSize: "12px",
            }}
          >
            REFUNDED
          </p>
        </StyledMenuItem>
      </StyledMenu>
    </div>
  );
};
