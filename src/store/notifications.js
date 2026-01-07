import { createStore } from "react-hooks-global-state";
import { utils, store } from "@telesero/frontend-common";

const { initStateWithPrevTab, setupStateSyncMiddleware, withStateSync } =
  utils.syncState;

const applyMiddleware = store.applyMiddleware;

const initialState = {
  notifications: [],
  unreadNotifications: [],
  alerts: []
};

const broadcast = {
  channel: "notifications-store",
  blacklist: ["addAlert", "removeAlert"],
  elector: true
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "addNotification":
      // check if none of the new already exist
      const notification = action.payload;
      if (!notification) return state;
      if (!Array.isArray(notification) || typeof notification !== "object")
        return state;

      const newNotifications = [notification].flat().filter(
        (n) =>
          !state.notifications.filter((n2) => {
            return n.id === n2.id;
          }).length > 0
      );

      const notifications = [...newNotifications, ...state.notifications];

      notifications.sort((a, b) => {
        const dateA = a.micro_timestamp;
        const dateB = b.micro_timestamp;

        return dateB - dateA;
      });
      return {
        ...state,
        notifications
      };
    case "markNotificationRead":
      return {
        ...state,
        notifications: state.notifications.map((notification) => {
          return notification.id === action.payload
            ? { ...notification, has_read: true }
            : notification;
        })
      };
    case "markAllNotificationsRead":
      return {
        ...state,
        notifications: state.notifications.map((n) => {
          action.payload.forEach((r) => {
            if (r === n.id) {
              n.has_read = true;
            }
          });

          return n;
        })
      };
    case "markNotificationUnRead":
      return {
        ...state,
        notifications: state.notifications.map((notification) => {
          return notification.id === action.payload
            ? { ...notification, has_read: false }
            : notification;
        })
      };
    case "markAllNotificationsUnRead":
      return {
        ...state,
        notifications: state.notifications.map((n) => {
          action.payload.forEach((r) => {
            if (r === n.id) {
              n.has_read = false;
            }
          });

          return n;
        })
      };
    case "setAllNotifications":
      return {
        ...state,
        notifications: action.payload.notifications
      };

    case "addAlert":
      return { ...state, alerts: [...state.alerts, action.payload] };

    case "setUnreadNotifications":
      return {
        ...state,
        unreadNotifications: action.payload
      };
    case "markUnreadNotificationsAsRead":
      return {
        ...state,
        unreadNotifications: state.unreadNotifications.map((n) => {
          n.has_read = true;
          return n;
        })
      };
    case "markUnreadNotificationAsReadById":
      return {
        ...state,
        unreadNotifications: state.unreadNotifications.map((n) => {
          if (n.id === action.payload) {
            n.has_read = true;
          }
          return n;
        })
      };
    default:
      return state;
  }
};

const syncMiddleware = setupStateSyncMiddleware(broadcast);

export const isLeader = syncMiddleware.isLeader;

const { dispatch, useGlobalState, getState } = createStore(
  withStateSync(reducer),
  initialState,
  applyMiddleware(syncMiddleware.middleware)
);

initStateWithPrevTab({ dispatch });

// actions
/**
 * @param {string} message
 * @param {OptionsObject} options
 */
export const addAlert = (message, options = undefined) =>
  dispatch({ type: "addAlert", payload: { message, options } });
export const addNotification = (notification) =>
  dispatch({ type: "addNotification", payload: notification });
export const markNotificationRead = (id) =>
  dispatch({ type: "markNotificationRead", payload: id });
export const markNotificationUnRead = (id) =>
  dispatch({ type: "markNotificationUnRead", payload: id });
export const markNotificationsRead = (ids) =>
  dispatch({ type: "markAllNotificationsRead", payload: ids });
export const markNotificationsUnRead = (ids) =>
  dispatch({ type: "markAllNotificationsUnRead", payload: ids });
export const setAllNotifications = (notifications) =>
  dispatch({
    type: "setAllNotifications",
    payload: {
      notifications
    }
  });

// unread notifications are those that appears in the notification popup.
// notifications are all notifications that appears in the notification drawer.
export const setUnreadNotifications = (unreadNotifications) => {
  dispatch({ type: "setUnreadNotifications", payload: unreadNotifications });
};
export const markUnreadNotificationsAsRead = () => {
  dispatch({ type: "markUnreadNotificationsAsRead" });
};
export const markUnreadNotificationAsReadById = (id) => {
  dispatch({ type: "markUnreadNotificationAsReadById", payload: id });
};

// hooks
export const useUnreadNotifications = () =>
  useGlobalState("unreadNotifications")[0];
export const useNotifications = () => useGlobalState("notifications")[0];
export const useAlerts = () => useGlobalState("alerts");

// getters
export const getUnreadNotifications = () => getState().unreadNotifications;
export const getNotifications = () => getState().notifications;
export const getAlerts = () => getState().alerts;
