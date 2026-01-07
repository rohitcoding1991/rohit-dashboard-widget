export const getApiUrl = () =>
  window.__WIDGET_CONFIG__?.REACT_APP_API ||
  window.parent?.process?.env?.REACT_APP_API ||
  "https://portal.connx.cloud";

export const getBackofficeUrl = () =>
  window.__WIDGET_CONFIG__?.REACT_APP_BACKOFFICE ||
  window.parent?.process?.env?.REACT_APP_BACKOFFICE ||
  "https://portal.connx.cloud";
