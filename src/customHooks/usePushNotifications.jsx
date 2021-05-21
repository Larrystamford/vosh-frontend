import { useState } from "react";
import axios from "../axios";
//the function to call the push server: https://github.com/Spyna/push-notification-demo/blob/master/front-end-react/src/utils/http.js

import {
  isPushNotificationSupported,
  askUserPermission,
  createNotificationSubscription,
  getUserSubscription,
} from "../notifications/push-notifications";
//import all the function created to manage the push notifications

import { Exception } from "../components/tracking/Tracker";

const pushNotificationSupported = isPushNotificationSupported();
//first thing to do: check if the push notifications are supported by the browser

export default function usePushNotifications() {
  const checkUserConsent = () => {
    if (
      "Notification" in window &&
      "serviceWorker" in navigator &&
      "PushManager" in window
    ) {
      return Notification.permission;
    } else {
      return "not granted";
    }
  };

  const [userConsent, setUserConsent] = useState(checkUserConsent());

  //to manage the push server subscription
  const [error, setError] = useState(null);

  const updatePushSubscription = () => {
    getUserSubscription().then((existingSubscription) => {
      console.log(existingSubscription, "existing subscription");
      Exception(existingSubscription + localStorage.getItem("USER_ID"));
      if (existingSubscription) {
        console.log("has existing sub", existingSubscription);
        axios
          .post(
            "/v1/notifications/handlePushNotificationSubscription/" +
              localStorage.getItem("USER_ID"),
            existingSubscription
          )
          .then(function (response) {
            console.log("success subscribe auto");
          })
          .catch((err) => {
            Exception(err);
            setError(err);
          });
      } else {
        Exception(
          existingSubscription +
            "set to default" +
            localStorage.getItem("USER_ID")
        );
        setUserConsent("default");
      }
    });
  };

  const initiatePermissionFlow = () => {
    askUserPermission().then((consent) => {
      setUserConsent(consent);
      if (consent === "granted") {
        createNotificationSubscription()
          .then(function (subscription) {
            console.log("SUBSCRIBE Dets", subscription);
            axios
              .post(
                "/v1/notifications/handlePushNotificationSubscription/" +
                  localStorage.getItem("USER_ID"),
                subscription
              )
              .then(function (response) {
                console.log("push flow success", response);
              })
              .catch((err) => {
                Exception(err);
                setError(err);
              });
          })
          .catch((err) => {
            Exception(err);

            console.error(
              "Couldn't create the notification subscription",
              err,
              "name:",
              err.name,
              "message:",
              err.message,
              "code:",
              err.code
            );
            setError(err);
          });
      } else {
        if (consent === "denied") {
          localStorage.setItem("PUSH_BLOCKED", "true");
        }
        setError({
          name: "Consent denied",
          message: "You denied the consent to receive notifications",
          code: 0,
        });
      }
    });
  };

  return {
    userConsent,
    pushNotificationSupported,
    initiatePermissionFlow,
    updatePushSubscription,
  };
}
