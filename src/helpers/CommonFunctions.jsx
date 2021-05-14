import axios from "../axios";

export const getCombinedName = (color, name, size) => {
  let newColor = "";
  let newName = "";
  let newSize = "";

  if (color) {
    newColor = color + " ";
  }
  if (name) {
    newName = name;
  }
  if (size) {
    newSize = " (" + size + ")";
  }

  return newColor + newName + newSize;
};

export const convertSocialTypeToImage = (socialType) => {
  if (socialType == "TikTok") {
    return "https://dciv99su0d7r5.cloudfront.net/tik-tok.png";
  } else if (socialType == "Instagram") {
    return "https://dciv99su0d7r5.cloudfront.net/instagram.png";
  } else if (socialType == "Youtube") {
    return "https://dciv99su0d7r5.cloudfront.net/youtube.png";
  } else if (socialType == "Twitch") {
    return "https://dciv99su0d7r5.cloudfront.net/twitch.png";
  } else if (socialType == "Pinterest") {
    return "https://dciv99su0d7r5.cloudfront.net/pinterest.png";
  } else if (socialType == "Facebook") {
    return "https://dciv99su0d7r5.cloudfront.net/facebook.png";
  } else if (socialType == "Twitter") {
    return "https://dciv99su0d7r5.cloudfront.net/twitter.png";
  } else if (socialType == "Discord") {
    return "https://dciv99su0d7r5.cloudfront.net/discord.png";
  } else if (socialType == "Spotify") {
    return "https://dciv99su0d7r5.cloudfront.net/spotify.png";
  } else if (socialType == "Telegram") {
    return "https://dciv99su0d7r5.cloudfront.net/telegram.png";
  } else if (socialType == "Whatsapp") {
    return "https://dciv99su0d7r5.cloudfront.net/whatsapp.png";
  } else if (socialType == "Snapchat") {
    return "https://dciv99su0d7r5.cloudfront.net/snapchat.png";
  } else if (socialType == "Email") {
    return "https://dciv99su0d7r5.cloudfront.net/envelope.png";
  }
};

export const convertSocialTypeToHelper = (socialType) => {
  if (socialType == "TikTok") {
    return "Your Username";
  } else if (socialType == "Instagram") {
    return "Your Username";
  } else if (socialType == "Youtube") {
    return "Youtube Sharable Link";
  } else if (socialType == "Twitch") {
    return "Your Username";
  } else if (socialType == "Pinterest") {
    return "Your Username";
  } else if (socialType == "Facebook") {
    return "Facebook Shareable Link";
  } else if (socialType == "Twitter") {
    return "Your Username";
  } else if (socialType == "Discord") {
    return "Discord Sharable Link";
  } else if (socialType == "Spotify") {
    return "Spotify Sharable Link";
  } else if (socialType == "Telegram") {
    return "Telegram Sharable Link";
  } else if (socialType == "Whatsapp") {
    return "Whatsapp Sharable Link";
  } else if (socialType == "Snapchat") {
    return "Your Username";
  } else if (socialType == "Email") {
    return "user@mail.com";
  }
};

export const convertUsernameToSocialLink = (socialType, userIdentifier) => {
  if (socialType == "TikTok") {
    return "https://www.tiktok.com/@" + userIdentifier;
  } else if (socialType == "Instagram") {
    return "https://www.instagram.com/" + userIdentifier;
  } else if (socialType == "Youtube") {
    return userIdentifier;
  } else if (socialType == "Twitch") {
    return "https://www.twitch.tv/" + userIdentifier;
  } else if (socialType == "Pinterest") {
    return "https://www.pinterest.com/" + userIdentifier;
  } else if (socialType == "Facebook") {
    return userIdentifier;
  } else if (socialType == "Twitter") {
    return "https://twitter.com/" + userIdentifier;
  } else if (socialType == "Discord") {
    return userIdentifier;
  } else if (socialType == "Spotify") {
    return userIdentifier;
  } else if (socialType == "Telegram") {
    return userIdentifier;
  } else if (socialType == "Whatsapp") {
    return userIdentifier;
  } else if (socialType == "Snapchat") {
    return "https://www.snapchat.com/add/" + userIdentifier;
  } else if (socialType == "Email") {
    return userIdentifier;
  }
};

export const downloadAndSaveTikToksWithRetry = async (nthTry) => {
  try {
    const res = await downloadAndSaveTikToks();
    if (res == "failed") {
      throw new Error("downloadAndSaveFuncError");
    }
    return res;
  } catch (e) {
    if (nthTry === 1) {
      axios.post("/v1/email/severeError", {
        userId: localStorage.getItem("USER_ID"),
        userName: localStorage.getItem("USER_NAME"),
      });

      alert(
        "We are unable to download your content now. We are working on it and will contact you via email when solved."
      );

      return Promise.reject(e);
    }
    console.log("download restart", nthTry, "time");
    await waitFor(10000);
    return downloadAndSaveTikToksWithRetry(nthTry - 1);
  }
};

export const downloadAndSaveTikToks = async () => {
  try {
    let res;
    console.log("getting tiktoks info");
    res = await retryGetPromiseWithDelay(
      "v1/tiktok/getInfo/" + localStorage.getItem("USER_ID"),
      3,
      10000
    );

    console.log("downloading tiktoks");

    res = await retryGetPromiseWithDelay(
      "v1/tiktok/download/" + localStorage.getItem("USER_ID"),
      3,
      10000
    );

    console.log("saving tiktoks");

    res = await retryGetPromiseWithDelay(
      "v1/tiktok/saveTikToks/" + localStorage.getItem("USER_ID"),
      3,
      10000
    );

    return "success";
  } catch (e) {
    console.log("restarting download");
    return "failed";
  }
};

function waitFor(millSeconds) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, millSeconds);
  });
}

async function retryGetPromiseWithDelay(promiseLink, nthTry, delayTime) {
  try {
    await waitFor(5000);
    console.log("promise with delay", promiseLink);
    const res = await axios.get(promiseLink);
    return res;
  } catch (e) {
    if (nthTry === 1) {
      return Promise.reject(e);
    }
    console.log("retrying", nthTry, "time");
    // wait for delayTime amount of time before calling this method again
    await waitFor(delayTime);
    return retryGetPromiseWithDelay(promiseLink, nthTry - 1, delayTime);
  }
}

async function retryPostPromiseWithDelay(promiseLink, body, nthTry, delayTime) {
  try {
    await waitFor(5000);
    console.log("promise with delay", promiseLink);
    const res = await axios.post(promiseLink, body);
    return res;
  } catch (e) {
    if (nthTry === 1) {
      return Promise.reject(e);
    }
    console.log("retrying", nthTry, "time");
    // wait for delayTime amount of time before calling this method again
    await waitFor(delayTime);
    return retryGetPromiseWithDelay(promiseLink, nthTry - 1, delayTime);
  }
}
