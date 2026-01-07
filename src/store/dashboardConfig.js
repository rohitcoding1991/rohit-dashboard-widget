import { createStore } from "react-hooks-global-state";

const initialState = {
  uiConfigurations: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "setUIConfigurations":
      return { ...state, uiConfigurations: action.payload };
    case "removeUIConfigurationByUuid":
      const oldData = state.uiConfigurations;
      const newData = [];
      if (oldData.length > 0) {
        oldData.forEach((uiConfiguration) => {
          if (uiConfiguration.uuid() !== action.payload) {
            newData.push(uiConfiguration);
          }
        });
      }

      return {
        ...state,
        uiConfigurations: newData,
      };
    default:
      return state;
  }
};

const { dispatch, useGlobalState, getState } = createStore(
  reducer,
  initialState
);

// actions
export const setUIConfigurations = (configurations) =>
  dispatch({ type: "setUIConfigurations", payload: configurations });
export const removeUIConfigurationByUuid = (uuid) =>
  dispatch({ type: "removeUIConfigurationByUuid", payload: uuid });

// getter
export const getUIConfigurations = () => getState().uiConfigurations;
export const getUIConfigurationByUuid = (uuid) =>
  getUIConfigurations().find(
    (uiConfiguration) => uiConfiguration.uuid() === uuid
  );

// hooks
export const useUIConfigurations = () => useGlobalState("uiConfigurations")[0];
