import { store } from "@telesero/frontend-common";
import application from "../settings/api";
import { getUserPictureByUser } from "../utils/user";

const app = store.app(application.defaults.baseURL);

// actions
export const setUser = app.setUser;
export const setThemeType = store.common.setThemeType;
export const setUiSettings = store.common.setUiSettings;
export const setUserStatusAsIdle = store.common.setUserStatusAsIdle;
export const setUserStatusAsAvailable = store.common.setUserStatusAsAvailable;
export const setUserStatusAsNotAvailable =
  store.common.setUserStatusAsNotAvailable;

// hooks
/**
 * @type {function(): {id: number, username: string, email: string, roles: [], active: boolean, has_picture: boolean, name: string, second_name?: string, preferred_name?: string, last_name: string, gender: string, phone_number?: number, full_name: string, identifiers: [], ui_settings: { theme: string, reminderNotificationSoundVolume: number }, csrf_token: string, picture?: string}}
 */
export const useUser = app.useUser;
export const useThemeType = store.common.useThemeType;
export const useUserStatus = store.common.useUserStatus;
export const useUserPicture = () => getUserPictureByUser(app.useUser());

/**
 * @type {function(): {theme: string, reminderNotificationSoundVolume: number}}
 */
export const useUiSettings = store.common.useUiSettings;

// getters - stateless
export const getCsrfToken = app.getCsrfToken;
export const getUser = app.getUser;
export const getBackofficeUser = store.common.getBackofficeUser;
export const getUserPicture = () => getUserPictureByUser(app.getUser());
export const getThemeType = store.common.getThemeType;
export const getMenuPin = store.common.getMenuPin;
export const getUiSettings = store.common.getUiSettings;
export const getClient = app.getClient;
export const getUserStatus = store.common.getUserStatus;
export const isUserIdle = store.common.isUserIdle;
export const isUserAvailable = store.common.isUserAvailable;
export const isUserNotAvailable = store.common.isUserNotAvailable;
