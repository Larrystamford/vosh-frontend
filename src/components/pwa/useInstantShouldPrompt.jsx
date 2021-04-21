import { useState } from "react";

const useInstantShouldPrompt = () => {
  const [
    userShouldBePromptedToInstall,
    setUserShouldBePromptedToInstall,
  ] = useState(true);

  const handleUserSeeingInstallPrompt = () => {
    setUserShouldBePromptedToInstall(false);
  };

  return [userShouldBePromptedToInstall, handleUserSeeingInstallPrompt];
};
export default useInstantShouldPrompt;
