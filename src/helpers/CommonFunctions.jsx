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
    return "https://media2locoloco-us.s3.amazonaws.com/tik-tok.png";
  } else if (socialType == "Instagram") {
    return "https://media2locoloco-us.s3.amazonaws.com/instagram.png";
  } else if (socialType == "Youtube") {
    return "https://media2locoloco-us.s3.amazonaws.com/youtube.png";
  } else if (socialType == "Twitch") {
    return "https://media2locoloco-us.s3.amazonaws.com/twitch.png";
  } else if (socialType == "Pinterest") {
    return "https://media2locoloco-us.s3.amazonaws.com/pinterest.png";
  } else if (socialType == "Facebook") {
    return "https://media2locoloco-us.s3.amazonaws.com/facebook.png";
  } else if (socialType == "Twitter") {
    return "https://media2locoloco-us.s3.amazonaws.com/twitter.png";
  } else if (socialType == "Discord") {
    return "https://media2locoloco-us.s3.amazonaws.com/discord.png";
  } else if (socialType == "Spotify") {
    return "https://media2locoloco-us.s3.amazonaws.com/spotify.png";
  } else if (socialType == "Telegram") {
    return "https://media2locoloco-us.s3.amazonaws.com/telegram.png";
  } else if (socialType == "Whatsapp") {
    return "https://media2locoloco-us.s3.amazonaws.com/whatsapp.png";
  } else if (socialType == "Snapchat") {
    return "https://media2locoloco-us.s3.amazonaws.com/snapchat.png";
  } else if (socialType == "Email") {
    return "https://media2locoloco-us.s3.amazonaws.com/envelope.png";
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

export const downloadAndSaveTikToks = async () => {
  // const res = await axios.put(
  //   "/v1/users/update/" + localStorage.getItem("USER_ID"),
  //   {
  //     processingTikToksStartTime: true,
  //   }
  // );
};
