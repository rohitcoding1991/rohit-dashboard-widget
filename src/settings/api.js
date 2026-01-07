import { api } from "@telesero/frontend-common";
import { getApiUrl, getBackofficeUrl } from "../constants";

// Get API URLs with fallback to hardcoded values
const REACT_APP_API = getApiUrl() || "https://portal.connx.cloud";
const REACT_APP_BACKOFFICE = getBackofficeUrl() || "https://portal.connx.cloud";

const application = api.createApi(`${REACT_APP_API}/api`);
export default application;
export const backoffice = api.createBackofficeApi();

export const loginRedirect = () => {
  const backofficeUrl = getBackofficeUrl() || "https://portal.connx.cloud";
  return (window.location.href = `${backofficeUrl}/login?redirect_url=${encodeURI(
    document.URL
  )}`);
};

export const logout = () => {
  const backofficeUrl = getBackofficeUrl() || "https://portal.connx.cloud";
  window.location.replace(`${backofficeUrl}/signout`);
};

export const requestErrorHandler = api.requestErrorHandler;
export const normalizeRequestError = api.normalizeRequestError;
export const deleteConflictHandler = api.deleteConflictHandler;
