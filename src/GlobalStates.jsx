import { createGlobalState } from "react-hooks-global-state";
const initialState = {
  isMuted: true,
  displayFeed: true,
  hasUserInfo: false,
  rerender: false,
  keyboard: false,
  loggedInUserId: "",
  newNotifcationsNum: 0,
  globalModalOpened: false,
  tiktokImporting: false,
  proCategories: { items: [] },
};
export const { useGlobalState } = createGlobalState(initialState);
