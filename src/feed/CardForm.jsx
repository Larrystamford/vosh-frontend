import React, { useState, useEffect, useMemo } from "react";
import {
  PaymentRequestButtonElement,
  useStripe,
  useElements,
  CardElement,
} from "@stripe/react-stripe-js";

import GooglePayButton from "@google-pay/button-react";
import { InstantBrowserMsg } from "../components/pwa/InstantBrowserMsg";
import { useHistory } from "react-router";
import { Purchase, Exception, Event } from "../components/tracking/Tracker";
import ReactPixel from "react-facebook-pixel";

import axios from "../axios";

const useOptions = () => {
  const fontSize = "14px";
  const options = useMemo(
    () => ({
      style: {
        base: {
          fontSize,
          color: "#424770",
          letterSpacing: "0.025em",
          fontFamily: "Source Code Pro, monospace",
          "::placeholder": {
            color: "#aab7c4",
          },
        },
        invalid: {
          color: "#9e2146",
        },
      },
    }),
    [fontSize]
  );

  return options;
};

export const CardForm = (props) => {
  let isWebview = /(Version\/\d+.*\/\d+.0.0.0 Mobile|; ?wv|(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari))/i.test(
    navigator.userAgent
  );

  const history = useHistory();
  const pathName = history.location.pathname;
  const stripe = useStripe();
  const elements = useElements();
  const options = useOptions();

  const [useGooglePayButton, setUseGooglePayButton] = useState(!isWebview);
  const [payButtonClicked, setPayButtonClicked] = useState(false);
  const [betterPayButtonClicked, setBetterPayButtonClicked] = useState(false);
  const [showBrowserMsg, setShowBrowserMsg] = useState(false);

  const [paymentRequest, setPaymentRequest] = useState(null);
  useEffect(() => {
    if (stripe) {
      const pr = stripe.paymentRequest({
        country: "US",
        currency: "usd",
        total: {
          label: "Total",
          amount: props.totalPrice,
        },
        requestPayerName: true,
        requestPayerEmail: true,
        shippingOptions: [
          {
            id: "basic",
            label: "Ground shipping",
            detail: "Free Singapore shipping",
            amount: 0,
          },
        ],
      });

      // Check the availability of the Payment Request API.
      pr.canMakePayment().then((result) => {
        if (result) {
          setPaymentRequest(pr);
        }
      });
    }
  }, [stripe]);

  const handleSubmit = async (event) => {
    setPayButtonClicked(true);
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      console.log("striple elements not loaded yet");

      return;
    }

    // get secret key
    let backendPaymentIntent;
    let newBuySellItemId;

    // get payment intent and stock handling
    backendPaymentIntent = await axios.post(
      "/v1/payment/create-payment-intent",
      {
        userId: localStorage.getItem("USER_ID"),
        sellerId: props.sellerId,
        itemId: props.itemId,
        quantity: props.quantity,
      }
    );

    newBuySellItemId = backendPaymentIntent.data.newBuySellItemId;

    if (backendPaymentIntent.data.status === "success") {
      // if anything inside here causes a failure, we need to revert new item stock handling

      const clientSecret = backendPaymentIntent.data.clientSecret;
      const paymentResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: localStorage.getItem("USER_NAME"),
          },
        },
      });

      if (paymentResult.error) {
        // revert the item stock purchased
        await axios.put("/v1/video/revertItemPurchase", {
          userId: localStorage.getItem("USER_ID"),
          sellerId: props.sellerId,
          itemId: props.itemId,
          quantity: props.quantity,
          newBuySellItemId: newBuySellItemId,
        });

        setPayButtonClicked(false);
        props.handleErrorStatus("try a different payment method", 4000);
        Exception(paymentResult.error + "try a different payment method");
      } else {
        // successfully paid
        if (paymentResult.paymentIntent.status === "succeeded") {
          props.setBuyOpen(false);
          history.push({
            pathname: "/profile",
            state: {
              showBoughtItems: true,
            },
          });
          setTimeout(() => setPayButtonClicked(false), 4000);
          props.setShowPayments(false);
          axios.post("/v1/email/onPurchase", {
            userId: localStorage.getItem("USER_ID"),
          });
          Purchase(props.itemId, props.totalPrice / 100);
          ReactPixel.track("Purchase", {
            currency: "usd",
            value: props.totalPrice,
          });
          if (pathName === "/profile" || pathName === "/profile/") {
            window.location.reload();
          }
        }
      }
    } else if (
      backendPaymentIntent.data.status === "Error: insufficient stock"
    ) {
      props.handleErrorStatus("insufficient stock", 4000);
      setPayButtonClicked(false);
      Exception("insufficient stock");
      return;
    } else {
      props.handleErrorStatus("try a different payment method", 4000);
      setPayButtonClicked(false);
      Exception("try a different payment method");
      return;
    }
  };

  // for auto google / apple pay
  useEffect(() => {
    if (paymentRequest) {
      setBetterPayButtonClicked(true);

      paymentRequest.on("paymentmethod", async (ev) => {
        // get secret key
        let backendPaymentIntent;
        let newBuySellItemId;

        // get payment intent and stock handling
        backendPaymentIntent = await axios.post(
          "/v1/payment/create-payment-intent",
          {
            userId: localStorage.getItem("USER_ID"),
            sellerId: props.sellerId,
            itemId: props.itemId,
            quantity: props.quantity,
          }
        );

        newBuySellItemId = backendPaymentIntent.data.newBuySellItemId;

        if (backendPaymentIntent.data.status === "success") {
          // if anything inside here causes a failure, we need to revert new item stock handling

          const clientSecret = backendPaymentIntent.data.clientSecret;
          const {
            paymentIntent,
            error: confirmError,
          } = await stripe.confirmCardPayment(
            clientSecret,
            { payment_method: ev.paymentMethod.id },
            { handleActions: false }
          );

          if (confirmError) {
            // revert the item stock purchased
            await axios.put("/v1/video/revertItemPurchase", {
              userId: localStorage.getItem("USER_ID"),
              sellerId: props.sellerId,
              itemId: props.itemId,
              quantity: props.quantity,
              newBuySellItemId: newBuySellItemId,
            });
            setBetterPayButtonClicked(false);
            Exception("Google / Apple auto pay failed" + confirmError);
            ev.complete("fail");
          } else {
            ev.complete("success");
            if (paymentIntent.status === "requires_action") {
              const { error } = await stripe.confirmCardPayment(clientSecret);
              if (error) {
                // revert the item stock purchased
                await axios.put("/v1/video/revertItemPurchase", {
                  userId: localStorage.getItem("USER_ID"),
                  sellerId: props.sellerId,
                  itemId: props.itemId,
                  quantity: props.quantity,
                  newBuySellItemId: newBuySellItemId,
                });

                // consider adding ev.complete("fail") here
                Exception(error + "try a different payment method");

                props.handleErrorStatus("try a different payment method", 4000);
                setBetterPayButtonClicked(false);
              } else {
                // The payment has succeeded.
                props.setBuyOpen(false);
                history.push({
                  pathname: "/profile",
                  state: {
                    showBoughtItems: true,
                  },
                });
                setTimeout(() => setBetterPayButtonClicked(false), 4000);
                props.setShowPayments(false);
                axios.post("/v1/email/onPurchase", {
                  userId: localStorage.getItem("USER_ID"),
                });
                Purchase(props.itemId, props.totalPrice / 100);
                ReactPixel.track("Purchase", {
                  currency: "usd",
                  value: props.totalPrice,
                });
                if (pathName === "/profile" || pathName === "/profile/") {
                  window.location.reload();
                }
              }
            } else {
              // successful, no other action required
              props.setBuyOpen(false);
              history.push({
                pathname: "/profile",
                state: {
                  showBoughtItems: true,
                },
              });
              setTimeout(() => setBetterPayButtonClicked(false), 4000);
              props.setShowPayments(false);
              axios.post("/v1/email/onPurchase", {
                userId: localStorage.getItem("USER_ID"),
              });
              Purchase(props.itemId, props.totalPrice / 100);
              ReactPixel.track("Purchase", {
                currency: "usd",
                value: props.totalPrice,
              });
              if (pathName === "/profile" || pathName === "/profile/") {
                window.location.reload();
              }
            }
          }
        } else if (
          backendPaymentIntent.data.status === "Error: insufficient stock"
        ) {
          props.handleErrorStatus("insufficient stock", 4000);
          setBetterPayButtonClicked(false);
          Exception("insufficient stock");
          ev.complete("fail");
          return;
        } else {
          props.handleErrorStatus("try a different payment method", 4000);
          setBetterPayButtonClicked(false);
          Exception("try a different payment method");
          ev.complete("fail");
          return;
        }
      });
    }
  }, paymentRequest);

  // render standard checkout form
  return (
    <div className="buy_main_wrapper">
      <div className="buy_order_summary_wrapper">
        <p style={{ fontWeight: "bold" }}>Order Summary</p>
        <div className="buy_shipping_rect">
          <p style={{ color: "rgb(46, 119, 230)" }}>Item:</p>
          <p style={{ fontWeight: "bold" }}>
            {props.productDesc}
            <span>
              {props.quantity > 1 ? ", qty: " + props.quantity : null}
            </span>
          </p>
        </div>
        <div className="buy_shipping_rect">
          <p style={{ color: "rgb(46, 119, 230)" }}>Delivery:</p>
          <p style={{ fontWeight: "bold" }}>
            {true ? "Free" : (props.quantity * 0).toFixed(2)}
          </p>
        </div>
        <div className="buy_shipping_rect">
          <p style={{ color: "rgb(46, 119, 230)" }}>Total:</p>
          <p style={{ fontWeight: "bold" }}>
            {(props.totalPrice / 100).toFixed(2)}
          </p>
        </div>
      </div>
      <div className="buy_address_edit_wrapper">
        <p style={{ fontWeight: "bold" }}>Shipping address</p>
        <div className="buy_shipping_rect">
          <p style={{ color: "rgb(46, 119, 230)" }}>address:</p>
          <p>{props.address}</p>
        </div>
        <div className="buy_shipping_rect">
          <p style={{ color: "rgb(46, 119, 230)" }}>city, state, country:</p>
          <p>
            {props.city}, {props.country}
          </p>
        </div>
        <div className="buy_shipping_rect">
          <p style={{ color: "rgb(46, 119, 230)" }}>zip / postal code:</p>
          <p>{props.postalCode}</p>
        </div>
        <div className="buy_shipping_rect">
          <p style={{ color: "rgb(46, 119, 230)" }}>contact number:</p>
          <p>{props.number}</p>
        </div>
        <div className="buy_shipping_rect_change">
          <p
            style={{ fontSize: "12px" }}
            onClick={() => props.handleSetUpOpen()}
          >
            change address
          </p>
        </div>
      </div>

      {useGooglePayButton ? (
        <GooglePayButton
          environment="PRODUCTION"
          paymentRequest={{
            apiVersion: 2,
            apiVersionMinor: 0,
            allowedPaymentMethods: [
              {
                type: "CARD",
                parameters: {
                  allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
                  allowedCardNetworks: ["MASTERCARD", "VISA"],
                },
                tokenizationSpecification: {
                  type: "PAYMENT_GATEWAY",
                  parameters: {
                    gateway: "stripe",
                    "stripe:version": "v3",
                    "stripe:publishableKey": props.stripeClient,
                  },
                },
              },
            ],
            merchantInfo: {
              merchantId: "BCR2DN6TWPU5FIKF",
              merchantName: "shoplocoloco",
            },
            transactionInfo: {
              totalPriceStatus: "FINAL",
              totalPriceLabel: "Total",
              totalPrice: (props.totalPrice / 100).toFixed(2),
              currencyCode: "USD",
              countryCode: "US",
            },
          }}
          onLoadPaymentData={(googleToken) => {
            axios
              .post("/v1/payment/charge-google-token", {
                googleToken:
                  googleToken.paymentMethodData.tokenizationData.token,
                itemId: props.itemId,
                quantity: props.quantity,
                userId: localStorage.getItem("USER_ID"),
                sellerId: props.sellerId,
              })
              .then((paymentRes) => {
                if (paymentRes.data.status === "success") {
                  props.setBuyOpen(false);
                  history.push({
                    pathname: "/profile",
                    state: {
                      showBoughtItems: true,
                    },
                  });
                  props.setShowPayments(false);
                  axios.post("/v1/email/onPurchase", {
                    userId: localStorage.getItem("USER_ID"),
                  });
                  Purchase(props.itemId, props.totalPrice / 100);
                  ReactPixel.track("Purchase", {
                    currency: "usd",
                    value: props.totalPrice,
                  });
                  if (pathName === "/profile" || pathName === "/profile/") {
                    window.location.reload();
                  }
                } else if (
                  paymentRes.data.status === "Error: insufficient stock"
                ) {
                  Exception("insufficient stock google pay");
                  props.handleErrorStatus("insufficient stock", 4000);
                } else {
                  Exception("try a different payment method google pay");
                  props.handleErrorStatus(
                    "try a different payment method",
                    4000
                  );
                }
              });
          }}
        />
      ) : paymentRequest ? (
        <PaymentRequestButtonElement
          options={{ paymentRequest }}
          onClick={() => {
            paymentRequest.update({
              total: {
                label: "Total",
                amount: props.totalPrice,
              },
            });
          }}
          disabled={betterPayButtonClicked}
        />
      ) : (
        <form className="buy_card_wrapper" onSubmit={handleSubmit}>
          <label className="buy_label">
            <CardElement
              options={options}
              onReady={() => {
                console.log("CardElement [ready]");
              }}
              onChange={(event) => {
                console.log("CardElement [change]", event);
              }}
              onBlur={() => {
                console.log("CardElement [blur]");
              }}
              onFocus={() => {
                console.log("CardElement [focus]");
              }}
            />
          </label>
          <button
            className="buy_StripePayButton"
            type="submit"
            disabled={!stripe || payButtonClicked}
          >
            Pay Now
          </button>
        </form>
      )}

      {isWebview ? (
        <p
          style={{
            fontSize: "10px",
            bottom: "23px",
            left: "50%",
            color: "#3e4fae",
            paddingTop: "5px",
            paddingBottom: "15px",
          }}
          onClick={() => setShowBrowserMsg(true)}
        >
          Change Payment
        </p>
      ) : (
        <p
          style={{
            fontSize: "10px",
            bottom: "23px",
            left: "50%",
            color: "#3e4fae",
            paddingTop: "5px",
            paddingBottom: "15px",
          }}
          onClick={() => {
            setUseGooglePayButton(!useGooglePayButton);
            Event(
              "ecommerce",
              "Clicked the change payment button. WAS google pay button = " +
                useGooglePayButton,
              "Change Payment Button"
            );
          }}
        >
          Change Payment
        </p>
      )}

      <InstantBrowserMsg
        showBrowserMsg={showBrowserMsg}
        setShowBrowserMsg={setShowBrowserMsg}
        videoId={props.videoId}
      />
    </div>
  );
};
