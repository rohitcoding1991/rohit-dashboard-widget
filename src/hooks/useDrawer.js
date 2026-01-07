import { createGlobalState } from "react-hooks-global-state";
import { drawers } from "../settings/drawers";
import { useEffect, useCallback } from "react";

export const StatesDrawer = Object.freeze({
  OPEN: "open",
  CLOSED: "closed",
  PINNED: "pinned"
});

const initialNavigationDrawerState = {
  navigation: localStorage.getItem("navigation")
    ? JSON.parse(localStorage.getItem("navigation"))
    : null
};

const { useGlobalState, setGlobalState, getGlobalState } = createGlobalState(
  Object.assign(drawers, initialNavigationDrawerState)
);

export const open = (id) => setGlobalState(id, StatesDrawer.OPEN);
export const opened = (id) => getGlobalState(id) === StatesDrawer.OPEN;
export const close = (id) => setGlobalState(id, StatesDrawer.CLOSED);
export const closed = (id) => getGlobalState(id) === StatesDrawer.CLOSED;
export const pin = (id) => setGlobalState(id, StatesDrawer.PINNED);
export const pinned = (id) => getGlobalState(id) === StatesDrawer.PINNED;
export const status = (id) => getGlobalState(id);
export const toggle = (id) => (opened(id) ? close(id) : open(id));

export const useDrawer = (id, initialState) => {
  const [state] = useGlobalState(id);

  useEffect(() => {
    if (!initialState) initialState = StatesDrawer.CLOSED;
    if (!getGlobalState(id)) {
      setGlobalState(id, initialState);
    }
  }, []);

  const handleClose = useCallback(() => close(id), [id]);
  const handleOpen = useCallback(
    (pinned = false) => (pinned ? open(id) : pin(id)),
    [id]
  );
  const handlePin = useCallback(() => pin(id), [id]);

  return [state, handleOpen, handleClose, handlePin];
};
